/**
 * Test Registration Process Questions
 * Verify user-friendly responses for registration
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { answerQuestionWithRAG, isSpamOrOffTopic } from '../src/lib/geminiService';

const registrationQuestions = [
  // Basic registration questions
  { q: "how do i register" },
  { q: "how to register my team" },
  { q: "registration process" },

  // Team name questions
  { q: "what are team name rules" },
  { q: "can i use numbers in team name" },
  { q: "team name format" },

  // Index number questions
  { q: "index number format" },
  { q: "what is index number format" },
  { q: "example of index number" },

  // Email questions
  { q: "can we use same email" },
  { q: "unique email required" },

  // Editing questions
  { q: "can i edit my registration" },
  { q: "how to change team details" },
  { q: "i made a mistake in registration" },

  // Reset button questions
  { q: "what happens if i click reset" },
  { q: "reset button delete my details" },
  { q: "can i reset after registration" },

  // Deadline questions
  { q: "registration deadline" },
  { q: "when does registration close" },
  { q: "last date to register" },

  // Confirmation
  { q: "will i get confirmation email" },
  { q: "how do i know registration is successful" }
];

async function testRegistrationQuestions() {
  console.log('🧪 Testing Registration Questions...\n');
  console.log('='.repeat(100));

  let passed = 0;
  let failed = 0;

  for (const test of registrationQuestions) {
    console.log(`\n📝 Q: "${test.q}"`);
    console.log('-'.repeat(100));

    try {
      // Check if blocked
      const isBlocked = isSpamOrOffTopic(test.q);

      if (isBlocked) {
        console.log('❌ WRONGLY BLOCKED!');
        failed++;
        continue;
      }

      // Get answer
      const answer = await answerQuestionWithRAG(test.q, { state: 'IDLE' });

      // Check quality
      if (answer.includes('having trouble') || answer.includes('only help with CodeRush') || answer.length < 30) {
        console.log('❌ NO CLEAR ANSWER');
        console.log(`Response: ${answer}`);
        failed++;
      } else {
        console.log('✅ USER-FRIENDLY ANSWER');
        console.log(`Response: ${answer}`);
        passed++;
      }

      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      const err = error as { message?: string };
      console.log('❌ ERROR:', err.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('\n📊 RESULTS:');
  console.log(`   ✅ Answered: ${passed}/${registrationQuestions.length}`);
  console.log(`   ❌ Failed: ${failed}/${registrationQuestions.length}`);

  const successRate = passed / registrationQuestions.length * 100;
  console.log(`\n   🎯 Success Rate: ${successRate.toFixed(1)}%`);

  if (successRate >= 95) {
    console.log('\n✅ EXCELLENT! Registration questions are user-friendly! 🚀');
  } else if (successRate >= 85) {
    console.log('\n👍 GOOD! Most registration questions work well.');
  } else {
    console.log('\n⚠️  NEEDS IMPROVEMENT - Some registration questions unclear.');
  }
}

testRegistrationQuestions().catch(console.error);
