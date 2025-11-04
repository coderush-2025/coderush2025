/**
 * Test: Greeting Detection
 * Ensures greeting variations are properly detected
 */

import { classifyIntent } from '../src/lib/geminiService';

console.log('🧪 Testing Greeting Detection\n');

const testCases = [
  // Standard greetings
  { message: 'hi', state: 'IDLE', expected: 'GREETING', description: 'Standard "hi"' },
  { message: 'hello', state: 'IDLE', expected: 'GREETING', description: 'Standard "hello"' },
  { message: 'hey', state: 'IDLE', expected: 'GREETING', description: 'Standard "hey"' },
  { message: 'sup', state: 'IDLE', expected: 'GREETING', description: 'Standard "sup"' },
  { message: 'yo', state: 'IDLE', expected: 'GREETING', description: 'Standard "yo"' },

  // Greeting variations with repeated letters
  { message: 'hii', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "hii"' },
  { message: 'hiii', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "hiii"' },
  { message: 'hiiii', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "hiiii"' },
  { message: 'hiiiii', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "hiiiii"' },
  { message: 'hellooo', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "hellooo"' },
  { message: 'helloo', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "helloo"' },
  { message: 'heyyy', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "heyyy"' },
  { message: 'heyy', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "heyy"' },
  { message: 'supp', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "supp"' },
  { message: 'yoo', state: 'IDLE', expected: 'GREETING', description: 'Greeting variation "yoo"' },

  // Greetings with text after
  { message: 'hi there', state: 'IDLE', expected: 'GREETING', description: 'Greeting with text "hi there"' },
  { message: 'hello world', state: 'IDLE', expected: 'GREETING', description: 'Greeting with text "hello world"' },
  { message: 'hey buddy', state: 'IDLE', expected: 'GREETING', description: 'Greeting with text "hey buddy"' },

  // NOT greetings (should be team names or questions)
  { message: 'high', state: 'IDLE', expected: 'REGISTRATION', description: 'Not greeting "high" (team name)' },
  { message: 'hill', state: 'IDLE', expected: 'REGISTRATION', description: 'Not greeting "hill" (team name)' },
  { message: 'TeamAlpha', state: 'IDLE', expected: 'REGISTRATION', description: 'Team name "TeamAlpha"' },

  // Greetings should not trigger during registration
  { message: 'hi', state: 'MEMBER_DETAILS', expected: 'REGISTRATION', description: '"hi" during registration (should be name)' },
  { message: 'hello', state: 'TEAM_BATCH', expected: 'REGISTRATION', description: '"hello" during batch selection (should be data)' },
];

async function runTests() {
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const test of testCases) {
    try {
      const result = await classifyIntent(test.message, test.state);
      const success = result === test.expected;

      if (success) {
        console.log(`✅ PASS: ${test.description}`);
        console.log(`   Input: "${test.message}" | State: ${test.state} | Result: ${result}\n`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.description}`);
        console.log(`   Input: "${test.message}" | State: ${test.state}`);
        console.log(`   Expected: ${test.expected} | Got: ${result}\n`);
        failures.push(`${test.description} - Expected ${test.expected}, got ${result}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${test.description}`);
      console.log(`   ${error}\n`);
      failures.push(`${test.description} - Error: ${error}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60));

  if (failures.length > 0) {
    console.log('\n❌ Failed Tests:');
    failures.forEach((failure, idx) => {
      console.log(`${idx + 1}. ${failure}`);
    });
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

runTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
