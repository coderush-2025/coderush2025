/**
 * Test Registration Data Detection Logic
 */

const testMessages = [
  "provide guidelines",
  "provide guidlines", // typo
  "give me information",
  "tell me about event",
  "23",
  "24",
  "John Doe",
  "test@email.com",
  "234001T"
];

function testDetection(message: string) {
  const lowerMsg = message.toLowerCase().trim();

  const questionWords = ['what', 'when', 'where', 'how', 'why', 'can', 'is', 'are', 'do', 'does', 'will', 'should', 'which', 'who'];
  const helpKeywords = ['help', 'format', 'example', 'explain', 'tell me', 'show me'];
  const conversationalPhrases = ['i want', 'i need', 'i ask', 'give me', 'send me', 'show me', 'tell me', 'no no', 'wait', 'actually'];
  const eventKeywords = ['venue', 'location', 'address', 'place', 'map', 'event', 'coderush', 'buildathon', 'hackathon', 'competition', 'guidelines', 'guideline', 'rules', 'information', 'details'];

  const startsWithQuestionWord = questionWords.some(word => lowerMsg.startsWith(word + ' ') || lowerMsg.startsWith(word + "'"));
  const containsQuestionWord = questionWords.some(word => lowerMsg.includes(' ' + word + ' ') || lowerMsg.includes(' ' + word + '?') || lowerMsg.endsWith(' ' + word));
  const containsHelpKeyword = helpKeywords.some(word => lowerMsg.includes(word));
  const containsConversationalPhrase = conversationalPhrases.some(phrase => lowerMsg.includes(phrase));
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

  return {
    message,
    looksLikeRegistrationData,
    checks: {
      startsWithQuestionWord,
      containsQuestionWord,
      containsHelpKeyword,
      containsConversationalPhrase,
      containsEventKeyword,
      hasQuestionMark,
      startsWithCommand: /^(provide|tell|give|show|explain|describe)/i.test(lowerMsg)
    }
  };
}

console.log('🧪 Testing Registration Data Detection\n');
console.log('=' .repeat(80));

testMessages.forEach(msg => {
  const result = testDetection(msg);
  const status = result.looksLikeRegistrationData ? '❌ REGISTRATION DATA' : '✅ QUESTION/OTHER';

  console.log(`\nMessage: "${msg}"`);
  console.log(`Result: ${status}`);
  console.log('Checks:', result.checks);
});

console.log('\n' + '=' .repeat(80));
console.log('\n✅ Test complete!');
