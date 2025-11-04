/**
 * Test Remaining Issues with Better Phrasing
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { answerQuestionWithRAG, isSpamOrOffTopic } from '../src/lib/geminiService';

const tests = [
  // Registration mistake variations
  { q: "i made a mistake in registration" },
  { q: "i entered wrong email" },
  { q: "can i edit my registration" },
  { q: "how to fix registration mistake" },

  // Help/support variations
  { q: "who can i contact for help" },
  { q: "i have a problem with registration" },
  { q: "how to get support" },
  { q: "contact organizers" }
];

async function testRemaining() {
  console.log('🧪 Testing Remaining Issues with Better Phrasing...\n');
  console.log('='.repeat(100));

  for (const test of tests) {
    console.log(`\n📝 Q: "${test.q}"`);
    console.log('-'.repeat(100));

    try {
      const isBlocked = isSpamOrOffTopic(test.q);

      if (isBlocked) {
        console.log('❌ BLOCKED');
        continue;
      }

      const answer = await answerQuestionWithRAG(test.q, { state: 'IDLE' });
      console.log(`✅ A: ${answer}`);

      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.log('❌ ERROR:', error.message);
    }
  }
}

testRemaining().catch(console.error);
