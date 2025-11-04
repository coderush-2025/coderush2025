/**
 * Knowledge Base for CodeRush 2025
 * Contains all platform information for RAG system
 */

export interface KnowledgeDocument {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  priority: number; // Higher = more important
}

export const knowledgeBase: KnowledgeDocument[] = [
  // Event Information
  {
    id: "event-overview",
    category: "event",
    question: "What is CodeRush 2025? Tell me about the event details.",
    answer: "CodeRush 2025 is a 10-hour buildathon happening on November 15, 2025 (8 AM - 6 PM) at the University of Moratuwa - Faculty of IT! 🚀 It's an exciting coding competition where teams of 4 students work on real-world scenario-based problems. You can use ANY technology or framework you want! Registration is open now (max 100 teams, first-come first-served). Awards ceremony is on November 25th. Here's the venue: https://maps.app.goo.gl/WsNriCAdxhJadHaK7",
    keywords: ["event details", "about event", "what is", "overview", "tell me about", "coderush", "event info", "details", "information", "about", "explain", "describe", "this event", "the event"],
    priority: 10
  },
  {
    id: "competition-guidelines",
    category: "event",
    question: "What are the competition guidelines and rules?",
    answer: "Here are the key guidelines for CodeRush 2025:\n\n👥 Teams: Exactly 4 members from same batch (23 or 24)\n⏰ Duration: 10 hours (8 AM - 6 PM, November 15, 2025)\n💻 Tech: Use ANY technology/framework you want!\n📝 Submission: GitHub repo (public) + Google Drive folder with demo video & report\n🚫 Rules: No pre-written code, must start fresh on event day\n🎯 Topic: Real-world scenario-based problem\n\nYou got this! 🚀",
    keywords: ["guidelines", "rules", "requirements", "regulations", "competition rules", "event rules", "what are rules", "competition guidelines"],
    priority: 10
  },
  {
    id: "event-date",
    category: "event",
    question: "When is CodeRush 2025?",
    answer: "CodeRush 2025 is on November 15, 2025, from 8:00 AM to 6:00 PM. It's a 10-hour buildathon challenge.",
    keywords: ["date", "when", "time", "schedule", "day", "november"],
    priority: 10
  },
  {
    id: "event-venue",
    category: "event",
    question: "Where is CodeRush 2025 held?",
    answer: "CodeRush 2025 is held at the University of Moratuwa - Faculty of Information Technology. 📍 You can find the exact location here: https://maps.app.goo.gl/WsNriCAdxhJadHaK7",
    keywords: ["where", "venue", "location", "place", "university", "moratuwa", "address", "map", "directions", "competition", "buildathon", "hackathon", "event"],
    priority: 9
  },
  {
    id: "venue-directions",
    category: "event",
    question: "How do I get to the venue?",
    answer: "The event is at the Faculty of IT, University of Moratuwa. Here's the Google Maps link for directions: https://maps.app.goo.gl/WsNriCAdxhJadHaK7 📍 Make sure to arrive by 8:00 AM on November 15, 2025!",
    keywords: ["directions", "how to get", "map", "location", "navigate", "find venue", "competition", "buildathon", "event"],
    priority: 8
  },
  {
    id: "venue-map-link",
    category: "event",
    question: "Can you send me the map link?",
    answer: "Sure! Here's the Google Maps link to the venue (Faculty of IT, University of Moratuwa): https://maps.app.goo.gl/WsNriCAdxhJadHaK7 📍 Save it and see you there on November 15, 2025!",
    keywords: ["map link", "google maps", "send map", "share location", "gps", "coordinates", "competition", "buildathon", "event"],
    priority: 9
  },
  {
    id: "event-duration",
    category: "event",
    question: "How long is the buildathon?",
    answer: "The buildathon is a 10-hour challenge, running from 8:00 AM to 6:00 PM on November 15, 2025.",
    keywords: ["duration", "how long", "hours", "time limit"],
    priority: 8
  },
  {
    id: "event-awards",
    category: "event",
    question: "When is the awards ceremony?",
    answer: "The awards ceremony will be held on November 25, 2025, at 8:00 AM. Winners will be announced and prizes distributed.",
    keywords: ["awards", "ceremony", "prizes", "winners", "announcement"],
    priority: 8
  },

  // Team Requirements
  {
    id: "team-size",
    category: "team",
    question: "How many members per team?",
    answer: "Each team must have exactly 4 members. All members must be from the same batch (either Batch 23 or Batch 24).",
    keywords: ["team size", "members", "how many", "people", "participants", "4", "how many people", "four members", "group size", "4 people"],
    priority: 10
  },
  {
    id: "team-batch",
    category: "team",
    question: "What batches can participate?",
    answer: "Teams can be from Batch 23 or Batch 24. All 4 members of a team must be from the SAME batch. You cannot mix batches.",
    keywords: ["batch", "23", "24", "year", "which batch"],
    priority: 10
  },
  {
    id: "team-eligibility",
    category: "team",
    question: "Who can participate?",
    answer: "All students from the University of Moratuwa - Faculty of Information Technology from Batch 23 or Batch 24 can participate. Teams must have 4 members from the same batch.",
    keywords: ["eligibility", "who", "can participate", "students", "requirements"],
    priority: 9
  },
  {
    id: "team-limit",
    category: "team",
    question: "How many teams can register?",
    answer: "Maximum 100 teams can register for CodeRush 2025. Registration is first-come, first-served, so register early!",
    keywords: ["limit", "maximum", "how many teams", "capacity", "100"],
    priority: 8
  },

  // Registration Rules
  {
    id: "team-name-rules",
    category: "registration",
    question: "What are the team name rules?",
    answer: "Choose a cool team name! 😎 It should be 3-30 characters and can include letters, numbers, spaces, hyphens (-), or underscores (_). Make it unique and creative! Just avoid using only numbers. Examples: Team42, Code_Ninjas, Rush-2025",
    keywords: ["team name", "name rules", "characters", "format", "naming"],
    priority: 10
  },
  {
    id: "index-format",
    category: "registration",
    question: "What is the index number format?",
    answer: "Your index number should look like this: 234001T (6 digits + 1 capital letter). 📝 Make sure it starts with your batch (23 or 24)! For example, Batch 23 students use 23****X and Batch 24 use 24****X. Each teammate needs their own unique index number!",
    keywords: ["index", "format", "number", "student id", "234001T", "example"],
    priority: 10
  },
  {
    id: "email-rules",
    category: "registration",
    question: "Can team members use the same email?",
    answer: "Nope! Each team member needs their own email address. 📧 Make sure everyone uses a different email - this helps us send confirmation messages to everyone on your team! You can use personal emails or university emails.",
    keywords: ["email", "unique", "same email", "duplicate"],
    priority: 9
  },
  {
    id: "duplicate-members",
    category: "registration",
    question: "Can a person be in multiple teams?",
    answer: "No. Each index number and email can only be registered once. A person cannot be part of multiple teams.",
    keywords: ["duplicate", "multiple teams", "same person", "join"],
    priority: 9
  },

  // Registration Process
  {
    id: "registration-steps",
    category: "registration",
    question: "How do I register my team?",
    answer: "You can register right here in this chat! 🚀 Super easy - I'll guide you through it:\n\n1️⃣ Share your team name (3-30 characters)\n2️⃣ Select your batch (23 or 24)\n3️⃣ Add all 4 teammates (name, index, email for each)\n4️⃣ Review and confirm!\n\nReady to start? Just type your team name now! 😊",
    keywords: ["how to register", "process", "steps", "procedure", "how do i register", "register team", "start registration", "registration process"],
    priority: 10
  },
  {
    id: "edit-registration",
    category: "registration",
    question: "Can I edit my registration after submitting?",
    answer: "Yes! You can edit your registration details after submitting. ✅ Just don't click the Reset button, or you'll lose access to edit! If you need help, contact the organizers:\n📧 Ishan Hansaka: silvahih.22@uom.lk, 0775437008\n📧 Kenuka Karunakaran: karunakarank.22@uom.lk, 0767508136\n📧 Nimesh Madhusanka: madhusankanan.22@uom.lk, 0788722847",
    keywords: ["edit", "change", "update", "modify", "after registration", "edit details", "change details"],
    priority: 9
  },
  {
    id: "confirmation-email",
    category: "registration",
    question: "Will I receive a confirmation email?",
    answer: "Yes! 📬 Once you submit your registration, the team leader will get a confirmation email with all your team details and next steps for CodeRush 2025. Keep an eye on your inbox! If you don't see it, check your spam folder too.",
    keywords: ["email", "confirmation", "receive", "sent"],
    priority: 8
  },
  {
    id: "registration-deadline",
    category: "registration",
    question: "When does registration close?",
    answer: "Registration closes on November 14, 2025 at 11:59 PM or when we reach 100 teams (whichever comes first!). ⏰ It's first-come, first-served, so don't wait! Register your team ASAP to secure your spot!",
    keywords: ["deadline", "close", "last date", "when", "november 14", "last day", "cut off", "expires", "until when", "registration ends"],
    priority: 8
  },
  {
    id: "reset-button-warning",
    category: "registration",
    question: "What happens if I click the Reset button?",
    answer: "The Reset button starts a completely new registration session! 🔄\n\n✅ Use Reset if: You want to register a DIFFERENT team or start completely over\n❌ Don't use Reset if: You've completed registration and want to edit your current team - you'll LOSE access to edit!\n\n⚠️ After Reset: Your submitted registration stays in the database, but you can't access it through this chat anymore. To edit an existing registration, use the Edit button instead of Reset!",
    keywords: ["reset", "reset button", "fresh start", "start over", "warning", "after registration", "lose access"],
    priority: 10
  },
  {
    id: "registration-page-refresh",
    category: "registration",
    question: "What happens if the page refreshes during registration?",
    answer: "Don't worry! 😊 If the page refreshes while you're registering in the chat (before final submission), your progress is saved. You can continue from where you left off and still update any details before submitting!",
    keywords: ["page refresh", "during registration", "reload", "lost data", "before submission"],
    priority: 9
  },
  {
    id: "edit-during-registration",
    category: "registration",
    question: "Can I go back to edit details during registration?",
    answer: "While you're registering in the chat (halfway through), you CANNOT go back to edit details you already entered. ⚠️ You must continue forward. BUT once you complete all the information (before final confirmation), you CAN review and update ALL details! After submission, you can still edit (just don't click Reset!).",
    keywords: ["edit during", "go back", "halfway", "during registration", "cannot change", "must continue"],
    priority: 9
  },
  {
    id: "edit-before-submission",
    category: "registration",
    question: "Can I update my details after filling all information but before submitting?",
    answer: "Yes! 😊 Once you've completed filling in all the information (all 4 members' details), you can review and update ANY details before final confirmation. Make sure everything is perfect! After you submit, you can still edit (just don't click Reset!).",
    keywords: ["edit before submit", "review before submit", "can change", "update before submit", "all info filled"],
    priority: 9
  },

  // Submission Requirements
  {
    id: "submission-format",
    category: "submission",
    question: "What do we need to submit?",
    answer: "You need to submit 2 separate things:\n\n1️⃣ GitHub Repository Link (public repo with your code)\n2️⃣ Google Drive Folder Link containing:\n   📹 Demo video: [YourTeamName]_demo.mp4\n   📄 Report: [YourTeamName]_report.pdf\n\nExample: If your team is \"Team42\", files should be named:\n• Team42_demo.mp4\n• Team42_report.pdf\n\nMake sure the Drive folder is set to 'Anyone with the link can view'!",
    keywords: ["submit", "submission", "deliverables", "what to submit", "requirements", "format"],
    priority: 10
  },
  {
    id: "submission-deadline",
    category: "submission",
    question: "When is the submission deadline?",
    answer: "All submissions must be completed by 6:00 PM on November 15, 2025 (same day as the buildathon). You have 10 hours from 8 AM to 6 PM to build and submit.",
    keywords: ["deadline", "when to submit", "due date", "time"],
    priority: 10
  },
  {
    id: "tech-stack",
    category: "submission",
    question: "What tech stack can we use?",
    answer: "You can use ANY technology, framework, or programming language! Whether it's HTML, CSS, JavaScript, React, Next.js, Vue, Angular, Node.js, Python, Django, Flask, PHP, Java, or anything else - there are NO restrictions. Pick what you're comfortable with and build something awesome!",
    keywords: ["tech stack", "technology", "framework", "language", "tools", "programming", "react", "nextjs", "vue", "angular", "html", "css", "javascript", "python", "django", "node"],
    priority: 9
  },
  {
    id: "project-theme",
    category: "submission",
    question: "Is there a specific theme or problem statement?",
    answer: "YES! On the event day, you'll receive scenario-based questions or real-world problem statements. The specific scenarios will be announced at the start of the buildathon on November 15, 2025. You'll then build solutions to solve these scenarios using any technology you want!",
    keywords: ["theme", "problem", "topic", "challenge", "what to build", "scenario", "question", "problem statement"],
    priority: 8
  },
  {
    id: "scenario-questions",
    category: "event",
    question: "What are scenario-based questions?",
    answer: "On the event day, teams will receive real-world scenario-based problems or challenges that they need to solve. These scenarios will be announced at 8 AM on November 15th. You'll have 10 hours to build a solution using any technology or framework you choose!",
    keywords: ["scenario", "questions", "problems", "challenges", "what to build", "event day"],
    priority: 9
  },
  {
    id: "scenario-examples",
    category: "event",
    question: "Can you give me an example of a scenario-based question?",
    answer: "Sure! Here are some examples of what scenario-based questions might look like: 1) Build a student attendance tracking system for universities, 2) Create a food delivery app for local restaurants, 3) Develop a healthcare appointment booking platform, 4) Build a real-time pollution monitoring dashboard. The actual scenarios will be announced on event day, but they'll be similar real-world problems that need creative tech solutions!",
    keywords: ["example", "sample", "scenario", "what kind", "like what", "problem statement example"],
    priority: 9
  },
  {
    id: "frameworks-allowed",
    category: "technical",
    question: "Can we use React, Next.js, or other frameworks?",
    answer: "YES! You can use ANY framework you want - React, Next.js, Vue, Angular, Django, Flask, Express, or any other framework. There are absolutely NO restrictions on what technologies, frameworks, or libraries you use!",
    keywords: ["react", "nextjs", "next.js", "vue", "angular", "framework", "library", "use", "allowed"],
    priority: 10
  },
  {
    id: "any-technology",
    category: "technical",
    question: "Are there any restrictions on technologies?",
    answer: "NO restrictions at all! Use HTML, CSS, JavaScript, TypeScript, Python, Java, PHP, Ruby, or ANY programming language. Use any framework like React, Next.js, Vue, Angular, Django, Laravel - whatever you're comfortable with! You have complete freedom to choose your tech stack.",
    keywords: ["restrictions", "allowed", "can we use", "technology", "language", "framework", "html", "css", "js", "python"],
    priority: 10
  },
  {
    id: "external-apis",
    category: "technical",
    question: "Can we use external APIs and libraries?",
    answer: "Absolutely! You're free to use any external APIs, third-party libraries, npm packages, pip packages, or any tools you need. There are no limitations - use whatever helps you build the best solution!",
    keywords: ["api", "external", "library", "package", "npm", "third party", "tools"],
    priority: 9
  },
  {
    id: "ai-tools-allowed",
    category: "technical",
    question: "Can we use AI tools like ChatGPT, GitHub Copilot, or Claude?",
    answer: "YES! You can absolutely use AI tools during CodeRush 2025! Feel free to use ChatGPT, GitHub Copilot, Claude, Gemini, or any other AI assistant to help you code, debug, brainstorm, or solve problems. There are NO restrictions - use whatever tools help you build the best solution! 🤖✨",
    keywords: ["ai", "ai tools", "chatgpt", "copilot", "github copilot", "claude", "gemini", "artificial intelligence", "machine learning", "gpt"],
    priority: 10
  },

  // Organizers & Contact
  {
    id: "organizers",
    category: "contact",
    question: "Who are the organizers of CodeRush 2025?",
    answer: "CodeRush 2025 is organized by three students from the Faculty of IT, University of Moratuwa: 1) Ishan Hansaka (silvahih.22@uom.lk, 0775437008), 2) Kenuka Karunakaran (karunakarank.22@uom.lk, 0767508136), and 3) Nimesh Madhusanka (madhusankanan.22@uom.lk, 0788722847). Feel free to reach out to them if you have any questions!",
    keywords: ["organizers", "who organized", "contact", "team", "organiser"],
    priority: 8
  },
  {
    id: "contact-organizers",
    category: "contact",
    question: "How can I contact the organizers?",
    answer: "You can contact the organizers via email or phone: Ishan Hansaka (silvahih.22@uom.lk, 0775437008), Kenuka Karunakaran (karunakarank.22@uom.lk, 0767508136), or Nimesh Madhusanka (madhusankanan.22@uom.lk, 0788722847). Feel free to reach out anytime!",
    keywords: ["contact", "email", "phone", "reach out", "get in touch", "call"],
    priority: 8
  },

  // Event Logistics
  {
    id: "food-refreshments",
    category: "event",
    question: "Is food provided at the event?",
    answer: "Yes! We'll provide refreshments during CodeRush 2025 to keep you energized throughout the day! 🍕☕ You can focus on coding while we take care of keeping you fueled!",
    keywords: ["food", "refreshments", "snacks", "drinks", "meals", "lunch", "breakfast", "provided", "eating", "hungry", "catering", "diet"],
    priority: 8
  },
  {
    id: "pre-event-coding",
    category: "rules",
    question: "Can we start coding before the event?",
    answer: "No, you cannot start coding before the event! ⏰ The problem statements will be revealed at 8 AM on November 15th, and that's when coding begins. Everyone starts at the same time for fairness!",
    keywords: ["pre-event", "before event", "start early", "code before", "preparation"],
    priority: 9
  },
  {
    id: "registration-mistake",
    category: "registration",
    question: "I made a mistake in my registration, what should I do?",
    answer: "No worries! You can edit your registration to fix any mistakes (team name, batch, member details, etc.). Just don't click the Reset button! If you need help, contact the organizers:\n📧 Ishan: silvahih.22@uom.lk, 0775437008\n📧 Kenuka: karunakarank.22@uom.lk, 0767508136\n📧 Nimesh: madhusankanan.22@uom.lk, 0788722847",
    keywords: ["mistake", "error", "wrong info", "fix registration", "incorrect", "typo"],
    priority: 9
  },
  {
    id: "need-help-support",
    category: "support",
    question: "I need help, who can I contact?",
    answer: "We're here to help! 😊 You can contact the organizers directly: Ishan Hansaka (silvahih.22@uom.lk, 0775437008), Kenuka Karunakaran (karunakarank.22@uom.lk, 0767508136), or Nimesh Madhusanka (madhusankanan.22@uom.lk, 0788722847). Feel free to reach out anytime!",
    keywords: ["need help", "help me", "support", "assistance", "stuck", "problem"],
    priority: 9
  },

  // Common Questions
  {
    id: "prizes",
    category: "event",
    question: "What are the prizes?",
    answer: "Prizes will be awarded to winning teams at the awards ceremony on November 25, 2025. Specific prize details will be announced during the event.",
    keywords: ["prize", "reward", "win", "award", "money"],
    priority: 7
  },
  {
    id: "experience-level",
    category: "team",
    question: "Do we need prior experience?",
    answer: "No specific experience is required! CodeRush welcomes all skill levels. It's a great opportunity to learn, collaborate, and build something amazing with your team.",
    keywords: ["experience", "beginner", "skill", "level", "qualified"],
    priority: 7
  },
  {
    id: "team-formation",
    category: "team",
    question: "Can we form teams at the event?",
    answer: "No, you must register your complete team of 4 members before the event. Teams cannot be formed or changed on the event day.",
    keywords: ["form team", "find team", "team formation", "partners"],
    priority: 8
  },
  {
    id: "offline-online",
    category: "event",
    question: "Is CodeRush online or offline?",
    answer: "CodeRush 2025 is an in-person event held at the University of Moratuwa - Faculty of IT. All teams must attend physically.",
    keywords: ["online", "offline", "physical", "virtual", "in-person", "remote", "zoom", "location", "attendance", "attend"],
    priority: 8
  },
  {
    id: "contact-support",
    category: "support",
    question: "How do I get help or report issues?",
    answer: "If you face any issues during registration or have questions, just ask me here! I'm here to help you through the entire process. You can also contact the organizers directly if needed!",
    keywords: ["help", "support", "issue", "problem", "contact"],
    priority: 7
  },
  {
    id: "reset-registration",
    category: "registration",
    question: "How do I start a new registration?",
    answer: "Click the 🔄 Reset button at the top of the chat to clear your current session and start a new registration for a different team.",
    keywords: ["reset", "new registration", "start over", "clear"],
    priority: 7
  },
  {
    id: "view-teams",
    category: "registration",
    question: "Can I see registered teams?",
    answer: "Yes! You can view all registered teams on the main registration page. Just look for the 'View Registered Teams' button to see all teams that have successfully registered.",
    keywords: ["view teams", "see teams", "registered", "list"],
    priority: 6
  },

  // Submission Page
  {
    id: "submission-page",
    category: "submission",
    question: "How do I submit my project?",
    answer: "Visit the Submission page and fill in 3 fields:\n\n1️⃣ Team Name (must match your registration)\n2️⃣ GitHub Repository Link (must be public)\n3️⃣ Google Drive Folder Link (containing video + report)\n\nThe Drive folder should be named '[YourTeamName]' and contain '[YourTeamName]_demo.mp4' and '[YourTeamName]_report.pdf'. Set it to 'Anyone with the link can view'!",
    keywords: ["how to submit", "submission page", "submit project", "where to submit", "submission process"],
    priority: 10
  },
  {
    id: "submission-github",
    category: "submission",
    question: "Does GitHub repo need to be public?",
    answer: "Yes! Your GitHub repository must be set to public visibility so judges can access and review your code.",
    keywords: ["github", "public", "repository", "visibility", "private"],
    priority: 9
  },
  {
    id: "submission-drive-folder",
    category: "submission",
    question: "What should be in the Google Drive folder?",
    answer: "Your Google Drive folder must contain: 1) Demo video showing your solution, and 2) Project report document. The folder must be named with your team name and set to public view (Anyone with the link can view).",
    keywords: ["drive folder", "contents", "video", "report", "document"],
    priority: 9
  },
  {
    id: "submission-video",
    category: "submission",
    question: "What should the demo video include?",
    answer: "The demo video should showcase your solution, demonstrate key features, and explain how it solves the problem. Keep it clear and concise.",
    keywords: ["demo video", "video content", "showcase", "demonstration"],
    priority: 7
  },
  {
    id: "submission-report",
    category: "submission",
    question: "What should be in the project report?",
    answer: "The project report should include: problem statement, your solution approach, technologies used, key features, challenges faced, and future improvements.",
    keywords: ["report", "documentation", "document", "write"],
    priority: 7
  },

  // Report Issue Page
  {
    id: "report-issue",
    category: "support",
    question: "How do I report a problem or issue?",
    answer: "You can report issues directly to the organizers! Contact them via: Ishan Hansaka (silvahih.22@uom.lk, 0775437008), Kenuka Karunakaran (karunakarank.22@uom.lk, 0767508136), or Nimesh Madhusanka (madhusankanan.22@uom.lk, 0788722847). They'll review and respond to your concern quickly!",
    keywords: ["report issue", "problem", "help", "support", "contact"],
    priority: 8
  },
  {
    id: "issue-types",
    category: "support",
    question: "What types of issues can I report?",
    answer: "You can report registration problems (unable to register, errors, duplicate entries), technical issues (website bugs, submission problems), or other concerns related to CodeRush 2025.",
    keywords: ["issue types", "problems", "categories", "what to report"],
    priority: 7
  },
  {
    id: "issue-response-time",
    category: "support",
    question: "How long does it take to get help?",
    answer: "The organizing team reviews reported issues regularly. For urgent matters during registration or the event, expect a response within a few hours. For general queries, typically within 24 hours.",
    keywords: ["response time", "how long", "wait", "reply"],
    priority: 6
  },

  // Registration Page Guidelines
  {
    id: "registration-page-chat",
    category: "registration",
    question: "How does the registration chatbot work?",
    answer: "I'm your registration assistant! I guide you step-by-step through the registration process right here in the chat. You can ask me questions anytime. I'll collect your team name, batch, and details for all 4 members, then let you review and confirm before submitting. Let's get started! 🚀",
    keywords: ["chatbot", "how it works", "assistant", "registration bot"],
    priority: 8
  },
  {
    id: "registration-pause",
    category: "registration",
    question: "Can I pause and resume registration later?",
    answer: "Yes! Your registration progress is automatically saved. If you close the page or refresh, you can resume from where you left off using the same browser session.",
    keywords: ["pause", "resume", "save", "continue later"],
    priority: 7
  },
  {
    id: "multiple-registrations",
    category: "registration",
    question: "Can I register multiple teams?",
    answer: "No. Each person can only be part of one team. Index numbers and emails can only be registered once. However, you can use the Reset button to start a new registration if you made a mistake.",
    keywords: ["multiple teams", "more than one", "two teams"],
    priority: 7
  },

  // New Important Documents
  {
    id: "judging-criteria",
    category: "event",
    question: "How will projects be judged? What are the judging criteria?",
    answer: "Projects will be evaluated on several key factors: 1️⃣ Innovation & Creativity - How unique is your solution? 2️⃣ Technical Implementation - Code quality and tech choices 3️⃣ Problem-Solving Approach - How well does it solve the scenario? 4️⃣ User Experience - Is it user-friendly? 5️⃣ Completeness & Polish - Is it finished and well-presented? 6️⃣ Presentation Quality - Demo video and report. Focus on building a solid, complete solution! 🏆",
    keywords: ["judging", "criteria", "evaluate", "scoring", "how judged", "grading", "assessment", "evaluation", "judges", "rating"],
    priority: 9
  },
  {
    id: "equipment-requirements",
    category: "event",
    question: "What should I bring to the event? What equipment do I need?",
    answer: "Bring your laptop and charger - that's the most important! 💻🔌 Make sure your laptop is fully charged and has all your development tools installed (IDEs, frameworks, etc.). WiFi will be provided at the venue, so you'll have internet access throughout the day!",
    keywords: ["bring", "laptop", "equipment", "what to bring", "requirements", "charger", "devices", "need", "wifi", "internet"],
    priority: 9
  },
  {
    id: "wifi-internet",
    category: "event",
    question: "Is WiFi or internet provided at the venue?",
    answer: "Yes! WiFi will be available at the venue throughout the event. You'll have internet access to download packages, search documentation, use APIs, and access online resources during the buildathon! 📶",
    keywords: ["wifi", "internet", "connection", "network", "online", "access"],
    priority: 8
  },
  {
    id: "github-repo-requirements",
    category: "submission",
    question: "What should be in the GitHub repository?",
    answer: "Your GitHub repo should contain: 1) All your source code 2) README.md with setup instructions 3) Project dependencies (package.json, requirements.txt, etc.) 4) Any configuration files needed to run the project. Make sure the repo is PUBLIC and well-organized! The judges will review your code quality and implementation. 💻",
    keywords: ["github", "repository", "repo", "code", "what to include", "readme", "source code"],
    priority: 9
  }
];

