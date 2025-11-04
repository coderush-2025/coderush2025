/**
 * Test: Question Handling During Registration
 * Ensures questions don't interfere with the registration process
 */

import { classifyIntent, isSpamOrOffTopic } from '../src/lib/geminiService';

console.log('🧪 Testing Question Handling During Registration\n');

// Test cases for intent classification during different registration states
const testCases = [
  // IDLE state - should detect questions
  { message: 'what is react', state: 'IDLE', expected: 'QUESTION', description: 'Off-topic question in IDLE' },
  { message: 'what is event details', state: 'IDLE', expected: 'QUESTION', description: 'Valid event question in IDLE' },
  { message: 'where is the venue', state: 'IDLE', expected: 'QUESTION', description: 'Venue question in IDLE' },
  { message: 'when is coderush', state: 'IDLE', expected: 'QUESTION', description: 'Date question in IDLE' },
  { message: 'tell me about the event', state: 'IDLE', expected: 'QUESTION', description: 'General event question in IDLE' },
  { message: 'TeamAlpha', state: 'IDLE', expected: 'REGISTRATION', description: 'Team name in IDLE' },

  // TEAM_BATCH state - should prioritize registration
  { message: '23', state: 'TEAM_BATCH', expected: 'REGISTRATION', description: 'Batch number during registration' },
  { message: 'what is the format?', state: 'TEAM_BATCH', expected: 'QUESTION', description: 'Format question during batch input' },
  { message: 'can you help me?', state: 'TEAM_BATCH', expected: 'QUESTION', description: 'Help request during registration' },

  // MEMBER_DETAILS state - should prioritize registration data
  { message: 'John Doe', state: 'MEMBER_DETAILS', expected: 'REGISTRATION', description: 'Name during member details' },
  { message: '234001T', state: 'MEMBER_DETAILS', expected: 'REGISTRATION', description: 'Index during member details' },
  { message: 'john@example.com', state: 'MEMBER_DETAILS', expected: 'REGISTRATION', description: 'Email during member details' },
  { message: 'what is index format?', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Format question during member input' },
  { message: 'where is the venue?', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Venue question during member input' },
  { message: 'how many members?', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Team size question during member input' },
  { message: 'what format should I use', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Format help during member input' },
  { message: 'tell me the example', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Example request during member input' },

  // CONFIRM state - should detect questions
  { message: 'yes', state: 'CONFIRM', expected: 'REGISTRATION', description: 'Confirmation yes' },
  { message: 'no', state: 'CONFIRM', expected: 'REGISTRATION', description: 'Confirmation no' },
  { message: 'can I edit later?', state: 'CONFIRM', expected: 'QUESTION', description: 'Edit question during confirm' },

  // DONE state - should detect questions
  { message: 'what is the venue?', state: 'DONE', expected: 'QUESTION', description: 'Question after registration complete' },
  { message: 'when is the event?', state: 'DONE', expected: 'QUESTION', description: 'Date question after registration' },

  // Edge cases
  { message: 'what', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Single question word during registration' },
  { message: 'help', state: 'MEMBER_DETAILS', expected: 'QUESTION', description: 'Help keyword during registration' },
  { message: '', state: 'IDLE', expected: 'QUESTION', description: 'Empty message' },
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
  }
}

// Test spam/off-topic detection
console.log('\n🔍 Testing Spam and Off-Topic Detection\n');

const spamTests = [
  { message: 'what is react', expected: true, description: 'React question (off-topic programming tutorial)' },
  { message: 'what is event details', expected: false, description: 'Valid event question' },
  { message: 'where is the venue', expected: false, description: 'Valid venue question' },
  { message: 'aaaaaaaa', expected: true, description: 'Repeated characters (spam)' },
  { message: 'buy now discount', expected: true, description: 'Spam keywords' },
  { message: 'fuck you', expected: true, description: 'Inappropriate language' },
  { message: 'what is the weather', expected: true, description: 'Off-topic weather question' },
  { message: 'tell me a joke', expected: true, description: 'Off-topic joke request' },
  { message: 'what is python', expected: true, description: 'Programming tutorial request' },
  { message: 'how to code in javascript', expected: true, description: 'Programming learning request' },
  { message: 'what tech stack can we use?', expected: false, description: 'Valid tech stack question' },
  { message: 'can we use react?', expected: false, description: 'Valid framework question' },
  { message: 'is food provided?', expected: false, description: 'Valid event logistics question' },
  { message: '234001T', expected: false, description: 'Valid index number' },
  { message: 'john@example.com', expected: false, description: 'Valid email' },
  { message: 'TeamAlpha', expected: false, description: 'Valid team name' },
];

function testSpamDetection() {
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const test of spamTests) {
    const result = isSpamOrOffTopic(test.message);
    const success = result === test.expected;

    if (success) {
      console.log(`✅ PASS: ${test.description}`);
      console.log(`   Input: "${test.message}" | Spam: ${result}\n`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.description}`);
      console.log(`   Input: "${test.message}"`);
      console.log(`   Expected: ${test.expected} | Got: ${result}\n`);
      failures.push(`${test.description} - Expected ${test.expected}, got ${result}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Spam Detection Summary:');
  console.log(`Total Tests: ${spamTests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60));

  if (failures.length > 0) {
    console.log('\n❌ Failed Tests:');
    failures.forEach((failure, idx) => {
      console.log(`${idx + 1}. ${failure}`);
    });
  }
}

// Run all tests
runTests().then(() => {
  console.log('\n');
  testSpamDetection();
}).catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
