/**
 * Test Intent Classification During Active Registration
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { classifyIntent } from '../src/lib/geminiService';

const testCases = [
  { message: "provide guidelines", expectedIntent: "QUESTION" },
  { message: "provide guidlines", expectedIntent: "QUESTION" },
  { message: "give me information", expectedIntent: "QUESTION" },
  { message: "tell me about event", expectedIntent: "QUESTION" },
  { message: "show me rules", expectedIntent: "QUESTION" },
  { message: "what are the guidelines", expectedIntent: "QUESTION" },
  { message: "23", expectedIntent: "REGISTRATION" },
  { message: "24", expectedIntent: "REGISTRATION" },
  { message: "John Doe", expectedIntent: "REGISTRATION" }
];

async function runTests() {
  console.log('🧪 Testing Intent Classification During BATCH_SELECTION\n');
  console.log('=' .repeat(70));

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    const result = await classifyIntent(test.message, 'BATCH_SELECTION');
    const status = result === test.expectedIntent ? '✅' : '❌';

    console.log(`${status} "${test.message}"`);
    console.log(`   Expected: ${test.expectedIntent}, Got: ${result}`);

    if (result === test.expectedIntent) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '=' .repeat(70));
  console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);

  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log(`❌ ${failed} tests failed`);
  }
}

runTests().catch(console.error);
