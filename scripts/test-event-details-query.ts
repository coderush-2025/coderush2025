/**
 * Test: Event Details Query
 * Test if "what is event details" query works with Pinecone
 */

import { answerQuestionWithRAG } from '../src/lib/geminiService';
import { searchVectorDatabase, isPineconeAvailable } from '../src/lib/vectorService';
import { searchByKeyword } from '../src/lib/knowledgeBase';

async function testEventDetailsQuery() {
  console.log('🧪 Testing Event Details Query\n');
  console.log('='.repeat(60));

  // Test 1: Check if Pinecone is available
  console.log('\n📊 Test 1: Checking Pinecone availability...');
  const pineconeAvailable = await isPineconeAvailable();
  console.log(`Pinecone available: ${pineconeAvailable ? '✅ Yes' : '❌ No'}`);

  // Test 2: Test vector search
  if (pineconeAvailable) {
    console.log('\n📊 Test 2: Testing vector search for "what is event details"...');
    try {
      const vectorResults = await searchVectorDatabase('what is event details', 3);
      console.log(`Found ${vectorResults.length} results from vector search:`);
      vectorResults.forEach((doc, idx) => {
        console.log(`\n${idx + 1}. ${doc.question}`);
        console.log(`   Category: ${doc.category}`);
        console.log(`   Priority: ${doc.priority}`);
        console.log(`   Answer: ${doc.answer.substring(0, 150)}...`);
      });
    } catch (error) {
      console.error('❌ Vector search failed:', error);
    }
  }

  // Test 3: Test keyword search (fallback)
  console.log('\n📊 Test 3: Testing keyword search for "what is event details"...');
  const keywordResults = searchByKeyword('what is event details', 3);
  console.log(`Found ${keywordResults.length} results from keyword search:`);
  keywordResults.forEach((doc, idx) => {
    console.log(`\n${idx + 1}. ${doc.question}`);
    console.log(`   Category: ${doc.category}`);
    console.log(`   Priority: ${doc.priority}`);
    console.log(`   Answer: ${doc.answer.substring(0, 150)}...`);
  });

  // Test 4: Full RAG test
  console.log('\n📊 Test 4: Testing full RAG with "what is event details"...');
  try {
    const answer = await answerQuestionWithRAG('what is event details');
    console.log('\n✅ RAG Response:');
    console.log('─'.repeat(60));
    console.log(answer);
    console.log('─'.repeat(60));
  } catch (error) {
    console.error('❌ RAG test failed:', error);
  }

  // Test 5: Alternative phrasings
  console.log('\n📊 Test 5: Testing alternative phrasings...');
  const queries = [
    'tell me about the event',
    'what is coderush',
    'event information',
    'about the competition'
  ];

  for (const query of queries) {
    console.log(`\n🔍 Query: "${query}"`);
    try {
      const answer = await answerQuestionWithRAG(query);
      console.log(`✅ Response: ${answer.substring(0, 200)}...`);
    } catch (error) {
      console.error(`❌ Failed: ${error}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed!');
}

testEventDetailsQuery().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
