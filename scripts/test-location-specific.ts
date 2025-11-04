/**
 * Specific test for location/venue/map link queries
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { answerQuestionWithRAG } from '../src/lib/geminiService';
import { searchVectorDatabase, isPineconeAvailable } from '../src/lib/vectorService';
import { searchByKeyword } from '../src/lib/knowledgeBase';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bright: '\x1b[1m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testLocationQueries() {
  log('\n' + '═'.repeat(70), colors.cyan);
  log('  LOCATION/MAP LINK TEST', colors.cyan + colors.bright);
  log('═'.repeat(70) + '\n', colors.cyan);

  const locationQueries = [
    'Where is CodeRush?',
    'Where is the venue?',
    'What is the location?',
    'Where is the competition?',
    'where is the event?',
    'location of coderush',
    'venue location',
    'map link',
    'send me the map',
    'how do I get to the venue?',
    'address of the event',
    'what is the location of competition', // typo version
    'where is the compititon', // typo version
  ];

  const pineconeAvailable = await isPineconeAvailable();
  log(`Vector Search: ${pineconeAvailable ? '✅ Active' : '⚠️  Fallback'}\n`,
      pineconeAvailable ? colors.green : colors.yellow);

  for (let i = 0; i < locationQueries.length; i++) {
    const query = locationQueries[i];

    log(`${'─'.repeat(70)}`, colors.blue);
    log(`Test ${i + 1}/${locationQueries.length}: "${query}"`, colors.blue + colors.bright);
    log('─'.repeat(70), colors.blue);

    try {
      // Check what documents are retrieved
      if (pineconeAvailable) {
        const vectorResults = await searchVectorDatabase(query, 3);
        log(`   Vector Search Results (${vectorResults.length} docs):`, colors.cyan);
        vectorResults.forEach((doc, idx) => {
          log(`   ${idx + 1}. "${doc.question}" (category: ${doc.category})`, colors.cyan);
        });
      } else {
        const keywordResults = searchByKeyword(query, 3);
        log(`   Keyword Search Results (${keywordResults.length} docs):`, colors.cyan);
        keywordResults.forEach((doc, idx) => {
          log(`   ${idx + 1}. "${doc.question}" (category: ${doc.category})`, colors.cyan);
        });
      }

      // Get RAG answer
      const answer = await answerQuestionWithRAG(query);

      // Check if answer contains map link
      const hasMapLink = answer.includes('maps.app.goo.gl') ||
                        answer.includes('maps.google.com') ||
                        answer.includes('https://');

      log(`\n   Answer (${answer.length} chars):`, colors.green + colors.bright);
      log(`   ${answer}`, colors.green);

      if (hasMapLink) {
        log(`\n   ✅ MAP LINK INCLUDED`, colors.green + colors.bright);
      } else {
        log(`\n   ❌ MAP LINK MISSING`, colors.red + colors.bright);
      }

      log('');

    } catch (error) {
      log(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`, colors.red);
    }
  }

  log('\n' + '═'.repeat(70), colors.cyan);
  log('  TEST COMPLETE', colors.cyan + colors.bright);
  log('═'.repeat(70) + '\n', colors.cyan);
}

testLocationQueries().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
