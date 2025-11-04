/**
 * Test script to verify batch selection extraction
 * Tests that conversational inputs like "my batch is 23" extract "23"
 */

console.log('🧪 Testing Batch Selection Extraction\n');
console.log('━'.repeat(80));

// Batch extraction phrases
const BATCH_PHRASES = [
  'my batch is', 'our batch is', 'batch is', 'the batch is',
  'we are batch', 'we are from batch', 'i am from batch', 'i am in batch',
  'our batch', 'my batch', 'batch', 'we are in batch', 'from batch'
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

// Batch validator (must be "23" or "24")
function validateBatch(batch: string): boolean {
  return /^(23|24)$/.test(batch);
}

// Test cases for batch extraction
const testCases = [
  // Conversational inputs with "is"
  { input: 'my batch is 23', expected: '23', description: 'Conversational: "my batch is 23"' },
  { input: 'our batch is 24', expected: '24', description: 'Conversational: "our batch is 24"' },
  { input: 'batch is 23', expected: '23', description: 'Conversational: "batch is 23"' },
  { input: 'the batch is 24', expected: '24', description: 'Conversational: "the batch is 24"' },

  // Conversational inputs without "is"
  { input: 'our batch 23', expected: '23', description: 'Short: "our batch 23"' },
  { input: 'my batch 24', expected: '24', description: 'Short: "my batch 24"' },

  // "We are" patterns
  { input: 'we are batch 23', expected: '23', description: 'We are: "we are batch 23"' },
  { input: 'we are from batch 24', expected: '24', description: 'We are from: "we are from batch 24"' },
  { input: 'we are in batch 23', expected: '23', description: 'We are in: "we are in batch 23"' },

  // "I am" patterns
  { input: 'i am from batch 24', expected: '24', description: 'I am from: "i am from batch 24"' },
  { input: 'i am in batch 23', expected: '23', description: 'I am in: "i am in batch 23"' },

  // "from batch" pattern
  { input: 'from batch 24', expected: '24', description: 'From batch: "from batch 24"' },

  // Direct input (no extraction needed)
  { input: '23', expected: '23', description: 'Direct: "23"' },
  { input: '24', expected: '24', description: 'Direct: "24"' },

  // Edge cases with capitalization
  { input: 'My Batch Is 23', expected: '23', description: 'Capitalized: "My Batch Is 23"' },
  { input: 'OUR BATCH IS 24', expected: '24', description: 'Uppercase: "OUR BATCH IS 24"' },
];

console.log('\n📝 Running Test Cases:\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const extracted = extractFromConversational(testCase.input, BATCH_PHRASES);
  const result = extracted.trim();
  const isValid = validateBatch(result);
  const testPassed = result === testCase.expected && isValid;

  if (testPassed) {
    console.log(`✅ Test ${index + 1}: PASS`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}" | Got: "${result}" | Valid: ${isValid}\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: FAIL`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}" | Got: "${result}" | Valid: ${isValid}\n`);
    failed++;
  }
});

console.log('━'.repeat(80));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Batch extraction working perfectly!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
