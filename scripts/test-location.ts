/**
 * Test location-related queries
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { answerQuestionWithRAG, classifyIntent } from '../src/lib/geminiService';

async function testLocationQueries() {
  console.log('🧪 Testing Location Queries...\n');
  console.log('='.repeat(80) + '\n');

  const locationQueries = [
    "what is the location of competition",
    "what is the location of compititon", // With typo
    "where is the venue",
    "where is the event",
    "send me the map link",
    "how do I get to the venue",
    "where is coderush held",
    "venue location",
    "event location",
    "map"
  ];

  for (const query of locationQueries) {
    console.log(`📝 Question: "${query}"`);
    console.log('-'.repeat(80));

    try {
      const intent = await classifyIntent(query, 'IDLE');
      console.log(`🧠 Intent: ${intent}`);

      const answer = await answerQuestionWithRAG(query, { state: 'IDLE' });
      console.log(`✅ Answer:\n${answer}\n`);
    } catch (error) {
      console.error(`❌ Error: ${error}\n`);
    }
  }

  console.log('='.repeat(80));
  console.log('✅ Testing complete!');
}

testLocationQueries();
