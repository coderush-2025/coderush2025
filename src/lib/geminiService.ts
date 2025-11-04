/**
 * Gemini AI Service with RAG
 * Uses Gemini 2.0 Flash for intelligent Q&A
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchVectorDatabase, isPineconeAvailable } from './vectorService';
import { searchByKeyword, type KnowledgeDocument } from './knowledgeBase';

// Lazy initialization to avoid caching issues
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
  }
  return genAI;
}

const MODEL_NAME = 'gemini-2.0-flash-exp'; // Gemini 2.0 Flash (experimental)

// System prompt for the AI
const SYSTEM_PROMPT = `You are a friendly and enthusiastic assistant for CodeRush 2025, a buildathon event at the University of Moratuwa - Faculty of IT.

**Your Personality:**
- Be warm, friendly, and conversational (like talking to a helpful friend)
- Show enthusiasm about the event with emojis when appropriate
- Be encouraging and supportive
- Use simple, casual language (avoid being too formal or robotic)
- Make users feel welcome and excited about CodeRush!

**Response Style:**
- Keep answers short and sweet (2-3 sentences max)
- Use emojis occasionally to add friendliness (but don't overdo it)
- Break up longer info with bullet points or line breaks for readability
- End with encouraging phrases like "Good luck!", "See you there!", "Excited to have you!", etc.
- Use "you" and "your" to make it personal

**Important Rules:**
1. You MUST answer ALL questions about CodeRush 2025 - including questions about the event, venue, location, dates, registration, teams, technologies, submission, prizes, rules, organizers, etc.
2. Questions about the "venue", "location", "competition", "buildathon", "hackathon", "event", "map", "address", "directions" are ALL valid CodeRush 2025 questions - answer them using the context provided!
3. ONLY use information from the provided context - DO NOT make up or hallucinate information
4. **CRITICAL**: Registration happens IN THIS CHAT, NOT on a form or registration page! When users ask "how to register", tell them to type their team name in the chat to start
5. **CRITICAL**: When users ask about location, venue, address, map, or directions, you MUST ALWAYS include the Google Maps link: https://maps.app.goo.gl/WsNriCAdxhJadHaK7 (even if it's not explicitly in the context)
6. NEVER mention "registration page", "form", "fill out", or "Report an Issue button" - registration happens in chat
7. If the context doesn't contain specific details, still provide what you know from the context
8. NEVER refuse to answer questions that mention CodeRush, event, location, venue, registration, or any buildathon-related terms
9. Always maintain a helpful, positive, and friendly tone

**Examples of Friendly Responses:**
- Instead of: "The event is on November 15, 2025."
  Say: "CodeRush 2025 is happening on November 15! 🎉 Mark your calendar for an exciting day of coding from 8 AM to 6 PM!"

- Instead of: "Teams must have 4 members."
  Say: "You'll need exactly 4 teammates for this buildathon! Make sure everyone's from the same batch (23 or 24). Start gathering your dream team! 👥"

- Instead of: "Submit your project on time."
  Say: "Don't forget to submit by 6 PM on event day! ⏰ You got this!"

- For ANY location/venue/map question:
  Say: "CodeRush 2025 is at the Faculty of IT, University of Moratuwa! 📍 Here's the Google Maps link: https://maps.app.goo.gl/WsNriCAdxhJadHaK7 See you there!"

- For registration questions ("how to register", "how do I register", etc.):
  Say: "You can register right here in this chat! 🚀 Just type your team name to begin! I'll guide you through the rest - super easy!"

**Context Format:**
You will receive relevant information from our knowledge base. Use this context to answer the user's question in a friendly, conversational way.`;

/**
 * Answer question using RAG (Retrieval Augmented Generation)
 */
