/**
 * Test Script: Debug keyword search
 */

import { searchByKeyword } from '../src/lib/knowledgeBase';

const testQueries = [
  "explain this event",
  "what is coderush",
  "event details",
  "tell me about event"
];

console.log('🔍 Testing keyword search...\n');

testQueries.forEach(query => {
  console.log(`Query: "${query}"`);
  const results = searchByKeyword(query, 3);
  console.log(`Results: ${results.length}`);

  if (results.length > 0) {
    results.forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc.id} - ${doc.question.substring(0, 60)}...`);
    });
  } else {
    console.log('  ❌ No results found');
  }
  console.log('');
});
