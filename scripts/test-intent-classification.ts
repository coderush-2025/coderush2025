/**
 * Test Intent Classification Fix
 * Tests that event questions are properly classified
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { classifyIntent } from '../src/lib/geminiService';

interface TestCase {
  message: string;
  expectedIntent: 'QUESTION' | 'CONVERSATIONAL' | 'GREETING' | 'REGISTRATION';
  reason: string;
}

const testCases: TestCase[] = [
  // These should be QUESTIONS (the problematic ones from user)
  {
    message: "what is the event",
    expectedIntent: "QUESTION",
    reason: "Asking about the event - should trigger RAG"
  },
  {
    message: "what is this competition",
    expectedIntent: "QUESTION",
    reason: "Asking about competition - should trigger RAG"
  },
  {
    message: "what is buildathon",
    expectedIntent: "QUESTION",
    reason: "Asking about buildathon - should trigger RAG"
  },
  {
    message: "explain this event more details",
    expectedIntent: "QUESTION",
    reason: "Asking for event details - should trigger RAG"
  },
  {
    message: "what is coderush",
    expectedIntent: "QUESTION",
    reason: "Asking about coderush - should trigger RAG"
  },

  // These should still be CONVERSATIONAL (not about event)
  {
    message: "what are you",
    expectedIntent: "CONVERSATIONAL",
    reason: "Asking about the bot itself - generic response"
  },
  {
    message: "who are you",
    expectedIntent: "CONVERSATIONAL",
    reason: "Asking about the bot - generic response"
  },
  {
    message: "thanks",
    expectedIntent: "CONVERSATIONAL",
    reason: "Gratitude - generic response"
  },

  // These should be QUESTIONS (event-related)
  {
    message: "when is the event",
    expectedIntent: "QUESTION",
    reason: "Date question - should trigger RAG"
  },
  {
    message: "where is the venue",
    expectedIntent: "QUESTION",
    reason: "Location question - should trigger RAG"
  },
  {
    message: "how to register",
    expectedIntent: "QUESTION",
    reason: "Registration question - should trigger RAG"
  },

  // Greetings
  {
    message: "hello",
    expectedIntent: "GREETING",
    reason: "Simple greeting - greeting response"
  },
  {
    message: "hi there",
    expectedIntent: "GREETING",
    reason: "Greeting with extra - greeting response"
  }
];

async function runTests() {
  console.log('🧪 Testing Intent Classification Fix\n');
  console.log('=' .repeat(70));

  let passed = 0;
  let failed = 0;
  const failures: { message: string; expected: string; got: string }[] = [];

  for (const test of testCases) {
    const result = await classifyIntent(test.message, 'IDLE');

    if (result === test.expectedIntent) {
      console.log(`✅ "${test.message}"`);
      console.log(`   → ${result} (correct)`);
      passed++;
    } else {
      console.log(`❌ "${test.message}"`);
      console.log(`   → Expected: ${test.expectedIntent}, Got: ${result}`);
      console.log(`   → Reason: ${test.reason}`);
      failed++;
      failures.push({
        message: test.message,
        expected: test.expectedIntent,
        got: result
      });
    }
    console.log('');
  }

  console.log('=' .repeat(70));
  console.log(`\n📊 Results: ${passed}/${testCases.length} passed (${Math.round(passed/testCases.length * 100)}%)`);

  if (failures.length > 0) {
    console.log('\n❌ Failed Tests:');
    failures.forEach((f, i) => {
      console.log(`${i + 1}. "${f.message}"`);
      console.log(`   Expected: ${f.expected}, Got: ${f.got}\n`);
    });
  } else {
    console.log('\n🎉 All tests passed! Intent classification is working correctly!');
  }
}

runTests().catch(console.error);