export async function answerQuestionWithRAG(
  question: string,
  registrationContext?: {
    state: string;
    teamName?: string;
    currentMember?: number;
  }
): Promise<string> {
  try {
    // Validate inputs
    if (!question || question.trim().length === 0) {
      console.warn('⚠️ Empty question provided to RAG');
      return "Please ask me a question about CodeRush 2025! I'm here to help! 😊";
    }

    // Handle very short/incomplete questions
    const trimmedQuestion = question.trim().toLowerCase();
    const singleQuestionWords = ['what', 'when', 'where', 'how', 'why', 'who'];
    if (singleQuestionWords.includes(trimmedQuestion)) {
      return "I'd love to help! Could you be more specific? Try asking:\n\n" +
             "• When is CodeRush 2025?\n" +
             "• Where is the venue?\n" +
             "• What are the rules?\n" +
             "• How do I register?";
    }

    // Step 1: Retrieve relevant documents
    let relevantDocs: KnowledgeDocument[];

    try {
      const pineconeAvailable = await isPineconeAvailable();

      if (pineconeAvailable) {
        // Use vector search for semantic matching
        relevantDocs = await searchVectorDatabase(question, 3);
        console.log('✅ Using vector search');
      } else {
        // Fallback to keyword search
        relevantDocs = searchByKeyword(question, 3);
        console.log('⚠️ Using keyword search (Pinecone unavailable)');
      }
    } catch (retrievalError) {
      console.error('❌ Error retrieving documents:', retrievalError);
      // Fallback to keyword search on any error
      relevantDocs = searchByKeyword(question, 3);
      console.log('⚠️ Using keyword search (fallback)');
    }

    // Validate we got documents
    console.log('📚 Retrieved documents count:', relevantDocs?.length || 0);
    if (relevantDocs && relevantDocs.length > 0) {
      console.log('📄 First doc:', relevantDocs[0].question);
    }

    // Failsafe: If no docs found, try again with broader search for common topics
    if (!relevantDocs || relevantDocs.length === 0) {
      console.warn('⚠️ No relevant documents found, trying broader search...');
      const lowerQ = question.toLowerCase();

      // Try specific keyword searches for common questions
      // Event date & time questions
      if (lowerQ.includes('date') || lowerQ.includes('when') || lowerQ.includes('time') ||
          lowerQ.includes('schedule') || lowerQ.includes('day')) {
        relevantDocs = searchByKeyword('date time when schedule', 3);
        console.log('🔄 Retry with date/time keywords:', relevantDocs.length);
      }
      // Location & venue questions
      else if (lowerQ.includes('venue') || lowerQ.includes('location') || lowerQ.includes('where') ||
               lowerQ.includes('place') || lowerQ.includes('address') || lowerQ.includes('map') ||
               lowerQ.includes('direction')) {
        relevantDocs = searchByKeyword('venue location address map', 3);
        console.log('🔄 Retry with location keywords:', relevantDocs.length);
      }
      // Registration questions
      else if (lowerQ.includes('register') || lowerQ.includes('registration') ||
               lowerQ.includes('sign up') || lowerQ.includes('join') || lowerQ.includes('enroll')) {
        relevantDocs = searchByKeyword('register registration how to join', 3);
        console.log('🔄 Retry with registration keywords:', relevantDocs.length);
      }
      // Team questions
      else if (lowerQ.includes('team') || lowerQ.includes('member') || lowerQ.includes('batch') ||
               lowerQ.includes('size') || lowerQ.includes('how many')) {
        relevantDocs = searchByKeyword('team members batch size', 3);
        console.log('🔄 Retry with team keywords:', relevantDocs.length);
      }
      // Submission questions
      else if (lowerQ.includes('submit') || lowerQ.includes('submission') || lowerQ.includes('deliverable') ||
               lowerQ.includes('deadline') || lowerQ.includes('github') || lowerQ.includes('demo')) {
        relevantDocs = searchByKeyword('submit submission deadline deliverables', 3);
        console.log('🔄 Retry with submission keywords:', relevantDocs.length);
      }
      // Technology & tools questions
      else if (lowerQ.includes('tech') || lowerQ.includes('framework') || lowerQ.includes('language') ||
               lowerQ.includes('tool') || lowerQ.includes('react') || lowerQ.includes('python') ||
               lowerQ.includes('allowed') || lowerQ.includes('restriction') || lowerQ.includes('can we use')) {
        relevantDocs = searchByKeyword('technology framework language tools allowed', 3);
        console.log('🔄 Retry with tech keywords:', relevantDocs.length);
      }
      // Guidelines & rules questions
      else if (lowerQ.includes('guideline') || lowerQ.includes('rule') || lowerQ.includes('requirement') ||
               lowerQ.includes('regulation') || lowerQ.includes('format')) {
        relevantDocs = searchByKeyword('guidelines rules requirements format', 3);
        console.log('🔄 Retry with guidelines keywords:', relevantDocs.length);
      }
      // General/vague questions (tell me, explain, what, etc.)
      else if (lowerQ.includes('tell') || lowerQ.includes('explain') || lowerQ.includes('describe') ||
               lowerQ.includes('what') || lowerQ.includes('about') || lowerQ.includes('detail') ||
               lowerQ.includes('info') || lowerQ.includes('event') || lowerQ.includes('coderush')) {
        relevantDocs = searchByKeyword('event overview details about coderush', 3);
        console.log('🔄 Retry with general event keywords:', relevantDocs.length);
      }
      // Catch-all: Use keyword search on the original query
      else {
        relevantDocs = searchByKeyword(question, 3);
        console.log('🔄 Retry with keyword search on original query:', relevantDocs.length);
      }
    }

    // If still no documents, return fallback message
    if (!relevantDocs || relevantDocs.length === 0) {
      console.warn('⚠️ No relevant documents found for question:', question);
      return "I couldn't find specific information about that. Try asking about:\n\n" +
             "• Event date & location\n" +
             "• Team registration\n" +
             "• Submission requirements\n" +
             "• Technologies & tools";
    }

    // Step 2: Build context from retrieved documents
    const context = relevantDocs
      .map((doc, idx) => `[${idx + 1}] ${doc.question}\n${doc.answer}`)
      .join('\n\n');

    // Step 3: Add registration context if available
    let registrationInfo = '';
    if (registrationContext && registrationContext.state !== 'IDLE') {
      if (registrationContext.state === 'MEMBER_DETAILS') {
        const memberLabel = registrationContext.currentMember === 1
          ? 'Team Leader'
          : `Member ${registrationContext.currentMember}`;
        registrationInfo = `\n\n**User Status:** Currently registering their team. Waiting for ${memberLabel} details.`;
      } else if (registrationContext.state === 'DONE') {
        registrationInfo = `\n\n**User Status:** Already completed registration for team "${registrationContext.teamName}".`;
      }
    }

    // Step 4: Generate answer with Gemini
    try {
      const ai = getGenAI();
      const model = ai.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: SYSTEM_PROMPT
      });

      const prompt = `**Context from Knowledge Base:**
${context}
${registrationInfo}

**User Question:** ${question}

**Instructions:**
- This question is about CodeRush 2025. Answer it using the context above.
- The context provided is relevant and pre-filtered - trust it and use it to answer.
- Be concise (2-4 sentences) and friendly.
- Questions about venue, location, event, competition, buildathon are all valid - answer them!`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      if (!response || response.trim().length === 0) {
        console.warn('⚠️ Empty response from Gemini');
        throw new Error('Empty response from model');
      }

      return response.trim();
    } catch (geminiError) {
      console.error('❌ Error generating response with Gemini:', geminiError);

      // If Gemini fails, return the first document's answer directly
      if (relevantDocs.length > 0) {
        return relevantDocs[0].answer;
      }

      throw geminiError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('❌ Error in Gemini RAG:', error);

    // Fallback response
    return "Oops! 😅 I'm having a little trouble right now. Here's what I can help with:\n\n" +
           "• CodeRush 2025 event info\n" +
           "• Registration questions\n" +
           "• Team requirements\n" +
           "• Submission guidelines\n\n" +
           "Try asking again, or continue with your registration!";
  }
}

