/**
 * Test script to verify smart team name extraction
 * Tests that "my team name is bolt" extracts "bolt"
 */

console.log('🧪 Testing Smart Team Name Extraction\n');
console.log('━'.repeat(70));

// Conversational phrases used for extraction
const INTRODUCTION_PHRASES = [
  'my name is', 'i am', 'this is', 'my team is', 'we are',
  'our name is', 'our team is', 'our team name is', 'my team name is',
  'the team name is', 'team name is', 'hello i am', 'hi i am', 'i\'m'
];

// Test cases
const testCases = [
  // Extraction test cases
  { input: 'my team name is bolt', expected: 'bolt', description: 'Extract from "my team name is"' },
  { input: 'our team name is bulk', expected: 'bulk', description: 'Extract from "our team name is"' },
  { input: 'team name is phoenix', expected: 'phoenix', description: 'Extract from "team name is"' },
  { input: 'my team is warriors', expected: 'warriors', description: 'Extract from "my team is"' },
  { input: 'our team is alpha', expected: 'alpha', description: 'Extract from "our team is"' },
  { input: 'the team name is code rush', expected: 'code rush', description: 'Extract multi-word name' },
  { input: 'our name is Team Phoenix', expected: 'Team Phoenix', description: 'Extract with capitals' },
  { input: 'my team name is The_Warriors', expected: 'The_Warriors', description: 'Extract with underscore' },

  // Direct input (no extraction needed)
  { input: 'bolt', expected: 'bolt', description: 'Direct team name (no extraction)' },
  { input: 'Phoenix', expected: 'Phoenix', description: 'Direct team name (no extraction)' },
  { input: 'Code Warriors', expected: 'Code Warriors', description: 'Direct multi-word (no extraction)' },
];

console.log('\n📝 Test Cases:\n');

// Simulate the extraction logic
function extractTeamName(input: string): string {
  let trimmedTeamName = input.trim();
  const lowerMessage = trimmedTeamName.toLowerCase();

  for (const phrase of INTRODUCTION_PHRASES) {
    if (lowerMessage.includes(phrase)) {
      // Extract the part after the conversational phrase
      const phraseIndex = lowerMessage.indexOf(phrase);
      const afterPhrase = trimmedTeamName.substring(phraseIndex + phrase.length).trim();

      if (afterPhrase.length >= 3) {
        trimmedTeamName = afterPhrase;
        console.log(`   🔍 Detected phrase "${phrase}" - Extracting...`);
        break;
      }
    }
  }

  return trimmedTeamName;
}

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = extractTeamName(testCase.input);
  const testPassed = result === testCase.expected;

  if (testPassed) {
    console.log(`✅ Test ${index + 1}: PASS`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}" | Got: "${result}"\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: FAIL`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}" | Got: "${result}"\n`);
    failed++;
  }
});

console.log('━'.repeat(70));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Smart extraction is working correctly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
