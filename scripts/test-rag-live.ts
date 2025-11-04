/**
 * Live RAG System Test
 * Tests the RAG system with real questions
 */

// Load environment variables from .env.local
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { answerQuestionWithRAG, classifyIntent, isSpamOrOffTopic } from '../src/lib/geminiService';
import { searchVectorDatabase, isPineconeAvailable } from '../src/lib/vectorService';
import { searchByKeyword } from '../src/lib/knowledgeBase';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testRAGSystem() {
  log('\n' + '█'.repeat(70), colors.magenta);
  log('  LIVE RAG SYSTEM TEST - CODERUSH 2025', colors.magenta + colors.bright);
  log('█'.repeat(70) + '\n', colors.magenta);

  // Check environment
  log('🔧 Environment Check:', colors.cyan + colors.bright);
  log(`   GEMINI API KEY: ${process.env.GOOGLE_GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`,
    process.env.GOOGLE_GEMINI_API_KEY ? colors.green : colors.yellow);
  log(`   PINECONE API KEY: ${process.env.PINECONE_API_KEY ? '✅ Configured' : '⚠️  Optional'}`,
    process.env.PINECONE_API_KEY ? colors.green : colors.yellow);

  // Check Pinecone
  const pineconeAvailable = await isPineconeAvailable();
  log(`   Vector Search: ${pineconeAvailable ? '✅ Active (Semantic)' : '⚠️  Fallback (Keyword)'}`,
    pineconeAvailable ? colors.green : colors.yellow);

  console.log('');

  // Test questions
  const testQuestions = [
    { q: 'When is CodeRush 2025?', expectedCategory: 'event' },
    { q: 'Where is the venue?', expectedCategory: 'event' },
    { q: 'what is the location of compititon', expectedCategory: 'event' }, // Typo test
    { q: 'How many members per team?', expectedCategory: 'team' },
    { q: 'What are the team name rules?', expectedCategory: 'registration' },
    { q: 'Can we use React and Next.js?', expectedCategory: 'technical' },
    { q: 'Who are the organizers?', expectedCategory: 'contact' },
  ];

  log('📝 Testing RAG System with Real Questions:', colors.cyan + colors.bright);
  console.log('');

  for (let i = 0; i < testQuestions.length; i++) {
    const { q, expectedCategory } = testQuestions[i];

    log(`\n${'─'.repeat(70)}`, colors.blue);
    log(`Question ${i + 1}: "${q}"`, colors.blue + colors.bright);
    log('─'.repeat(70), colors.blue);

    try {
      // Check intent classification
      const intent = await classifyIntent(q, 'IDLE');
      log(`   Intent: ${intent}`, colors.cyan);

      // Check spam detection
      const isSpam = isSpamOrOffTopic(q);
      log(`   Spam/Off-topic: ${isSpam ? '❌ Yes' : '✅ No'}`, isSpam ? colors.yellow : colors.green);

      // Search for relevant documents
      if (pineconeAvailable) {
        const vectorResults = await searchVectorDatabase(q, 3);
        log(`   Vector Search: Found ${vectorResults.length} documents`, colors.cyan);
        if (vectorResults.length > 0) {
          log(`   Top Match: "${vectorResults[0].question}"`, colors.cyan);
        }
      } else {
        const keywordResults = searchByKeyword(q, 3);
        log(`   Keyword Search: Found ${keywordResults.length} documents`, colors.cyan);
        if (keywordResults.length > 0) {
          log(`   Top Match: "${keywordResults[0].question}"`, colors.cyan);
        }
      }

      // Get RAG answer
      if (process.env.GOOGLE_GEMINI_API_KEY) {
        const answer = await answerQuestionWithRAG(q);
        log(`\n   Answer:`, colors.green + colors.bright);
        log(`   ${answer.substring(0, 200)}${answer.length > 200 ? '...' : ''}`, colors.green);
      } else {
        log(`   ⚠️  Skipping RAG answer (no API key)`, colors.yellow);
      }

    } catch (error) {
      log(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`, colors.yellow);
    }
  }

  log('\n' + '═'.repeat(70), colors.cyan);
  log('✅ RAG System Test Complete!', colors.green + colors.bright);
  log('═'.repeat(70) + '\n', colors.cyan);
}

// Run test
testRAGSystem().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
