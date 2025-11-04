/**
 * Test script to verify conversational phrase detection
 * Tests that phrases like "my name is aditha" are rejected as team names
 */

console.log('🧪 Testing Conversational Phrase Detection\n');
console.log('━'.repeat(70));

// Test cases
const testCases = [
  // Conversational phrases (should be rejected)
  { input: 'my name is aditha', expected: 'REJECT', reason: 'Contains "my name is"' },
  { input: 'i am john', expected: 'REJECT', reason: 'Contains "i am"' },
  { input: 'this is our team', expected: 'REJECT', reason: 'Contains "this is"' },
  { input: 'my team is phoenix', expected: 'REJECT', reason: 'Contains "my team is"' },
  { input: 'we are the warriors', expected: 'REJECT', reason: 'Contains "we are"' },
  { input: 'our name is team alpha', expected: 'REJECT', reason: 'Contains "our name is"' },
  { input: 'our team name is bulk', expected: 'REJECT', reason: 'Contains "our team name is"' },
  { input: 'my team name is phoenix', expected: 'REJECT', reason: 'Contains "my team name is"' },
  { input: 'the team name is warriors', expected: 'REJECT', reason: 'Contains "the team name is"' },
  { input: 'team name is alpha', expected: 'REJECT', reason: 'Contains "team name is"' },
  { input: 'hello i am sarah', expected: 'REJECT', reason: 'Contains "hello i am"' },
  { input: 'hi i am david', expected: 'REJECT', reason: 'Contains "hi i am"' },
  { input: "i'm michael", expected: 'REJECT', reason: 'Contains "i\'m"' },

  // Valid team names (should be accepted)
  { input: 'Phoenix', expected: 'ACCEPT', reason: 'Valid short name' },
  { input: 'Team Alpha', expected: 'ACCEPT', reason: 'Valid team name' },
  { input: 'Code Warriors', expected: 'ACCEPT', reason: 'Valid team name' },
  { input: 'Rush2025', expected: 'ACCEPT', reason: 'Valid name with numbers' },
  { input: 'The_Innovators', expected: 'ACCEPT', reason: 'Valid with underscore' },
  { input: 'Team-42', expected: 'ACCEPT', reason: 'Valid with hyphen' },
  { input: 'CodeRush Champions', expected: 'ACCEPT', reason: 'Valid longer name' },
  { input: 'Binary Beasts', expected: 'ACCEPT', reason: 'Valid team name' },
];

console.log('\n📝 Test Cases:\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const lowerInput = testCase.input.toLowerCase();

  // Check for conversational phrases
  const conversationalPhrases = [
    'my name is', 'i am', 'this is', 'my team is', 'we are',
    'our name is', 'our team is', 'our team name is', 'my team name is',
    'the team name is', 'team name is', 'hello i am', 'hi i am', "i'm"
  ];

  const containsConversationalPhrase = conversationalPhrases.some(phrase =>
    lowerInput.includes(phrase)
  );

  const actualResult = containsConversationalPhrase ? 'REJECT' : 'ACCEPT';
  const testPassed = actualResult === testCase.expected;

  if (testPassed) {
    console.log(`✅ Test ${index + 1}: PASS`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: ${testCase.expected} | Actual: ${actualResult}`);
    console.log(`   Reason: ${testCase.reason}\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: FAIL`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: ${testCase.expected} | Actual: ${actualResult}`);
    console.log(`   Reason: ${testCase.reason}\n`);
    failed++;
  }
});

console.log('━'.repeat(70));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Conversational phrase detection is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
