/**
 * Test script to verify typo-tolerant extraction
 * Tests that "our tema name is bolt" extracts "bolt"
 */

console.log('🧪 Testing Typo-Tolerant Team Name Extraction\n');
console.log('━'.repeat(80));

// Team name phrases including typos
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

// Extraction function
function extractFromConversational(input: string, phrases: string[]): string {
  let result = input.trim();
  const lowerInput = result.toLowerCase();

  for (const phrase of phrases) {
    if (lowerInput.includes(phrase)) {
      const phraseIndex = lowerInput.indexOf(phrase);
      const afterPhrase = result.substring(phraseIndex + phrase.length).trim();

      if (afterPhrase.length >= 1) {
        result = afterPhrase;
        console.log(`   🔍 Detected phrase "${phrase}" → Extracting...`);
        break;
      }
    }
  }

  return result;
}

// Test cases focusing on typos
const testCases = [
  // Typo: "tema" instead of "team"
  { input: 'our tema name is bolt', expected: 'bolt', description: 'Typo: "tema" instead of "team"' },
  { input: 'my tema is Phoenix', expected: 'Phoenix', description: 'Typo: "my tema is"' },
  { input: 'our tema is Warriors', expected: 'Warriors', description: 'Typo: "our tema is"' },
  { input: 'tema name is Alpha', expected: 'Alpha', description: 'Typo: "tema name is"' },

  // Typo: "out" instead of "our"
  { input: 'out team is CodeRush', expected: 'CodeRush', description: 'Typo: "out" instead of "our"' },

  // Incomplete phrases (user forgot "is")
  { input: 'our team name Phoenix', expected: 'Phoenix', description: 'Incomplete: missing "is"' },
  { input: 'my team name Bulk', expected: 'Bulk', description: 'Incomplete: missing "is"' },
  { input: 'team name Warriors', expected: 'Warriors', description: 'Incomplete: missing "is"' },

  // Short phrases
  { input: 'our team Alpha', expected: 'Alpha', description: 'Short: "our team"' },
  { input: 'my team Phoenix', expected: 'Phoenix', description: 'Short: "my team"' },
  { input: 'our name Bolt', expected: 'Bolt', description: 'Short: "our name"' },

  // Correct phrases (should still work)
  { input: 'our team name is Code Warriors', expected: 'Code Warriors', description: 'Correct: "our team name is"' },
  { input: 'my team is Phoenix', expected: 'Phoenix', description: 'Correct: "my team is"' },

  // Direct input (no extraction)
  { input: 'Phoenix', expected: 'Phoenix', description: 'Direct team name' },
  { input: 'bolt', expected: 'bolt', description: 'Direct team name (lowercase)' },
];

console.log('\n📝 Running Test Cases:\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = extractFromConversational(testCase.input, TEAM_NAME_PHRASES);
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

console.log('━'.repeat(80));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Typo-tolerant extraction working perfectly!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
