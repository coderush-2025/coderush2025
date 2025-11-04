/**
 * Test script to verify smart extraction across all registration fields
 * Tests extraction for team names, member names, index numbers, and emails
 */

console.log('🧪 Testing Complete Registration Flow with Smart Extraction\n');
console.log('━'.repeat(80));

// Define all extraction phrase lists
const TEAM_NAME_PHRASES = [
  'my name is', 'i am', 'this is', 'my team is', 'we are',
  'our name is', 'our team is', 'our team name is', 'my team name is',
  'the team name is', 'team name is', 'hello i am', 'hi i am', 'i\'m'
];

const NAME_PHRASES = [
  'my name is', 'his name is', 'her name is', 'their name is',
  'name is', 'the name is', 'member name is', 'i am', 'he is', 'she is',
  'this is', 'it is', "it's", 'full name is', 'my full name is',
  'his full name is', 'her full name is'
];

const INDEX_PHRASES = [
  'my index is', 'his index is', 'her index is', 'their index is',
  'index is', 'the index is', 'index number is', 'my index number is',
  'his index number is', 'her index number is', 'the index number is',
  'member index is', 'student index is'
];

const EMAIL_PHRASES = [
  'my email is', 'his email is', 'her email is', 'their email is',
  'email is', 'the email is', 'my email address is', 'his email address is',
  'her email address is', 'email address is', 'the email address is'
];

// Smart extraction function
function extractFromConversational(input: string, phrases: string[]): string {
  let result = input.trim();
  const lowerInput = result.toLowerCase();

  for (const phrase of phrases) {
    if (lowerInput.includes(phrase)) {
      const phraseIndex = lowerInput.indexOf(phrase);
      const afterPhrase = result.substring(phraseIndex + phrase.length).trim();

      if (afterPhrase.length >= 1) {
        result = afterPhrase;
        break;
      }
    }
  }

  return result;
}

// Test cases organized by registration step
const testCases = [
  // ============ TEAM NAME EXTRACTION ============
  {
    step: 'Team Name',
    input: 'our team name is Phoenix Warriors',
    expected: 'Phoenix Warriors',
    phrases: TEAM_NAME_PHRASES
  },
  {
    step: 'Team Name',
    input: 'my team is CodeRush',
    expected: 'CodeRush',
    phrases: TEAM_NAME_PHRASES
  },
  {
    step: 'Team Name',
    input: 'team name is Bulk',
    expected: 'Bulk',
    phrases: TEAM_NAME_PHRASES
  },

  // ============ MEMBER NAME EXTRACTION ============
  {
    step: 'Member Name',
    input: 'his name is Bihan Silva',
    expected: 'Bihan Silva',
    phrases: NAME_PHRASES
  },
  {
    step: 'Member Name',
    input: 'her name is Sarah Perera',
    expected: 'Sarah Perera',
    phrases: NAME_PHRASES
  },
  {
    step: 'Member Name',
    input: 'my full name is John Doe',
    expected: 'John Doe',
    phrases: NAME_PHRASES
  },
  {
    step: 'Member Name',
    input: 'he is Kamal Fernando',
    expected: 'Kamal Fernando',
    phrases: NAME_PHRASES
  },
  {
    step: 'Member Name',
    input: 'it is Nimal Abeysekara',
    expected: 'Nimal Abeysekara',
    phrases: NAME_PHRASES
  },

  // ============ INDEX NUMBER EXTRACTION ============
  {
    step: 'Index Number',
    input: 'my index is 244001T',
    expected: '244001T',
    phrases: INDEX_PHRASES
  },
  {
    step: 'Index Number',
    input: 'his index is 234567A',
    expected: '234567A',
    phrases: INDEX_PHRASES
  },
  {
    step: 'Index Number',
    input: 'her index number is 241234B',
    expected: '241234B',
    phrases: INDEX_PHRASES
  },
  {
    step: 'Index Number',
    input: 'the index is 239999Z',
    expected: '239999Z',
    phrases: INDEX_PHRASES
  },

  // ============ EMAIL EXTRACTION ============
  {
    step: 'Email',
    input: 'my email is john@gmail.com',
    expected: 'john@gmail.com',
    phrases: EMAIL_PHRASES
  },
  {
    step: 'Email',
    input: 'his email is bihan@student.uom.lk',
    expected: 'bihan@student.uom.lk',
    phrases: EMAIL_PHRASES
  },
  {
    step: 'Email',
    input: 'her email address is sarah.perera@gmail.com',
    expected: 'sarah.perera@gmail.com',
    phrases: EMAIL_PHRASES
  },
  {
    step: 'Email',
    input: 'email is contact@example.com',
    expected: 'contact@example.com',
    phrases: EMAIL_PHRASES
  },

  // ============ DIRECT INPUT (NO EXTRACTION) ============
  {
    step: 'Team Name (Direct)',
    input: 'Phoenix',
    expected: 'Phoenix',
    phrases: TEAM_NAME_PHRASES
  },
  {
    step: 'Member Name (Direct)',
    input: 'Bihan Silva',
    expected: 'Bihan Silva',
    phrases: NAME_PHRASES
  },
  {
    step: 'Index Number (Direct)',
    input: '244001T',
    expected: '244001T',
    phrases: INDEX_PHRASES
  },
  {
    step: 'Email (Direct)',
    input: 'john@gmail.com',
    expected: 'john@gmail.com',
    phrases: EMAIL_PHRASES
  },
];

console.log('\n📝 Running Test Cases:\n');

let passed = 0;
let failed = 0;
const results: Record<string, number> = {};

testCases.forEach((testCase, index) => {
  const result = extractFromConversational(testCase.input, testCase.phrases);
  const testPassed = result === testCase.expected;

  // Track results by step
  if (!results[testCase.step]) results[testCase.step] = 0;
  if (testPassed) results[testCase.step]++;

  if (testPassed) {
    console.log(`✅ Test ${index + 1}: PASS [${testCase.step}]`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}" | Got: "${result}"\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: FAIL [${testCase.step}]`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}" | Got: "${result}"\n`);
    failed++;
  }
});

console.log('━'.repeat(80));
console.log(`\n📊 Overall Results: ${passed}/${testCases.length} passed`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Success Rate: ${Math.round((passed / testCases.length) * 100)}%\n`);

console.log('📋 Results by Step:');
Object.entries(results).forEach(([step, count]) => {
  const total = testCases.filter(t => t.step === step).length;
  console.log(`   ${step}: ${count}/${total} passed`);
});

if (failed === 0) {
  console.log('\n🎉 All tests passed! Complete registration flow extraction working!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}
