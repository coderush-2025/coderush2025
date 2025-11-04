/**
 * Test Script: Test all types of questions
 */

import { searchByKeyword } from '../src/lib/knowledgeBase';

const testQueries = [
  // Event date & location
  "when is the event",
  "event date",
  "what time",
  "where is it",
  "location please",
  "venue",
  "map link",
  "how to get there",
  "address",
  "directions",

  // Team registration
  "how to register",
  "register my team",
  "registration process",
  "sign up",
  "how many members",
  "team size",
  "batch requirements",
  "can we join",
  "eligibility",

  // Submission requirements
  "what to submit",
  "submission format",
  "deliverables",
  "deadline",
  "when to submit",
  "github link",
  "demo video",

  // Technologies & tools
  "which tech",
  "can we use react",
  "frameworks allowed",
  "technology stack",
  "programming languages",
  "any restrictions",

  // General/vague questions
  "tell me more",
  "details",
  "explain",
  "info",
  "about this",
  "what is this"
];

console.log('🔍 Testing all question patterns...\n');
console.log('=' .repeat(60));

let successCount = 0;
let failCount = 0;

testQueries.forEach(query => {
  const results = searchByKeyword(query, 3);
  const status = results.length > 0 ? '✅' : '❌';

  if (results.length > 0) {
    successCount++;
  } else {
    failCount++;
  }

  console.log(`${status} "${query}" → ${results.length} results`);

  if (results.length === 0) {
    console.log(`   ⚠️  NO RESULTS - needs fixing!`);
  }
});

console.log('=' .repeat(60));
console.log(`\n📊 Results: ${successCount}/${testQueries.length} queries working`);
console.log(`❌ Failed: ${failCount}`);

if (failCount > 0) {
  console.log('\n⚠️  Some queries need better keyword matching!');
} else {
  console.log('\n✅ All queries working perfectly!');
}