/**
 * Get documents by category
 */
export function getDocumentsByCategory(category: string): KnowledgeDocument[] {
  return knowledgeBase.filter(doc => doc.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return [...new Set(knowledgeBase.map(doc => doc.category))];
}

/**
 * Search documents by keyword (simple fallback)
 */
export function searchByKeyword(query: string, limit = 5): KnowledgeDocument[] {
  const lowerQuery = query.toLowerCase();

  // Common typos and alternate terms
  const synonymMap: Record<string, string[]> = {
    'explain': ['details', 'information', 'about', 'overview', 'tell'],
    'describe': ['details', 'information', 'about', 'overview', 'tell'],
    'tell': ['explain', 'describe', 'information', 'details', 'about'],
    'details': ['information', 'info', 'about', 'overview', 'explain'],
    'information': ['details', 'info', 'about', 'overview', 'explain'],
    'overview': ['details', 'information', 'about', 'explain'],
    'location': ['venue', 'place', 'address', 'where', 'map', 'directions'],
    'venue': ['location', 'place', 'where', 'map', 'directions'],
    'competition': ['event', 'buildathon', 'hackathon', 'coderush'],
    'compition': ['competition', 'event'], // Common typo
    'competion': ['competition', 'event'], // Common typo
    'compititon': ['competition', 'event'], // Common typo
    'event': ['competition', 'buildathon', 'hackathon', 'coderush'],
    'buildathon': ['event', 'competition', 'hackathon'],
    'hackathon': ['event', 'competition', 'buildathon'],
    'coderush': ['event', 'competition', 'buildathon'],
  };

  // Clean punctuation and split into words
  let words = lowerQuery
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)              // Split by whitespace
    .filter(word => word.length > 0); // Remove empty strings

  // Add synonyms for better matching
  const expandedWords = [...words];
  words.forEach(word => {
    if (synonymMap[word]) {
      expandedWords.push(...synonymMap[word]);
    }
  });
  words = [...new Set(expandedWords)]; // Remove duplicates

  // If no valid words, return empty
  if (words.length === 0) {
    return [];
  }

  const scored = knowledgeBase.map(doc => {
    let score = 0;

    // Check keywords (exact and partial matches)
    doc.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      words.forEach(word => {
        if (word.length >= 3) { // Only match words 3+ chars to avoid noise
          if (keywordLower === word) {
            score += 5; // Exact keyword match - high score
          } else if (keywordLower.includes(word) || word.includes(keywordLower)) {
            score += 3; // Partial match
          }
        }
      });
    });

    // Multi-word phrase bonus (e.g., "event details", "about event")
    const docText = `${doc.question} ${doc.answer} ${doc.keywords.join(' ')}`.toLowerCase();
    if (words.length >= 2) {
      // Check if multiple query words appear together
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        if (docText.includes(phrase)) {
          score += 8; // High bonus for phrase matches
        }
      }
      // Extra bonus if the full query appears
      if (lowerQuery.length > 10 && docText.includes(lowerQuery)) {
        score += 15;
      }
    }

    // Check question
    words.forEach(word => {
      if (word.length >= 3 && doc.question.toLowerCase().includes(word)) {
        score += 2;
      }
    });

    // Check answer
    words.forEach(word => {
      if (word.length >= 3 && doc.answer.toLowerCase().includes(word)) {
        score += 1;
      }
    });

    // Add priority bonus
    score += doc.priority * 0.1;

    return { doc, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.doc);
}