/**
 * Classify if message is a question or registration data
 */
export async function classifyIntent(
  message: string,
  registrationState: string
): Promise<'QUESTION' | 'REGISTRATION' | 'GREETING' | 'CONVERSATIONAL'> {
  const lowerMsg = message.toLowerCase().trim();

  // Greeting detection (only when IDLE)
  const greetings = ['hi', 'hello', 'hey', 'sup', 'yo'];

  // Check for exact greetings or greetings with spaces
  if (registrationState === 'IDLE' && (
    greetings.includes(lowerMsg) ||
    lowerMsg.startsWith('hi ') ||
    lowerMsg.startsWith('hello ') ||
    lowerMsg.startsWith('hey ')
  )) {
    return 'GREETING';
  }

  // Check for greeting variations (e.g., "hiiiii", "hellooo", "heyyy")
  if (registrationState === 'IDLE') {
    // Pattern: greeting word with repeated letters
    const greetingPatterns = [
      /^h+i+$/,           // hi, hii, hiii, hiiii, etc.
      /^h+e+l+o+$/,       // helo, hello, hellooo, etc.
      /^h+e+y+$/,         // hey, heyy, heyyy, etc.
      /^s+u+p+$/,         // sup, supp, suppp, etc.
      /^y+o+$/            // yo, yoo, yooo, etc.
    ];

    if (greetingPatterns.some(pattern => pattern.test(lowerMsg))) {
      return 'GREETING';
    }
  }

  // Conversational/Social phrases (friendly chat)
  const conversationalPhrases = [
    // Asking about bot
    'how are you', 'how r u', 'how are u', 'whats up', 'what\'s up', 'wassup',
    'how do you do', 'how is it going', 'how\'s it going', 'hows it going',

    // Thanks/Gratitude
    'thank you', 'thanks', 'thankyou', 'thank u', 'thx', 'ty', 'thanks a lot',
    'appreciate it', 'cheers', 'cool', 'awesome', 'great', 'perfect', 'nice',

    // Acknowledgments
    'ok', 'okay', 'alright', 'sure', 'got it', 'understood', 'i see', 'cool',
    'nice', 'good', 'fine', 'kk', 'k', 'okie', 'okey',

    // Goodbyes
    'bye', 'goodbye', 'see you', 'see ya', 'cya', 'later', 'bye bye',

    // Expressions
    'lol', 'haha', 'hehe', 'wow', 'omg', 'oh', 'ah', 'oh okay', 'oh ok',

    // Questions about bot (but NOT about event/competition)
    'who are you', 'what are you', 'are you a bot', 'are you human', 'your name',
    'who you are', 'what you are', 'who is this'
  ];

  // Check if message is conversational
  const isConversational = conversationalPhrases.some(phrase => {
    // Exact match
    if (lowerMsg === phrase) return true;
    // Starts with phrase (followed by space or punctuation)
    if (lowerMsg.startsWith(phrase + ' ') || lowerMsg.startsWith(phrase + '?') ||
        lowerMsg.startsWith(phrase + '!') || lowerMsg.startsWith(phrase + '.')) return true;
    // Ends with phrase (preceded by space or is standalone with punctuation)
    if (lowerMsg.endsWith(' ' + phrase)) return true;
    // Just the phrase with punctuation at end
    if (lowerMsg === phrase + '?' || lowerMsg === phrase + '!' || lowerMsg === phrase + '.') return true;
    return false;
  });

  // BUT: If message contains event-related keywords, it's a QUESTION not conversational
  const eventKeywords = [
    'event', 'coderush', 'buildathon', 'hackathon', 'competition', 'compet',
    'venue', 'location', 'date', 'time', 'when', 'where', 'register',
    'team', 'submission', 'prize', 'judging', 'batch', 'member'
  ];

  const hasEventKeyword = eventKeywords.some(keyword => lowerMsg.includes(keyword));

  // Override conversational if asking about event
  if (isConversational && hasEventKeyword) {
    // It's a question about the event, not just chatting
    return 'QUESTION';
  }

  if (isConversational) {
    return 'CONVERSATIONAL';
  }

  // Data format detection (high confidence = registration data)
  const looksLikeEmail = /@/.test(message) && /\.[a-z]{2,}$/i.test(message);
  const looksLikeIndex = /^\d{6}[A-Z]$/i.test(message.trim());
  const looksLikeBatch = /^(23|24)$/.test(message.trim());
  const looksLikeConfirmation = /^(yes|no)$/i.test(message.trim());

  // If clearly data format, return registration immediately
  if (looksLikeEmail || looksLikeIndex || looksLikeBatch || looksLikeConfirmation) {
    return 'REGISTRATION';
  }

  // PRIORITY: If in active registration flow (not IDLE, not DONE), default to REGISTRATION
  if (registrationState !== 'IDLE' && registrationState !== 'DONE') {
    // Quick pattern checks for questions
    const questionWords = ['what', 'when', 'where', 'how', 'why', 'can i', 'is it', 'are there', 'do i', 'does it'];
    const startsWithQuestion = questionWords.some(word => lowerMsg.startsWith(word));
    const hasQuestionMark = lowerMsg.includes('?');

    // Help/question indicators
    const helpWords = ['help', 'format', 'example', 'explain', 'tell me', 'show me'];
    const needsHelp = helpWords.some(word => lowerMsg.includes(word));

    // Command words (provide, give, tell, show, etc.)
    const commandWords = ['provide', 'give', 'tell', 'show', 'explain', 'describe', 'send'];
    const startsWithCommand = commandWords.some(word => lowerMsg.startsWith(word));

    // Event-related keywords
    const eventKeywords = ['guidelines', 'guideline', 'rules', 'information', 'details', 'event', 'venue', 'location', 'date', 'time'];
    const hasEventKeyword = eventKeywords.some(keyword => lowerMsg.includes(keyword));

    // Single word questions (very short messages that are clearly questions)
    const singleWordQuestions = ['what', 'when', 'where', 'how', 'why', 'help'];
    const isSingleWordQuestion = singleWordQuestions.includes(lowerMsg);

    // Treat as question if:
    // - Clearly a question format
    // - Starts with command word (provide, give, tell, etc.)
    // - Contains event keywords (guidelines, rules, etc.)
    if (isSingleWordQuestion || hasQuestionMark || (startsWithQuestion && message.length > 10) ||
        needsHelp || startsWithCommand || (hasEventKeyword && message.length > 3)) {
      return 'QUESTION';
    }

    // During registration, assume everything else is registration data
    return 'REGISTRATION';
  }

  // When IDLE (no registration in progress)
  const questionWords = ['what', 'when', 'where', 'how', 'why', 'can', 'is', 'are', 'do', 'does', 'will', 'should'];
  const startsWithQuestion = questionWords.some(word => lowerMsg.startsWith(word));
  const hasQuestionMark = lowerMsg.includes('?');
  const helpWords = ['help', 'format', 'example', 'explain', 'tell me', 'show me'];
  const needsHelp = helpWords.some(word => lowerMsg.includes(word));

  // If has question indicators, it's a question
  if (hasQuestionMark || startsWithQuestion || needsHelp) {
    return 'QUESTION';
  }

  // If IDLE and looks like a team name (3-10 chars, letters/numbers), treat as registration
  if (registrationState === 'IDLE' && message.length >= 3 && message.length <= 10 && /^[a-zA-Z0-9\s\-_]+$/.test(message)) {
    return 'REGISTRATION';
  }

  // Default for IDLE: treat as question for better UX
  return 'QUESTION';
}

