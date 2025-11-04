/**
 * Test Registration Flow Understanding
 * Verify users understand the registration process clearly
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { answerQuestionWithRAG } from '../src/lib/geminiService';

const flowQuestions = [
  { q: "can i edit my details before submitting registration" },
  { q: "can i update details during registration" },
  { q: "what if page refreshes during registration" },
  { q: "can i edit my registration after submitting" },
  { q: "can i update my team details after successful registration" },
  { q: "what happens if i click reset after registration" },
  { q: "reset button delete my registration" },
  { q: "can i change details after clicking reset" },
  { q: "how to update team details after registration" },
  { q: "registration deadline date" }
];

async function testFlow() {
  console.log('🧪 Testing Registration Flow Understanding...\n');
  console.log('='.repeat(100));

  for (const test of flowQuestions) {
    console.log(`\n📝 Q: "${test.q}"`);
    console.log('-'.repeat(100));

    try {
      const answer = await answerQuestionWithRAG(test.q, { state: 'IDLE' });
      console.log(`✅ A: ${answer}`);

      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      const err = error as { message?: string };
      console.log('❌ ERROR:', err.message);
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('✅ Testing complete!');
}

testFlow().catch(console.error);
