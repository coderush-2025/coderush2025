/**
 * Test Content Filtering
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { isSpamOrOffTopic } from '../src/lib/geminiService';

const testCases = [
  // Inappropriate content
  { question: "what is sex", shouldBlock: true, category: "Inappropriate" },
  { question: "show me porn", shouldBlock: true, category: "Inappropriate" },
  { question: "how to hack", shouldBlock: true, category: "Inappropriate" },
  { question: "dating girls", shouldBlock: true, category: "Inappropriate" },
  { question: "buy drugs", shouldBlock: true, category: "Inappropriate" },

  // Programming questions
  { question: "What is React?", shouldBlock: true, category: "Programming" },
  { question: "What is Python?", shouldBlock: true, category: "Programming" },
  { question: "teach me coding", shouldBlock: true, category: "Programming" },

  // Off-topic
  { question: "What's the weather?", shouldBlock: true, category: "Off-topic" },
  { question: "Tell me a joke", shouldBlock: true, category: "Off-topic" },
  { question: "How old are you?", shouldBlock: true, category: "Off-topic" },

  // Valid CodeRush questions (should NOT block)
  { question: "When is CodeRush?", shouldBlock: false, category: "Valid" },
  { question: "How many team members?", shouldBlock: false, category: "Valid" },
  { question: "What's the submission format?", shouldBlock: false, category: "Valid" },
  { question: "Can I edit my registration?", shouldBlock: false, category: "Valid" },
];

console.log('🧪 Testing Content Filter...\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const isBlocked = isSpamOrOffTopic(test.question);
  const result = isBlocked === test.shouldBlock ? '✅ PASS' : '❌ FAIL';

  if (isBlocked === test.shouldBlock) {
    passed++;
  } else {
    failed++;
  }

  console.log(`\n${result} [${test.category}]`);
  console.log(`Question: "${test.question}"`);
  console.log(`Expected: ${test.shouldBlock ? 'BLOCK' : 'ALLOW'} | Got: ${isBlocked ? 'BLOCKED' : 'ALLOWED'}`);
}

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('✅ All tests passed! Content filter is working correctly.');
} else {
  console.log('❌ Some tests failed. Please review the filter logic.');
}