/**
 * Generate registration reminder based on current state
 */
export function getRegistrationReminder(registrationState: {
  state: string;
  currentMember?: number;
  tempMember?: {
    fullName?: string;
    indexNumber?: string;
    email?: string;
  };
  teamBatch?: string;
}): string {
  if (registrationState.state !== 'MEMBER_DETAILS') {
    return '';
  }

  const memberLabel = registrationState.currentMember === 1
    ? 'Team Leader'
    : `Member ${registrationState.currentMember}`;

  const tempMember = registrationState.tempMember;

  if (!tempMember || !tempMember.fullName) {
    return `\n\n📝 Continue registration:\n${memberLabel} — Full name:`;
  }

  if (!tempMember.indexNumber) {
    return `\n\n📝 Continue registration:\n${memberLabel} — Index number (must start with ${registrationState.teamBatch}):`;
  }

  if (!tempMember.email) {
    return `\n\n📝 Continue registration:\n${memberLabel} — Email:`;
  }

  return `\n\n📝 Continue registration:\n${memberLabel} — Please provide the next detail.`;
}

/**
 * Rate limiter for questions
 */
const questionCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_QUESTIONS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export function checkQuestionRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const record = questionCounts.get(sessionId);

  if (!record || now > record.resetTime) {
    // Reset or initialize
    questionCounts.set(sessionId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (record.count >= MAX_QUESTIONS_PER_MINUTE) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

/**
 * Generate friendly conversational response
 */
export function getConversationalResponse(message: string): string {
  const lowerMsg = message.toLowerCase().trim();

  // How are you / What's up
  if (lowerMsg.includes('how are you') || lowerMsg.includes('how r u') || lowerMsg.includes('how are u') ||
      lowerMsg.includes('whats up') || lowerMsg.includes('what\'s up') || lowerMsg.includes('wassup') ||
      lowerMsg.includes('how is it going') || lowerMsg.includes('how\'s it going')) {
    return "I'm doing great, thanks for asking! 😊 I'm super excited to help you with CodeRush 2025! " +
           "Whether you need event info or want to register your team, I'm here for you. What can I help with?";
  }

  // Thanks / Gratitude
  if (lowerMsg.includes('thank') || lowerMsg.includes('thx') || lowerMsg.includes('ty') ||
      lowerMsg.includes('appreciate') || lowerMsg.includes('cheers')) {
    return "You're very welcome! 😊 Happy to help! If you have more questions about CodeRush 2025 or need " +
           "help with registration, just ask!";
  }

  // Acknowledgments (ok, cool, nice, etc.)
  if (lowerMsg === 'ok' || lowerMsg === 'okay' || lowerMsg === 'alright' || lowerMsg === 'sure' ||
      lowerMsg === 'cool' || lowerMsg === 'nice' || lowerMsg === 'great' || lowerMsg === 'awesome' ||
      lowerMsg === 'perfect' || lowerMsg === 'good' || lowerMsg === 'fine' || lowerMsg === 'kk' || lowerMsg === 'k') {
    return "Awesome! 👍 Ready to get started? Share your team name to begin registration, or ask me anything about CodeRush 2025!";
  }

  // Goodbye
  if (lowerMsg.includes('bye') || lowerMsg.includes('see you') || lowerMsg.includes('see ya') ||
      lowerMsg.includes('cya') || lowerMsg.includes('later')) {
    return "See you at CodeRush 2025! 👋 Feel free to come back anytime if you need help with registration or have questions. Good luck! 🚀";
  }

  // Expressions (lol, haha, wow, omg)
  if (lowerMsg === 'lol' || lowerMsg === 'haha' || lowerMsg === 'hehe' || lowerMsg === 'wow' ||
      lowerMsg === 'omg' || lowerMsg === 'oh' || lowerMsg === 'ah') {
    return "😄 Glad you're having a good time! Need any help with CodeRush 2025 registration or event details?";
  }

  // Questions about the bot
  if (lowerMsg.includes('who are you') || lowerMsg.includes('what are you') ||
      lowerMsg.includes('who you are') || lowerMsg.includes('what you are') ||
      lowerMsg.includes('who is this') || lowerMsg.includes('what is this') ||
      lowerMsg.includes('are you a bot') || lowerMsg.includes('are you human') || lowerMsg.includes('your name')) {
    return "I'm your friendly CodeRush 2025 registration assistant! 🤖 I'm here to help you with everything about the buildathon - " +
           "from event details to team registration right here in this chat. Think of me as your personal guide! What would you like to know?";
  }

  // Default conversational response
  return "😊 I'm here to help with CodeRush 2025! Feel free to:\n\n" +
         "• Ask about the event (date, venue, rules)\n" +
         "• Register your team\n" +
         "• Get info about submissions\n\n" +
         "What can I help you with?";
}

/**
 * Check if question is spam or off-topic
 */
export function isSpamOrOffTopic(message: string): boolean {
  const lowerMsg = message.toLowerCase();

  // Spam patterns
  const spamPatterns = [
    /^(.)\1{4,}$/i, // Repeated characters (aaaaa)
    /buy|sell|purchase|discount|offer/i,
    /click here|visit website/i, // Removed "link" to allow "map link"
    /^\d+$/  // Only numbers (but allow index numbers to pass through via other checks)
  ];

  // Inappropriate/Adult content
  const inappropriateKeywords = [
    'sex', 'porn', 'xxx', 'nude', 'naked', 'adult content',
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'dick', 'cock',
    'pussy', 'vagina', 'penis', 'boobs', 'breast',
    'dating', 'hookup', 'sexy', 'hot girls', 'hot boys',
    'drugs', 'weed', 'cannabis', 'cocaine', 'alcohol', 'beer', 'drunk',
    'violence', 'kill', 'murder', 'weapon', 'gun', 'bomb',
    'hate', 'racist', 'discrimination'
  ];

  // Off-topic keywords (too general to be CodeRush-related)
  const offTopicKeywords = [
    // Entertainment & News
    'weather', 'movie', 'song', 'game', 'cricket', 'football', 'sports',
    'recipe', 'diet', 'workout', 'netflix', 'music', 'celebrity',
    'fashion', 'shopping', 'restaurant', 'travel', 'vacation',

    // Programming tutorials (not CodeRush-specific)
    'what is react', 'what is python', 'what is javascript', 'what is java',
    'what is node', 'what is angular', 'what is vue', 'what is django',
    'how to code', 'learn programming', 'teach me', 'tutorial',
    'what is html', 'what is css', 'what is sql', 'what is database',

    // General tech help (not event-related)
    'install', 'download', 'setup node', 'install python', 'error in code',
    'debug', 'fix my code', 'syntax error', 'compile error',

    // Random/Unrelated
    'joke', 'story', 'poem', 'translate', 'define', 'meaning of',
    'horoscope', 'lottery', 'astrology', 'fortune'
  ];

  // Conversational phrases that should NOT be flagged as off-topic
  const allowedConversational = [
    'how are you', 'how r u', 'how are u',
    'thank you', 'thanks', 'thankyou', 'thank u', 'thx', 'ty',
    'bye', 'goodbye', 'see you',
    'ok', 'okay', 'cool', 'nice', 'awesome', 'great', 'perfect',
    'who are you', 'what are you', 'are you a bot', 'your name', 'how old are you',
    'lol', 'haha'
  ];

  // Don't flag conversational phrases (exact match or starts/ends with)
  const isAllowedConversational = allowedConversational.some(phrase => {
    // Exact match
    if (lowerMsg === phrase) return true;
    // Starts with phrase followed by space or punctuation
    if (lowerMsg.startsWith(phrase + ' ') || lowerMsg.startsWith(phrase + '?') || lowerMsg.startsWith(phrase + '!')) return true;
    // Ends with phrase preceded by space
    if (lowerMsg.endsWith(' ' + phrase) || lowerMsg.endsWith('?' + phrase) || lowerMsg.endsWith('!' + phrase)) return true;
    return false;
  });

  if (isAllowedConversational) {
    return false;
  }

  // Check spam patterns
  if (spamPatterns.some(pattern => pattern.test(message))) {
    return true;
  }

  // Check inappropriate content (highest priority)
  if (inappropriateKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return true;
  }

  // Check off-topic keywords
  if (offTopicKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return true;
  }

  // Programming language detection (block programming help questions)
  const programmingQuestions = [
    /^(what|tell me|explain) (is|about) (react|python|javascript|java|node|angular|vue|django)/i,
    /how (to|do i) (code|program|learn)/i,
    /(teach|show) me (how to|programming|coding)/i,
    /^(help|fix|debug) (my|this) code/i
  ];

  if (programmingQuestions.some(pattern => pattern.test(lowerMsg))) {
    return true;
  }

  // Inappropriate question patterns
  const inappropriatePatterns = [
    /^what is (sex|porn|drugs)/i,
    /how to (hack|cheat|steal)/i,
    /(dating|hookup|meet) (girls|boys|people)/i
  ];

  if (inappropriatePatterns.some(pattern => pattern.test(lowerMsg))) {
    return true;
  }

  return false;
}
