import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import { states, validators, MEMBER_COUNT } from "@/lib/stateMachine";
import { appendToGoogleSheets } from "@/lib/googleSheets";
import { sendRegistrationEmail } from "@/lib/emailService";
import { Member } from "@/types/registration";
import { globalRateLimiter, getDuplicateErrorMessage, isDuplicateKeyError } from "@/lib/concurrencyHelpers";
import { answerQuestionWithRAG, classifyIntent, getRegistrationReminder, checkQuestionRateLimit, isSpamOrOffTopic, getConversationalResponse } from "@/lib/geminiService";

type ReqBody = {
  sessionId: string;
  message: string;
  editedData?: {
    teamName: string;
    teamBatch: string;
    members: Member[];
  };
};

const MAX_TEAMS = 100;

// Conversational phrases that indicate user wants something (used in Q&A detection)
const REQUEST_PHRASES = ['i want', 'i need', 'i ask', 'give me', 'send me', 'show me', 'tell me', 'no no', 'wait', 'actually'];

// Conversational phrases for team name extraction (includes common typos)
const TEAM_NAME_PHRASES = [
  // Correct spellings
  'my name is', 'i am', 'this is', 'my team is', 'we are',
  'our name is', 'our team is', 'our team name is', 'my team name is',
  'the team name is', 'team name is', 'hello i am', 'hi i am', 'i\'m',
  // Common typos
  'my tema is', 'our tema is', 'our tema name is', 'my tema name is',
  'the tema name is', 'tema name is', 'out team is', 'our team name',
  'my team name', 'our name', 'team name', 'our team', 'my team'
];

// Conversational phrases for member name extraction
const NAME_PHRASES = [
  'my name is', 'his name is', 'her name is', 'their name is',
  'name is', 'the name is', 'member name is', 'i am', 'he is', 'she is',
  'this is', 'it is', "it's", 'full name is', 'my full name is',
  'his full name is', 'her full name is'
];

// Conversational phrases for index number extraction
const INDEX_PHRASES = [
  'my index is', 'his index is', 'her index is', 'their index is',
  'index is', 'the index is', 'index number is', 'my index number is',
  'his index number is', 'her index number is', 'the index number is',
  'member index is', 'student index is'
];

// Conversational phrases for email extraction
const EMAIL_PHRASES = [
  'my email is', 'his email is', 'her email is', 'their email is',
  'email is', 'the email is', 'my email address is', 'his email address is',
  'her email address is', 'email address is', 'the email address is'
];

// Conversational phrases for batch selection extraction
const BATCH_PHRASES = [
  'my batch is', 'our batch is', 'batch is', 'the batch is',
  'we are batch', 'we are from batch', 'i am from batch', 'i am in batch',
  'our batch', 'my batch', 'batch', 'we are in batch', 'from batch'
];

/**
 * Smart extraction: Remove conversational phrases and extract relevant data
 */
