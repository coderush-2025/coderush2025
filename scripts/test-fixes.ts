/**
 * Test the 5 Fixed Issues
 * Verify that all previously failing questions now work
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { answerQuestionWithRAG, isSpamOrOffTopic } from '../src/lib/geminiService';

const fixedQuestions = [
  { issue: "Map link was blocked", question: "map link please" },
  { issue: "Registration mistake - no clear answer", question: "i made a mistake" },
  { issue: "Pre-event coding - no clear answer", question: "can we start coding before" },
  { issue: "Food provided - was blocked", question: "is food provided" },
  { issue: "Help/support - vague answer", question: "i need help" }
];

async function testFixes() {
  console.log('🧪 Testing 5 Fixed Issues...\n');
  console.log('='.repeat(100));

  let passed = 0;
  let failed = 0;

  for (const test of fixedQuestions) {
    console.log(`\n🔍 Issue: ${test.issue}`);
    console.log(`📝 Q: "${test.question}"`);
    console.log('-'.repeat(100));

    try {
      // Check if blocked
      const isBlocked = isSpamOrOffTopic(test.question);

      if (isBlocked) {
        console.log('❌ STILL BLOCKED - Should not be blocked!');
        failed++;
        continue;
      }

      // Get answer
      const answer = await answerQuestionWithRAG(test.question, { state: 'IDLE' });

      // Check quality
      if (answer.includes('having trouble') || answer.includes('only help with CodeRush') || answer.length < 30) {
        console.log('❌ STILL NO CLEAR ANSWER');
        console.log(`Response: ${answer}`);
        failed++;
      } else {
        console.log('✅ FIXED! Clear answer provided');
        console.log(`Response: ${answer}`);
        passed++;
      }

      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.log('❌ ERROR:', error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log('\n📊 RESULTS:');
  console.log(`   ✅ Fixed: ${passed}/5`);
  console.log(`   ❌ Still Broken: ${failed}/5`);

  if (passed === 5) {
    console.log('\n🎉 ALL ISSUES FIXED! Ready for production! 🚀');
  } else if (passed >= 3) {
    console.log('\n👍 Most issues fixed, but need to check remaining failures');
  } else {
    console.log('\n⚠️  Need more work on these fixes');
  }
}

testFixes().catch(console.error);
