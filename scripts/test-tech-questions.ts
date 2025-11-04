/**
 * Test Technology-Related Questions
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { answerQuestionWithRAG } from '../src/lib/geminiService';

const techQuestions = [
  "can we use react",
  "can we use next.js",
  "can we use html css js",
  "what technologies can we use",
  "are there any restrictions on frameworks",
  "can we use external apis",
  "what are scenario based questions",
  "will there be a problem statement",
  "what should we build"
];

async function testTech() {
  console.log('🧪 Testing Technology Questions...\n');
  console.log('='.repeat(80));

  for (const question of techQuestions) {
    console.log(`\n📝 Q: "${question}"`);
    console.log('-'.repeat(80));

    try {
      const answer = await answerQuestionWithRAG(question, { state: 'IDLE' });
      console.log(`✅ A: ${answer}`);
    } catch (error) {
      const err = error as { message?: string };
      console.log(`❌ Error: ${err.message}`);
    }

    // Delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Testing complete!');
}

testTech().catch(console.error);