function extractFromConversational(input: string, phrases: string[]): string {
  let result = input.trim();
  const lowerInput = result.toLowerCase();

  for (const phrase of phrases) {
    if (lowerInput.includes(phrase)) {
      const phraseIndex = lowerInput.indexOf(phrase);
      const afterPhrase = result.substring(phraseIndex + phrase.length).trim();

      if (afterPhrase.length >= 1) {
        result = afterPhrase;
        console.log(`🔍 Extracted "${result}" from phrase "${phrase}"`);
        break;
      }
    }
  }

  return result;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: Request) {
  try {
    console.log("🚀 Starting chat API request");
    await dbConnect();
    console.log("✅ Database connected");

    let body: ReqBody;
    try {
      body = await req.json();
      console.log("📝 Request body parsed:", { sessionId: body.sessionId, message: body.message?.substring(0, 50) });
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json({ reply: "Invalid request format" }, { status: 400 });
    }

    const sessionId = body.sessionId;
    const message = (body.message || "").trim();

    if (!sessionId) {
      console.error("❌ Missing sessionId");
      return NextResponse.json({ reply: "Missing sessionId" }, { status: 400 });
    }

    // Rate limiting - prevent abuse
    if (!globalRateLimiter.check(sessionId)) {
      console.warn("⚠️ Rate limit exceeded for session:", sessionId);
      return NextResponse.json({
        reply: "Please slow down! You're sending messages too quickly. Wait a moment and try again. ⏱️"
      }, { status: 429 });
    }

  // ============================================================================
  // RAG-POWERED Q&A SYSTEM (NEW - DOESN'T AFFECT REGISTRATION FLOW)
  // ============================================================================

  // Find or create session
  console.log("🔍 Looking for registration with sessionId:", sessionId);
  let reg = await Registration.findOne({ sessionId });

  // Check if user is asking a question (only if Gemini API is configured)
  if (process.env.GOOGLE_GEMINI_API_KEY && message) {
    // Classify user intent
    const currentState = reg?.state || 'IDLE';

    // CRITICAL: Skip RAG for specific registration states and data patterns
    // This ensures registration data is NEVER intercepted by the AI system
    const isInActiveRegistration = currentState !== 'IDLE' && currentState !== 'DONE';

    // Detect if message looks like registration data (not a question)
    const lowerMsg = message.toLowerCase().trim();

    // Skip RAG for "edit" command when registration is DONE
    if (currentState === 'DONE' && lowerMsg.includes('edit')) {
      console.log('⚡ Skipping RAG - edit command detected for DONE registration');
      // Fall through to registration logic below
    } else {
      const questionWords = ['what', 'when', 'where', 'how', 'why', 'can', 'is', 'are', 'do', 'does', 'will', 'should', 'which', 'who'];
      const helpKeywords = ['help', 'format', 'example', 'explain', 'tell me', 'show me'];
      const eventKeywords = ['venue', 'location', 'address', 'place', 'map', 'event', 'coderush', 'buildathon', 'hackathon', 'competition', 'guidelines', 'guideline', 'rules', 'information', 'details'];

      const startsWithQuestionWord = questionWords.some(word => lowerMsg.startsWith(word + ' ') || lowerMsg.startsWith(word + "'"));
      const containsQuestionWord = questionWords.some(word => lowerMsg.includes(' ' + word + ' ') || lowerMsg.includes(' ' + word + '?') || lowerMsg.endsWith(' ' + word));
      const containsHelpKeyword = helpKeywords.some(word => lowerMsg.includes(word));
      const containsConversationalPhrase = REQUEST_PHRASES.some(phrase => lowerMsg.includes(phrase));
      const containsEventKeyword = eventKeywords.some(keyword => lowerMsg.includes(keyword));
      const hasQuestionMark = message.includes('?');

      const looksLikeRegistrationData =
        /@/.test(message) || // Email
        /^\d{6}[A-Z]$/i.test(message.trim()) || // Index number
        /^(23|24)$/.test(message.trim()) || // Batch
        /^(yes|no)$/i.test(message.trim()) || // Confirmation
        // Name/data (not a question) - must not contain question/help/conversational/event keywords
        (message.length >= 2 && message.length <= 100 &&
         !hasQuestionMark &&
         !startsWithQuestionWord &&
         !containsQuestionWord &&
         !containsHelpKeyword &&
         !containsConversationalPhrase &&
         !containsEventKeyword &&
         !/^(provide|tell|give|show|explain|describe)/i.test(lowerMsg)); // Not asking for information

      // If in active registration and looks like data, SKIP RAG entirely
      if (isInActiveRegistration && looksLikeRegistrationData) {
        console.log('⚡ Skipping RAG - active registration detected with data pattern');
        console.log(`   Message: "${message}"`);
        // Fall through to registration logic below
      } else {
      // Only run intent classification if not clearly registration data
      console.log(`🔍 Message doesn't look like registration data: "${message}"`);
      console.log(`   State: ${currentState}, In active registration: ${isInActiveRegistration}`);
      const intent = await classifyIntent(message, currentState);
      console.log(`🧠 Intent classified as: ${intent} (State: ${currentState})`);

      // Handle questions with RAG
      if (intent === 'QUESTION') {
        console.log('📖 Triggering RAG for question...');

        // Check spam/off-topic
        if (isSpamOrOffTopic(message)) {
          let reply = "Hey! 👋 I'm here to help with CodeRush 2025 - the buildathon event! Ask me about:\n" +
                      "• Event details & schedule\n" +
                      "• Team registration\n" +
                      "• Submission guidelines\n" +
                      "• Requirements & rules";

          // Add registration reminder if user is mid-registration
          if (reg && currentState !== 'IDLE' && currentState !== 'DONE') {
            if (currentState === 'MEMBER_DETAILS') {
              reply += '\n' + getRegistrationReminder({
                state: currentState,
                currentMember: reg.currentMember,
                tempMember: reg.tempMember,
                teamBatch: reg.teamBatch
              });
            } else if (currentState === 'BATCH_SELECTION') {
              reply += '\n📝 Continue registration: Please select your team batch (23 or 24)';
            } else if (currentState === 'CONFIRMATION') {
              reply += '\n📝 Continue registration: Type "yes" to confirm or "no" to edit your details';
            }
          } else {
            reply += "\n\n🚀 Ready to register? Just type your team name to begin!";
          }

          return NextResponse.json({ reply });
        }

        // Check question rate limit
        if (!checkQuestionRateLimit(sessionId)) {
          return NextResponse.json({
            reply: "Whoa, lots of questions! 😄 Let's finish your registration first, then I'm happy to answer more. Ready to continue?"
          });
        }

        try {
          // Answer question using RAG
          const answer = await answerQuestionWithRAG(message, {
            state: currentState,
            teamName: reg?.teamName,
            currentMember: reg?.currentMember
          });

          // Add registration reminder if user is mid-registration
          let reminder = '';
          if (reg && currentState !== 'IDLE' && currentState !== 'DONE') {
            if (currentState === 'MEMBER_DETAILS') {
              reminder = getRegistrationReminder({
                state: currentState,
                currentMember: reg.currentMember,
                tempMember: reg.tempMember,
                teamBatch: reg.teamBatch
              });
            } else if (currentState === 'BATCH_SELECTION') {
              reminder = '\n\n📝 Continue registration: Please select your team batch (23 or 24)';
            } else if (currentState === 'CONFIRMATION') {
              reminder = '\n\n📝 Continue registration: Type "yes" to confirm or "no" to edit your details';
            }
          } else if (!reg || currentState === 'IDLE') {
            // User hasn't started registration yet - prompt them to register
            reminder = '\n\n🚀 Ready to register? Just type your team name to begin!';
          }

          console.log('✅ Question answered with RAG');
          return NextResponse.json({
            reply: answer + reminder
          });
        } catch (ragError) {
          console.error('❌ RAG error:', ragError);
          // Return fallback message instead of falling through to registration logic
          const fallbackMessage = "I'm having trouble answering right now. Here's what I can help with:\n\n" +
            "• CodeRush 2025 event info\n" +
            "• Team registration\n" +
            "• Submission requirements\n\n";

          let reminder = '';
          if (reg && currentState !== 'IDLE' && currentState !== 'DONE') {
            if (currentState === 'MEMBER_DETAILS') {
              reminder = getRegistrationReminder({
                state: currentState,
                currentMember: reg.currentMember,
                tempMember: reg.tempMember,
                teamBatch: reg.teamBatch
              });
            } else if (currentState === 'BATCH_SELECTION') {
              reminder = '\n\n📝 Continue registration: Please select your team batch (23 or 24)';
            } else if (currentState === 'CONFIRMATION') {
              reminder = '\n\n📝 Continue registration: Type "yes" to confirm or "no" to edit your details';
            }
          }

          return NextResponse.json({
            reply: fallbackMessage + reminder
          });
        }
      }

      // Handle greetings (only when IDLE)
      if (intent === 'GREETING' && currentState === 'IDLE') {
        return NextResponse.json({
          reply: "Hey there! 👋 Welcome to CodeRush 2025! 🚀\n\n" +
                 "I'm your registration assistant! I can help you:\n" +
                 "• Register your team (right here in chat!)\n" +
                 "• Answer event questions\n" +
                 "• Provide guidelines & rules\n\n" +
                 "Ready to register? Type your team name to begin! 😊\n" +
                 "Or ask me anything about CodeRush 2025!"
        });
      }

      // Handle conversational messages (friendly chat)
      if (intent === 'CONVERSATIONAL') {
        const response = getConversationalResponse(message);

        // Add registration reminder if user is mid-registration
        let reminder = '';
        if (reg && currentState !== 'IDLE' && currentState !== 'DONE') {
          if (currentState === 'MEMBER_DETAILS') {
            reminder = getRegistrationReminder({
              state: currentState,
              currentMember: reg.currentMember,
              tempMember: reg.tempMember,
              teamBatch: reg.teamBatch
            });
          } else if (currentState === 'BATCH_SELECTION') {
            reminder = '\n\n📝 Continue registration: Please select your team batch (23 or 24)';
          } else if (currentState === 'CONFIRMATION') {
            reminder = '\n\n📝 Continue registration: Type "yes" to confirm or "no" to edit your details';
          }
        } else if (!reg || currentState === 'IDLE') {
          // User hasn't started registration yet - prompt them to register
          reminder = '\n\n🚀 Ready to register? Just type your team name to begin!';
        }

        return NextResponse.json({
          reply: response + reminder
        });
      }
      }
    }
  }

  // ============================================================================
  // EXISTING REGISTRATION FLOW (UNCHANGED)
  // ============================================================================
  if (!reg) {
    console.log("✨ Creating new registration with team name");

    // Smart extraction: Remove conversational phrases and extract actual team name
    const trimmedTeamName = extractFromConversational(message || "", TEAM_NAME_PHRASES);

    // Validation 1: Empty or too short
    if (!trimmedTeamName || trimmedTeamName.length < 3) {
      return NextResponse.json({ reply: "❌ Team name must be at least 3 characters. Try again." });
    }

    // Validation 2: Maximum length (30 characters)
    if (trimmedTeamName.length > 30) {
      return NextResponse.json({ reply: "❌ Team name must be 30 characters or less. Try again." });
    }

    // Validation 3: Special characters - only allow letters, numbers, spaces, hyphens, underscores
    const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNamePattern.test(trimmedTeamName)) {
      return NextResponse.json({ reply: "❌ Team name can only contain letters, numbers, spaces, hyphens (-), and underscores (_). Try again." });
    }

    // Validation 4: Cannot be only numbers
    if (/^\d+$/.test(trimmedTeamName)) {
      return NextResponse.json({ reply: "❌ Team name cannot be only numbers. Please include letters. Try again." });
    }

    // Validation 5: Cannot be only spaces/special characters
    if (!/[a-zA-Z0-9]/.test(trimmedTeamName)) {
      return NextResponse.json({ reply: "❌ Team name must contain at least one letter or number. Try again." });
    }

    // Validation 6: Reserved words
    const reservedWords = ['admin', 'administrator', 'moderator', 'test', 'coderush', 'system', 'root', 'null', 'undefined'];
    if (reservedWords.includes(trimmedTeamName.toLowerCase())) {
      return NextResponse.json({ reply: "❌ This team name is reserved and cannot be used. Please choose another name." });
    }

    // Validation 7: Detect repeated characters (e.g., "aaaa", "1111")
    // Check if more than 70% of the name is the same character
    const charCounts = new Map<string, number>();
    for (const char of trimmedTeamName.toLowerCase()) {
      if (char !== ' ') {  // Ignore spaces
        charCounts.set(char, (charCounts.get(char) || 0) + 1);
      }
    }
    const maxCharCount = Math.max(...Array.from(charCounts.values()));
    const nonSpaceLength = trimmedTeamName.replace(/\s/g, '').length;
    if (maxCharCount / nonSpaceLength > 0.7) {
      return NextResponse.json({ reply: "❌ Team name looks suspicious (too many repeated characters). Please enter a real team name." });
    }

    // Validation 8: Detect test-like patterns
    const testPatterns = ['demo', 'sample', 'testing', 'temp', 'temporary', 'example', 'fake', 'dummy', 'asdf', 'qwerty', '1234', 'abcd'];
    const lowerTeamName = trimmedTeamName.toLowerCase();
    if (testPatterns.some(pattern => lowerTeamName.includes(pattern))) {
      return NextResponse.json({ reply: "❌ Team name appears to be a test or placeholder. Please enter your actual team name." });
    }

    // Validation 9: Detect question words and event-related terms
    const questionWords = ['what', 'where', 'when', 'who', 'why', 'how', 'which', 'prize', 'money', 'venue', 'location', 'date', 'time', 'event', 'registration', 'register', 'submit', 'guideline', 'rule'];
    if (questionWords.some(word => lowerTeamName.includes(word))) {
      return NextResponse.json({ reply: "❌ That doesn't look like a valid team name. Please enter your actual team name (3-30 characters)." });
    }

    // Check team count (only count completed registrations)
    const teamCount = await Registration.countDocuments({ state: "DONE" });
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json({ reply: `❌ Registration closed: maximum of ${MAX_TEAMS} teams reached.` });
    }
    console.log(`✅ Team count: ${teamCount}/${MAX_TEAMS}`);

    // Check uniqueness (case-insensitive) - only check completed registrations
    const exists = await Registration.findOne({
      teamName: { $regex: `^${escapeRegExp(trimmedTeamName)}$`, $options: "i" },
      state: "DONE"
    });
    if (exists) {
      return NextResponse.json({ reply: "❌ Team name already taken. Please choose another team name." });
    }

    // Create registration with team name and skip directly to batch selection
    reg = new Registration({
      sessionId,
      state: "BATCH_SELECTION",
      teamName: trimmedTeamName,
      members: []
    });
    await reg.save();
    console.log("💾 New registration saved with team name:", reg.teamName);

    return NextResponse.json({
      reply: `Awesome team name! 🎉 "${reg.teamName}" is registered!\n\nNow, which batch is your team from?\n(Remember: All 4 members must be from the same batch!)`,
      buttons: [
        { text: "Batch 23", value: "23" },
        { text: "Batch 24", value: "24" }
      ]
    });
  }
  
  console.log("📋 Found existing registration, state:", reg.state);

  // If registration is already complete, allow only specific actions
  if (reg.state === "DONE" && message !== "SAVE_EDITED_DATA") {
    // Allow "edit" command to open edit form
    if (message && message.toLowerCase().includes("edit")) {
      return NextResponse.json({
        reply: "📝 Click the button below to edit your registration details.\n\n⚠️ Note: Editing will update your registration and send a new confirmation email.",
        buttons: [
          { text: "📝 Edit Details", value: "OPEN_EDIT_FORM" }
        ],
        showEditForm: true,
        registrationData: {
          teamName: reg.teamName,
          teamBatch: reg.teamBatch,
          members: reg.members.map(m => ({
            fullName: m.fullName,
            indexNumber: m.indexNumber,
            email: m.email
          }))
        }
      });
    }

    return NextResponse.json({
      reply: "✅ This registration has already been submitted.",
      buttons: [
        { text: "📝 Edit Details", value: "edit" },
        { text: "🔄 Reset & Register New Team", value: "RESET" }
      ]
    });
  }

  // Handle save edited data
  if (message === "SAVE_EDITED_DATA") {
    const { editedData } = body;

    if (!editedData) {
      return NextResponse.json({ reply: "❌ No edited data provided." }, { status: 400 });
    }

    // Check if team name is already taken by another completed team
    const teamNameExists = await Registration.findOne({
      teamName: { $regex: `^${escapeRegExp(editedData.teamName)}$`, $options: "i" },
      state: "DONE",
      _id: { $ne: reg._id }
    });
    if (teamNameExists) {
      return NextResponse.json({
        reply: `❌ Team name "${editedData.teamName}" is already registered. Please choose another team name.`
      });
    }


    // Validate no duplicate index numbers within team
    const indexNumbers = editedData.members.map((m) => m.indexNumber);
    const duplicateIndexes = indexNumbers.filter((item: string, index: number) => indexNumbers.indexOf(item) !== index);
    if (duplicateIndexes.length > 0) {
      return NextResponse.json({
        reply: `❌ Duplicate index numbers found in your team: ${duplicateIndexes.join(', ')}. Each member must have a unique index number.`
      });
    }

    // Validate no duplicate emails within team
    const emails = editedData.members.map((m) => m.email.toLowerCase());
    const duplicateEmails = emails.filter((item: string, index: number) => emails.indexOf(item) !== index);
    if (duplicateEmails.length > 0) {
      return NextResponse.json({
        reply: `❌ Duplicate email addresses found in your team: ${duplicateEmails.join(', ')}. Each member must have a unique email address.`
      });
    }

    // Check if any index number exists in other teams
    for (const member of editedData.members) {
      const indexExists = await Registration.findOne({
        'members.indexNumber': member.indexNumber,
        state: 'DONE',
        _id: { $ne: reg._id }
      });

      if (indexExists) {
        return NextResponse.json({
          reply: `❌ Index number ${member.indexNumber} is already registered in another team. Please update this index number.`
        });
      }
    }

    // Check if any email exists in other teams
    for (const member of editedData.members) {
      const emailExists = await Registration.findOne({
        'members.email': { $regex: `^${escapeRegExp(member.email)}$`, $options: 'i' },
        state: 'DONE',
        _id: { $ne: reg._id }
      });

      if (emailExists) {
        return NextResponse.json({
          reply: `❌ Email ${member.email} is already registered in another team. Please update this email address.`
        });
      }
    }

    // Update registration with edited data
    reg.teamName = editedData.teamName;
    reg.teamBatch = editedData.teamBatch;
    reg.members = editedData.members.map((m) => ({
      fullName: m.fullName,
      indexNumber: m.indexNumber,
      batch: editedData.teamBatch, // All members have same batch
      email: m.email
    }));

    // Check if registration is complete (has all 4 members)
    const isComplete = reg.members.length === MEMBER_COUNT;

    if (isComplete) {
      // Check if this is an update to existing registration
      const isUpdate = reg.state === "DONE";

      // Complete registration
      reg.state = "DONE";
      await reg.save();

      console.log('📊 Saving to Google Sheets for team:', reg.teamName);

      // Save to Google Sheets
      try {
        const sheetsResult = await appendToGoogleSheets({
          teamName: reg.teamName || '',
          teamBatch: reg.teamBatch || '',
          members: reg.members || [],
          timestamp: new Date(),
        });

        if (sheetsResult.success) {
          console.log('✅ Registration saved to Google Sheets');
        } else {
          console.error('⚠️ Failed to save to Google Sheets:', sheetsResult.error);
        }
      } catch (sheetsError) {
        console.error('⚠️ Google Sheets error (non-blocking):', sheetsError);
      }

      // Send confirmation email to team leader
      console.log('📧 Sending confirmation email to:', reg.members[0]?.email);
      try {
        const emailResult = await sendRegistrationEmail({
          teamName: reg.teamName || '',
          teamBatch: reg.teamBatch || '',
          leaderName: reg.members[0]?.fullName || '',
          leaderEmail: reg.members[0]?.email || '',
          leaderIndex: reg.members[0]?.indexNumber || '',
          members: reg.members.slice(1).map(m => ({
            fullName: m.fullName,
            indexNumber: m.indexNumber,
            email: m.email,
          })),
        });

        if (emailResult.success) {
          console.log('✅ Confirmation email sent successfully');
        } else {
          console.error('⚠️ Failed to send email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('⚠️ Email error (non-blocking):', emailError);
      }

      if (isUpdate) {
        return NextResponse.json({
          reply: `✅ Registration Updated Successfully!\n\nYour team "${reg.teamName}" details have been updated for CodeRush 2025!\n\n📧 New confirmation email sent to ${reg.members[0]?.email}\n📊 Team data updated`,
          buttons: [
            { text: "📝 Edit Details", value: "edit" },
            { text: "🔄 Reset & Register New Team", value: "RESET" }
          ]
        });
      } else {
        return NextResponse.json({
          reply: `🎉 Registration Successful!\n\nYour team "${reg.teamName}" has been registered for CodeRush 2025!\n\n✅ Registration confirmed\n📧 Confirmation email sent to ${reg.members[0]?.email}\n📊 Team data saved\n\n🏆 Good luck and may the best team win!`,
          buttons: [
            { text: "📝 Edit Details", value: "edit" },
            { text: "🔄 Reset & Register New Team", value: "RESET" }
          ]
        });
      }
    } else {
      // Continue registration - ask for next member
      reg.currentMember = reg.members.length + 1;
      reg.tempMember = undefined;
      await reg.save();

      const nextMemberLabel = reg.currentMember === 1 ? "Team Leader (Member 1)" : `Member ${reg.currentMember}`;
      return NextResponse.json({
        reply: `Details saved! Let's continue.\n\n${nextMemberLabel} — Full name:`
      });
    }
  }

  if (reg.state === "DONE") {
    return NextResponse.json({
      reply: "✅ This session has already completed registration.\n\nTo register another team, please click the 🔄 Reset button at the top of the chat."
    });
  }

  // If in CONFIRMATION state and receiving any message other than yes/no, provide guidance
  if (reg.state === "CONFIRMATION" && message && !["yes", "no"].includes(message.toLowerCase())) {
    return NextResponse.json({
      reply: "❌ Invalid input. Please type 'yes' to confirm or 'no' to edit details.\n\nIf you want to start a new registration, click the 🔄 Reset button."
    });
  }

  // MEMBER_DETAILS loop (collect exactly MEMBER_COUNT members)
  if (reg.state === "MEMBER_DETAILS") {
    if (!reg.currentMember) reg.currentMember = 1;
    if (!reg.teamBatch) {
      return NextResponse.json({ reply: "❌ Error: Team batch not set. Please restart registration." });
    }

    console.log("🔍 MEMBER_DETAILS state - tempMember:", JSON.stringify(reg.tempMember, null, 2));
    console.log("🔍 Current member:", reg.currentMember, "Message:", message);

    const memberLabel = reg.currentMember === 1 ? "Team Leader (Member 1)" : `Member ${reg.currentMember}`;

    // fullName
    if (!reg.tempMember) {
      if (!message) return NextResponse.json({ reply: `${memberLabel} — Full name:` });

      // Smart extraction: Remove conversational phrases and extract actual name
      const trimmedMessage = extractFromConversational(message, NAME_PHRASES);
      const lowerMessage = trimmedMessage.toLowerCase();

      // Detect unhelpful responses
      const unhelpfulResponses = ['i dont know', 'i don\'t know', 'idk', 'dont know', 'don\'t know', 'skip', 'pass', 'next', 'later', 'unknown', 'not sure', 'no idea'];
      if (unhelpfulResponses.some(phrase => lowerMessage === phrase || lowerMessage.includes(phrase))) {
        return NextResponse.json({
          reply: `📝 Please provide the actual full name for ${memberLabel}. This is required for registration!\n\n${memberLabel} — Full name:`
        });
      }

      // Validate that name is not an email address
      if (trimmedMessage.includes('@') || /^[^\s]+@[^\s]+\.[^\s]+$/.test(trimmedMessage)) {
        return NextResponse.json({
          reply: `❌ That looks like an email address! Please provide the person's full name first.\n\n${memberLabel} — Full name:`
        });
      }

      // Validate that name is not an index number (e.g., 234001T)
      if (/^\d{6}[A-Z]$/i.test(trimmedMessage)) {
        return NextResponse.json({
          reply: `❌ That looks like an index number! Please provide the person's full name first.\n\n${memberLabel} — Full name:`
        });
      }

      // Validate that name is not just numbers (prevent batch numbers being used as names)
      if (/^\d+$/.test(trimmedMessage)) {
        return NextResponse.json({
          reply: `❌ Invalid name. Full name cannot be just numbers.\n\n${memberLabel} — Full name:`
        });
      }

      // Validate name has at least 2 characters
      if (trimmedMessage.length < 2) {
        return NextResponse.json({
          reply: `❌ Name must be at least 2 characters.\n\n${memberLabel} — Full name:`
        });
      }

      // Detect repeated characters (e.g., "aaaa", "1111")
      const charCounts = new Map<string, number>();
      for (const char of trimmedMessage.toLowerCase()) {
        if (char !== ' ') {  // Ignore spaces
          charCounts.set(char, (charCounts.get(char) || 0) + 1);
        }
      }
      const maxCharCount = Math.max(...Array.from(charCounts.values()));
      const nonSpaceLength = trimmedMessage.replace(/\s/g, '').length;
      if (maxCharCount / nonSpaceLength > 0.7) {
        return NextResponse.json({
          reply: `❌ Name looks suspicious (too many repeated characters). Please enter the actual full name.\n\n${memberLabel} — Full name:`
        });
      }

      // Detect test-like patterns and question-like inputs
      const testPatterns = ['test', 'demo', 'sample', 'testing', 'temp', 'example', 'fake', 'dummy', 'asdf', 'qwerty', 'abc', 'xyz'];
      if (testPatterns.some(pattern => lowerMessage.includes(pattern))) {
        return NextResponse.json({
          reply: `❌ Name appears to be a test or placeholder. Please enter the actual full name.\n\n${memberLabel} — Full name:`
        });
      }

      // Detect question words that indicate user is asking a question instead of providing name
      const questionWords = ['what', 'where', 'when', 'who', 'why', 'how', 'which', 'prize', 'money', 'venue', 'location', 'date', 'time', 'event', 'registration'];
      if (questionWords.some(word => lowerMessage.includes(word))) {
        return NextResponse.json({
          reply: `❌ That doesn't look like a person's name. Please enter the actual full name for ${memberLabel}.\n\n${memberLabel} — Full name:`
        });
      }

      // Check for duplicate names in current team (case-insensitive)
      const nameExistsInTeam = reg.members.some(m => m.fullName.toLowerCase() === lowerMessage);
      if (nameExistsInTeam) {
        return NextResponse.json({
          reply: `❌ This name (${trimmedMessage}) is already registered in your team. Each team member must have a unique name.\n\n${memberLabel} — Full name:`
        });
      }

      reg.tempMember = { fullName: trimmedMessage, batch: reg.teamBatch };
      await reg.save();
      const emoji = reg.currentMember === 1 ? "👑" : "👤";
      return NextResponse.json({ reply: `${emoji} ${memberLabel}: ${trimmedMessage}\n📝 What's ${trimmedMessage}'s index number?\n(Format: ${reg.teamBatch}****X - Example: ${reg.teamBatch}4001T)` });
    }

    // indexNumber (validate against team batch)
    if (reg.tempMember && !reg.tempMember.indexNumber) {
      // Smart extraction: Remove conversational phrases and extract actual index
      const extracted = extractFromConversational(message, INDEX_PHRASES);
      const trimmedMessage = extracted.trim().toUpperCase();
      const lowerMessage = extracted.trim().toLowerCase();

      // Detect unhelpful responses
      const unhelpfulResponses = ['i dont know', 'i don\'t know', 'idk', 'dont know', 'don\'t know', 'skip', 'pass', 'next', 'later', 'unknown', 'not sure', 'no idea', 'no index', 'none'];
      if (unhelpfulResponses.some(phrase => lowerMessage === phrase || lowerMessage.includes(phrase))) {
        return NextResponse.json({
          reply: `📝 Please provide the actual index number for ${memberLabel}. This is required for registration!\n\n${memberLabel} — Index number:\n(Format: ${reg.teamBatch}****X - Example: ${reg.teamBatch}4001T)`
        });
      }

      // Detect question words
      const questionWords = ['what', 'where', 'when', 'who', 'why', 'how', 'which', 'prize', 'money', 'venue', 'location', 'date', 'time', 'event', 'registration'];
      if (questionWords.some(word => lowerMessage.includes(word))) {
        return NextResponse.json({
          reply: `❌ That doesn't look like an index number. Please enter the actual index number for ${memberLabel}.\n\n${memberLabel} — Index number:\n(Format: ${reg.teamBatch}****X - Example: ${reg.teamBatch}4001T)`
        });
      }

      if (!validators.index(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid index number. Must be 6 digits followed by a capital letter (e.g., 234001T)." });
      }

      // Validate that index number starts with the team batch
      const indexBatch = trimmedMessage.substring(0, 2);
      if (indexBatch !== reg.teamBatch) {
        return NextResponse.json({
          reply: `❌ Index number must start with your team batch ${reg.teamBatch}. You entered ${indexBatch}. Please enter a valid index number:`
        });
      }

      // Detect suspicious patterns (repeated digits or sequential patterns)
      const middleFourDigits = trimmedMessage.substring(2, 6);

      // Check for repeated digits (e.g., "1111", "4444")
      if (/^(.)\1{3}$/.test(middleFourDigits)) {
        return NextResponse.json({
          reply: `❌ The index number looks suspicious (repeated digits). Please enter your actual UoM index number:\n(Format: ${reg.teamBatch}****X - Example: ${reg.teamBatch}4001T)`
        });
      }

      // Check for sequential patterns (e.g., "1234", "5678")
      const isSequential = ['0123', '1234', '2345', '3456', '4567', '5678', '6789'].includes(middleFourDigits);
      if (isSequential) {
        return NextResponse.json({
          reply: `❌ The index number looks suspicious (sequential pattern). Please enter your actual UoM index number:\n(Format: ${reg.teamBatch}****X - Example: ${reg.teamBatch}4001T)`
        });
      }

      // Check if index number already exists in current team
      const indexExistsInTeam = reg.members.some(m => m.indexNumber === trimmedMessage);
      if (indexExistsInTeam) {
        return NextResponse.json({
          reply: `❌ This index number (${trimmedMessage}) is already registered in your team. Please enter a different index number:`
        });
      }

      // Check if index number exists in any other completed registration
      const indexExists = await Registration.findOne({
        'members.indexNumber': trimmedMessage,
        state: 'DONE',
        _id: { $ne: reg._id }
      });

      if (indexExists) {
        return NextResponse.json({
          reply: `❌ This index number (${trimmedMessage}) is already registered in another team. Please enter a valid index number:`
        });
      }

      // Create a new tempMember object to ensure proper MongoDB update
      reg.tempMember = {
        ...reg.tempMember,
        indexNumber: trimmedMessage
      };

      // Mark the field as modified for mongoose
      reg.markModified('tempMember');
      await reg.save();
      const emoji = reg.currentMember === 1 ? "👑" : "👤";
      const memberName = reg.tempMember?.fullName || memberLabel;
      return NextResponse.json({ reply: `${emoji} ${memberLabel}: ${memberName}\n📧 What's ${memberName}'s email address?` });
    }

    // email
    if (reg.tempMember && reg.tempMember.indexNumber && !reg.tempMember.email) {
      // Smart extraction: Remove conversational phrases and extract actual email
      const extracted = extractFromConversational(message, EMAIL_PHRASES);
      const trimmedMessage = extracted.trim();
      const lowerEmail = trimmedMessage.toLowerCase();

      // Detect unhelpful responses
      const unhelpfulResponses = ['i dont know', 'i don\'t know', 'idk', 'dont know', 'don\'t know', 'skip', 'pass', 'next', 'later', 'unknown', 'not sure', 'no idea', 'no email', 'none'];
      if (unhelpfulResponses.some(phrase => lowerEmail === phrase || lowerEmail.includes(phrase))) {
        return NextResponse.json({
          reply: `📝 Please provide the actual email address for ${memberLabel}. This is required for registration!\n\n${memberLabel} — Email:`
        });
      }

      // Detect question words
      const questionWords = ['what', 'where', 'when', 'who', 'why', 'how', 'which', 'prize', 'money', 'venue', 'location', 'date', 'time', 'event', 'registration'];
      if (questionWords.some(word => lowerEmail.includes(word))) {
        return NextResponse.json({
          reply: `❌ That doesn't look like an email address. Please enter the actual email address for ${memberLabel}.\n\n${memberLabel} — Email:`
        });
      }

      // Check for common email typos
      const commonTypos = ['gamil.com', 'gmai.com', 'gmial.com', 'yahooo.com', 'yaho.com', 'hotmial.com', 'outlok.com'];
      const typoFound = commonTypos.find(typo => lowerEmail.includes(typo));
      if (typoFound) {
        const suggestions: Record<string, string> = {
          'gamil.com': 'gmail.com',
          'gmai.com': 'gmail.com',
          'gmial.com': 'gmail.com',
          'yahooo.com': 'yahoo.com',
          'yaho.com': 'yahoo.com',
          'hotmial.com': 'hotmail.com',
          'outlok.com': 'outlook.com'
        };
        return NextResponse.json({
          reply: `❌ Possible typo detected! Did you mean "${suggestions[typoFound]}" instead of "${typoFound}"?\n\nPlease re-enter the correct email:`
        });
      }

      // Check for invalid characters like backslashes
      if (trimmedMessage.includes('\\') || trimmedMessage.includes('/')) {
        return NextResponse.json({ reply: "❌ Invalid email. Email cannot contain backslashes or forward slashes. Please enter a valid email address." });
      }

      if (!validators.email(trimmedMessage)) {
        return NextResponse.json({ reply: "❌ Invalid email. Please enter a valid email address (e.g., name@example.com)." });
      }

      // Check if email already exists in current team
      const emailExistsInTeam = reg.members.some(m => m.email.toLowerCase() === trimmedMessage.toLowerCase());
      if (emailExistsInTeam) {
        return NextResponse.json({
          reply: `❌ This email (${trimmedMessage}) is already registered in your team. Please enter a different email address:`
        });
      }

      // Check if email exists in any other completed registration
      const emailExists = await Registration.findOne({
        'members.email': { $regex: `^${escapeRegExp(trimmedMessage)}$`, $options: 'i' },
        state: 'DONE',
        _id: { $ne: reg._id }
      });

      if (emailExists) {
        return NextResponse.json({
          reply: `❌ This email (${trimmedMessage}) is already registered in another team. Please enter a valid email address:`
        });
      }

      // Create a new tempMember object to ensure proper MongoDB update
      reg.tempMember = {
        ...reg.tempMember,
        email: trimmedMessage
      };

      // push completed member
      reg.members.push(reg.tempMember as Required<typeof reg.tempMember>);
      reg.tempMember = undefined;

      // Mark the fields as modified for mongoose
      reg.markModified('members');
      reg.markModified('tempMember');
      await reg.save();

      if ((reg.members || []).length < MEMBER_COUNT) {
        const justAddedMember = reg.members[reg.members.length - 1];
        reg.currentMember = (reg.currentMember || 1) + 1;
        await reg.save();
        const nextMemberLabel = `Member ${reg.currentMember}`;
        const progress = `(${reg.members.length}/${MEMBER_COUNT} members added)`;
        return NextResponse.json({
          reply: `✅ ${justAddedMember.fullName} added successfully! ${progress}\n\n👤 ${nextMemberLabel}\nWhat's ${nextMemberLabel}'s full name?`
        });
      } else {
        reg.state = "CONFIRMATION";
        await reg.save();
        const summaryLines = [
          `🎉 Awesome! All team members added! (4/4)\n`,
          `📋 Team Registration Summary`,
          `━━━━━━━━━━━━━━━━━━━━━`,
          `🏆 Team: ${reg.teamName}`,
          `📚 Batch: ${reg.teamBatch}`,
          `\n👥 Team Members:`,
          ...(reg.members || []).map((m, i: number) => `${i === 0 ? '👑' : '👤'} ${i + 1}. ${m.fullName}\n   📝 ${m.indexNumber}\n   📧 ${m.email}`),
        ];
        const summary = summaryLines.join("\n");
        return NextResponse.json({
          reply: `${summary}\n\n${states.CONFIRMATION.prompt}`,
          buttons: [
            { text: "Yes", value: "yes" },
            { text: "No", value: "no" }
          ]
        });
      }
    }

    // Fallback case - this shouldn't happen but provides debugging info
    console.log("⚠️ Unexpected MEMBER_DETAILS state:", {
      hasTempMember: !!reg.tempMember,
      tempMember: reg.tempMember,
      currentMember: reg.currentMember
    });

    // Determine what to ask for based on current state
    if (reg.tempMember) {
      if (!reg.tempMember.indexNumber) {
        return NextResponse.json({ reply: `${memberLabel} — Index number (must start with ${reg.teamBatch}):` });
      } else if (!reg.tempMember.email) {
        return NextResponse.json({ reply: `${memberLabel} — Email:` });
      }
    } else {
      return NextResponse.json({ reply: `${memberLabel} — Full name:` });
    }
  }

  // handle other states
  const cfg = states[reg.state];
  if (!cfg) return NextResponse.json({ reply: "Invalid state. Please start again." });

  // BATCH_SELECTION handling
  if (reg.state === "BATCH_SELECTION") {
    // Apply smart extraction for batch selection
    const extracted = extractFromConversational(message, BATCH_PHRASES);
    const trimmedMessage = extracted.trim();

    // Check if this is a question instead of batch selection
    const lowerMsg = trimmedMessage.toLowerCase();
    const questionWords = ['what', 'when', 'where', 'how', 'why', 'can', 'is', 'are', 'do', 'does', 'will', 'should', 'which', 'who', 'tell', 'give', 'show', 'explain'];
    const isLikelyQuestion = questionWords.some(word => lowerMsg.includes(word)) || lowerMsg.includes('?');

    // If it looks like a question, let it go through the question handler above
    // The question handler should have already caught it, but if we're here,
    // it means the message passed through - so validate batch

    if (!validators.batch(trimmedMessage)) {
      return NextResponse.json({
        reply: "❌ Invalid batch. Please select Batch 23 or Batch 24:",
        buttons: [
          { text: "Batch 23", value: "23" },
          { text: "Batch 24", value: "24" }
        ]
      });
    }

    reg.teamBatch = trimmedMessage;
    reg.state = "MEMBER_DETAILS";
    reg.currentMember = 1;
    reg.tempMember = undefined;
    await reg.save();

    return NextResponse.json({
      reply: `Perfect! Batch ${reg.teamBatch} selected! ✅\n\nNow let's add your team members! 👥\n\n👑 Team Leader (Member 1)\nWhat's the team leader's full name?`
    });
  }

  // Handle CONFIRMATION state
  if (reg.state === "CONFIRMATION") {
    const trimmedMessage = message.trim().toLowerCase();

    if (!["yes", "no"].includes(trimmedMessage)) {
      return NextResponse.json({ reply: "❌ Invalid input. Please type 'yes' to confirm or 'no' to edit details." });
    }

    if (trimmedMessage === "no") {
      // User wants to edit - send edit form data with a button
      return NextResponse.json({
        reply: "💡 Click the button below to edit your registration details.\n\n📝 When you save your changes, a new confirmation email will be sent automatically.",
        buttons: [
          { text: "📝 Edit Details", value: "OPEN_EDIT_FORM" }
        ],
        showEditForm: true,
        registrationData: {
          teamName: reg.teamName,
          teamBatch: reg.teamBatch,
          members: reg.members.map(m => ({
            fullName: m.fullName,
            indexNumber: m.indexNumber,
            email: m.email
          }))
        }
      });
    }

    // User said "yes" - directly complete the registration
    if (trimmedMessage === "yes") {
      reg.state = "DONE";
      await reg.save();

      console.log('📊 Saving to Google Sheets for team:', reg.teamName);

      // Save to Google Sheets
      try {
        const sheetsResult = await appendToGoogleSheets({
          teamName: reg.teamName || '',
          teamBatch: reg.teamBatch || '',
          members: reg.members || [],
          timestamp: new Date(),
        });

        if (sheetsResult.success) {
          console.log('✅ Registration saved to Google Sheets');
        } else {
          console.error('⚠️ Failed to save to Google Sheets:', sheetsResult.error);
        }
      } catch (sheetsError) {
        console.error('⚠️ Google Sheets error (non-blocking):', sheetsError);
      }

      // Send confirmation email to team leader
      console.log('📧 Sending confirmation email to:', reg.members[0]?.email);
      try {
        const emailResult = await sendRegistrationEmail({
          teamName: reg.teamName || '',
          teamBatch: reg.teamBatch || '',
          leaderName: reg.members[0]?.fullName || '',
          leaderEmail: reg.members[0]?.email || '',
          leaderIndex: reg.members[0]?.indexNumber || '',
          members: reg.members.slice(1).map(m => ({
            fullName: m.fullName,
            indexNumber: m.indexNumber,
            email: m.email,
          })),
        });

        if (emailResult.success) {
          console.log('✅ Confirmation email sent successfully');
        } else {
          console.error('⚠️ Failed to send email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('⚠️ Email error (non-blocking):', emailError);
      }

      return NextResponse.json({
        reply: `🎉 Registration Successful!\n\nYour team "${reg.teamName}" has been registered for CodeRush 2025!\n\n✅ Registration confirmed\n📧 Confirmation email sent to ${reg.members[0]?.email}\n📊 Team data saved\n\n🏆 Good luck and may the best team win!`,
        buttons: [
          { text: "📝 Edit Details", value: "edit" },
          { text: "🔄 Reset & Register New Team", value: "RESET" }
        ]
      });
    }
  } else {
    // generic validations for other states
    if (cfg.validate && !cfg.validate(message)) {
      return NextResponse.json({ reply: "❌ Invalid input. Please try again." });
    }

    if (cfg.save) cfg.save(reg, message);

    // advance state
    reg.state = cfg.next || reg.state;
    await reg.save();
  }

  // If we moved to CONFIRMATION, prepare summary
  if (reg.state === "CONFIRMATION") {
    const summaryLines = [
      `Team: ${reg.teamName}`,
      `Batch: ${reg.teamBatch}`,
      `Members:`,
      ...(reg.members || []).map((m, i: number) => `${i + 1}. ${m.fullName} — ${m.indexNumber} — ${m.email}`),
    ];
    const summary = summaryLines.join("\n");
    return NextResponse.json({
      reply: `${summary}\n\n${states.CONFIRMATION.prompt}`,
      buttons: [
        { text: "Yes", value: "yes" },
        { text: "No", value: "no" }
      ]
    });
  }

  // finalize on DONE
  if (reg.state === "DONE") {

    // final checks
    const teamCount = await Registration.countDocuments({ state: "DONE" });
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json({ reply: `❌ Registration failed: maximum of ${MAX_TEAMS} teams reached.` });
    }
    console.log(`✅ Finalizing registration. Team count: ${teamCount + 1}/${MAX_TEAMS}`);

    const exists = await Registration.findOne({ teamName: { $regex: `^${escapeRegExp(reg.teamName || "")}$`, $options: "i" }, _id: { $ne: reg._id } });
    if (exists) {
      return NextResponse.json({ reply: "❌ Team name conflict detected. Please restart and choose another team name." });
    }

    await reg.save();

    // Save to Google Sheets
    try {
      const sheetsResult = await appendToGoogleSheets({
        teamName: reg.teamName || '',
        teamBatch: reg.teamBatch || '',
        members: reg.members || [],
        timestamp: new Date(),
      });
      
      if (sheetsResult.success) {
        console.log('✅ Registration saved to Google Sheets');
      } else {
        console.error('⚠️ Failed to save to Google Sheets:', sheetsResult.error);
      }
    } catch (sheetsError) {
      console.error('⚠️ Google Sheets error (non-blocking):', sheetsError);
      // Don't fail the registration if Google Sheets fails
    }

    // Optionally send confirmation email here

    return NextResponse.json({ reply: states.DONE.prompt });
  }

  // default fallback prompt
  return NextResponse.json({ reply: states[reg.state]?.prompt || "Okay." });

  } catch (error: unknown) {
    // Handle MongoDB duplicate key errors (race conditions)
    if (isDuplicateKeyError(error)) {
      console.error("⚠️ Duplicate key error detected:", (error as { keyPattern?: Record<string, unknown> }).keyPattern);
      return NextResponse.json({
        reply: getDuplicateErrorMessage(error)
      });
    }

    // Handle other errors
    console.error("❌ API Error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({
      reply: "❌ An error occurred while processing your request. Please try again."
    }, { status: 500 });
  }
}