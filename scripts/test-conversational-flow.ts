/**
 * Test: Conversational Flow
 * Tests friendly conversational messages and responses
 */

import { classifyIntent, getConversationalResponse, isSpamOrOffTopic } from '../src/lib/geminiService';

console.log('🧪 Testing Conversational Flow\n');
console.log('='.repeat(60));

// Test 1: Intent Classification
console.log('\n📊 Test 1: Intent Classification for Conversational Messages\n');

const intentTests = [
  // Conversational messages
  { message: 'how are you', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'thank you', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'thanks', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'ok', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'cool', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'bye', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'lol', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'who are you', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'are you a bot', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'awesome', state: 'IDLE', expected: 'CONVERSATIONAL' },
  { message: 'perfect', state: 'IDLE', expected: 'CONVERSATIONAL' },

  // Should still work during registration
  { message: 'how are you', state: 'MEMBER_DETAILS', expected: 'CONVERSATIONAL' },
  { message: 'thanks', state: 'TEAM_BATCH', expected: 'CONVERSATIONAL' },

  // Not conversational
  { message: 'what is the event', state: 'IDLE', expected: 'QUESTION' },
  { message: 'TeamAlpha', state: 'IDLE', expected: 'REGISTRATION' },
];

async function testIntentClassification() {
  let passed = 0;
  let failed = 0;

  for (const test of intentTests) {
    const result = await classifyIntent(test.message, test.state);
    if (result === test.expected) {
      console.log(`✅ "${test.message}" → ${result}`);
      passed++;
    } else {
      console.log(`❌ "${test.message}" → Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  }

  console.log(`\n📊 Intent Classification: ${passed}/${intentTests.length} passed\n`);
  return { passed, failed };
}

// Test 2: Conversational Responses
console.log('📊 Test 2: Conversational Response Quality\n');

const responseTests = [
  { message: 'how are you', shouldInclude: ['doing great', 'CodeRush'] },
  { message: 'thank you', shouldInclude: ['welcome', 'help'] },
  { message: 'thanks', shouldInclude: ['welcome', 'help'] },
  { message: 'ok', shouldInclude: ['Awesome', 'team name'] },
  { message: 'cool', shouldInclude: ['Awesome', 'team name'] },
  { message: 'bye', shouldInclude: ['See you', 'CodeRush'] },
  { message: 'lol', shouldInclude: ['glad', 'help'] },
  { message: 'who are you', shouldInclude: ['assistant', 'help'] },
  { message: 'are you a bot', shouldInclude: ['assistant', 'help'] },
];

function testConversationalResponses() {
  let passed = 0;
  let failed = 0;

  for (const test of responseTests) {
    const response = getConversationalResponse(test.message);
    const allIncluded = test.shouldInclude.every(phrase =>
      response.toLowerCase().includes(phrase.toLowerCase())
    );

    if (allIncluded) {
      console.log(`✅ "${test.message}"`);
      console.log(`   Response: ${response.substring(0, 80)}...`);
      passed++;
    } else {
      console.log(`❌ "${test.message}"`);
      console.log(`   Missing: ${test.shouldInclude.filter(phrase => !response.toLowerCase().includes(phrase.toLowerCase())).join(', ')}`);
      failed++;
    }
  }

  console.log(`\n📊 Response Quality: ${passed}/${responseTests.length} passed\n`);
  return { passed, failed };
}

// Test 3: Spam Detection (should NOT flag conversational)
console.log('📊 Test 3: Spam Detection for Conversational Messages\n');

const spamTests = [
  // Should NOT be flagged as spam (conversational)
  { message: 'how are you', expected: false, description: 'Conversational - how are you' },
  { message: 'thank you', expected: false, description: 'Conversational - thank you' },
  { message: 'who are you', expected: false, description: 'Conversational - who are you' },
  { message: 'cool', expected: false, description: 'Conversational - cool' },
  { message: 'bye', expected: false, description: 'Conversational - bye' },

  // Should be flagged as spam/off-topic
  { message: 'what is the weather', expected: true, description: 'Off-topic - weather' },
  { message: 'tell me a joke', expected: true, description: 'Off-topic - joke' },
  { message: 'what is react', expected: true, description: 'Off-topic - programming tutorial' },
];

function testSpamDetection() {
  let passed = 0;
  let failed = 0;

  for (const test of spamTests) {
    const result = isSpamOrOffTopic(test.message);
    if (result === test.expected) {
      console.log(`✅ ${test.description}`);
      passed++;
    } else {
      console.log(`❌ ${test.description} - Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  }

  console.log(`\n📊 Spam Detection: ${passed}/${spamTests.length} passed\n`);
  return { passed, failed };
}

// Run all tests
async function runAllTests() {
  const results = {
    intentClassification: await testIntentClassification(),
    conversationalResponses: testConversationalResponses(),
    spamDetection: testSpamDetection()
  };

  console.log('='.repeat(60));
  console.log('📊 FINAL SUMMARY\n');

  const totalTests = intentTests.length + responseTests.length + spamTests.length;
  const totalPassed = results.intentClassification.passed +
                      results.conversationalResponses.passed +
                      results.spamDetection.passed;
  const totalFailed = results.intentClassification.failed +
                      results.conversationalResponses.failed +
                      results.spamDetection.failed;

  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log('='.repeat(60));

  if (totalFailed === 0) {
    console.log('\n🎉 All conversational flow tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Review output above.');
  }
}

runAllTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
