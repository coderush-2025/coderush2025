/**
 * Test RAG System Responses
 * Run: npx tsx scripts/test-rag.ts
 */

// Load environment variables
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { answerQuestionWithRAG, classifyIntent, isSpamOrOffTopic } from '../src/lib/geminiService';

const testQuestions = [
  // Valid CodeRush questions
  "When is CodeRush?",
  "How many team members?",
  "What's the submission format?",
  "Can I edit my registration?",
  "What is the index number format?",
  "When is the deadline?",

  // Spam/Off-topic (should be blocked)
  "What is React?",
  "What is Python?",
  "Teach me coding",
  "What's the weather?",

  // Edge cases
  "format?",
  "How many people per team?",
  "When do we submit our work?",
];

async function testRAG() {
  console.log('🧪 Testing RAG System...\n');
  console.log('='.repeat(80));

  for (const question of testQuestions) {
    console.log(`\n📝 Question: "${question}"`);
    console.log('-'.repeat(80));

    // Test spam detection
    const isSpam = isSpamOrOffTopic(question);
    if (isSpam) {
      console.log('🚫 Status: BLOCKED (Spam/Off-topic)');
      console.log('✅ Response: "I can only help with CodeRush 2025..."');
      continue;
    }

    // Test intent classification
    const intent = await classifyIntent(question, 'IDLE');
    console.log(`🧠 Intent: ${intent}`);

    if (intent === 'QUESTION') {
      try {
        // Test answer generation
        const answer = await answerQuestionWithRAG(question, { state: 'IDLE' });
        console.log(`✅ Answer:\n${answer}`);

        // Check formatting
        if (answer.length < 20) {
          console.warn('⚠️  Warning: Answer seems too short');
        }
        if (answer.length > 500) {
          console.warn('⚠️  Warning: Answer seems too long');
        }
        if (!answer.includes('CodeRush') && !answer.includes('team') && !answer.includes('registration')) {
          console.warn('⚠️  Warning: Answer may not be relevant');
        }
      } catch (error) {
        console.error('❌ Error:', error);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Testing complete!');
}

testRAG().catch(console.error);
