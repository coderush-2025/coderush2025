/**
 * Test script to verify intent classification for registration with conversational phrases
 */

console.log('🧪 Testing Intent Classification for Registration\n');
console.log('━'.repeat(80));

// Simulate the intent classification logic
const CONVERSATIONAL_PHRASES = [
  'my name is', 'i am', 'this is', 'my team is', 'we are',
  'our name is', 'our team is', 'our team name is', 'my team name is',
  'the team name is', 'team name is', 'hello i am', 'hi i am', 'i\'m'
];

function classifyIntent(message: string, registrationState: string): string {
  const lowerMsg = message.toLowerCase();

  // Question indicators
  const questionWords = ['what', 'when', 'where', 'how', 'why', 'can', 'is', 'are', 'do', 'does', 'will', 'should'];
  const startsWithQuestion = questionWords.some(word => lowerMsg.startsWith(word));
  const hasQuestionMark = lowerMsg.includes('?');
  const helpWords = ['help', 'format', 'example', 'explain', 'tell me', 'show me'];
  const needsHelp = helpWords.some(word => lowerMsg.includes(word));

  // If has question indicators, it's a question
  if (hasQuestionMark || startsWithQuestion || needsHelp) {
    return 'QUESTION';
  }

  // If it's purely conversational (like "thanks", "bye") - check FIRST before registration
  const pureConversationalPhrases = ['thank you', 'thanks', 'thankyou', 'thx', 'ty', 'bye', 'goodbye', 'see you', 'ok', 'okay', 'cool', 'nice', 'great', 'awesome', 'perfect', 'got it', 'understood', 'alright', 'sure'];
  if (pureConversationalPhrases.some(phrase => lowerMsg === phrase || lowerMsg === phrase + '!' || lowerMsg === phrase + '.')) {
    return 'CONVERSATIONAL';
  }

  // If IDLE and looks like potential registration (even with conversational phrases)
  if (registrationState === 'IDLE') {
    // Extract potential team name from conversational input
    let potentialTeamName = message.trim();
    for (const phrase of CONVERSATIONAL_PHRASES) {
      if (lowerMsg.includes(phrase)) {
        const phraseIndex = lowerMsg.indexOf(phrase);
        const afterPhrase = message.substring(phraseIndex + phrase.length).trim();
        if (afterPhrase.length >= 3) {
          potentialTeamName = afterPhrase;
          break;
        }
      }
    }

    // Check if extracted/original message is valid team name format
    if (potentialTeamName.length >= 3 && potentialTeamName.length <= 30 &&
        /^[a-zA-Z0-9\s\-_]+$/.test(potentialTeamName)) {
      return 'REGISTRATION';
    }
  }

  // Default for IDLE: treat as question
  return 'QUESTION';
}

// Test cases
const testCases = [
  // Registration with conversational phrases
  { input: 'our team is bolt', expected: 'REGISTRATION', state: 'IDLE', description: 'Team name with "our team is"' },
  { input: 'my team name is Phoenix', expected: 'REGISTRATION', state: 'IDLE', description: 'Team name with "my team name is"' },
  { input: 'team name is Warriors', expected: 'REGISTRATION', state: 'IDLE', description: 'Team name with "team name is"' },
  { input: 'our team name is Code Rush', expected: 'REGISTRATION', state: 'IDLE', description: 'Multi-word team name' },

  // Direct team names
  { input: 'Phoenix', expected: 'REGISTRATION', state: 'IDLE', description: 'Direct team name' },
  { input: 'Code Warriors', expected: 'REGISTRATION', state: 'IDLE', description: 'Direct multi-word team name' },
  { input: 'Team_42', expected: 'REGISTRATION', state: 'IDLE', description: 'Team name with underscore' },

  // Pure conversational (should NOT be registration)
  { input: 'thanks', expected: 'CONVERSATIONAL', state: 'IDLE', description: 'Pure conversational: thanks' },
  { input: 'thank you', expected: 'CONVERSATIONAL', state: 'IDLE', description: 'Pure conversational: thank you' },
  { input: 'bye', expected: 'CONVERSATIONAL', state: 'IDLE', description: 'Pure conversational: bye' },
  { input: 'okay', expected: 'CONVERSATIONAL', state: 'IDLE', description: 'Pure conversational: okay' },

  // Questions
  { input: 'what is the venue?', expected: 'QUESTION', state: 'IDLE', description: 'Question with question mark' },
  { input: 'how do I register?', expected: 'QUESTION', state: 'IDLE', description: 'Question starting with how' },
  { input: 'help me register', expected: 'QUESTION', state: 'IDLE', description: 'Help request' },
];

console.log('\n📝 Running Test Cases:\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = classifyIntent(testCase.input, testCase.state);
  const testPassed = result === testCase.expected;

  if (testPassed) {
    console.log(`✅ Test ${index + 1}: PASS`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Expected: ${testCase.expected} | Got: ${result}\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: FAIL`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Expected: ${testCase.expected} | Got: ${result}\n`);
    failed++;
  }
});

console.log('━'.repeat(80));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Intent classification working correctly!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
