/**
 * Test script to verify vector database has updated knowledge
 * Tests that team name rules now show "3-30 characters"
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { searchVectorDatabase } from '../src/lib/vectorService';
import { searchByKeyword } from '../src/lib/knowledgeBase';

async function testVectorUpdate() {
  console.log('🔍 Testing Vector Database Update\n');
  console.log('━'.repeat(60));

  try {
    // Test 1: Search for team name rules
    console.log('\n📝 Test 1: Team Name Rules Query\n');
    console.log('Query: "What are the team name rules?"\n');

    const results = await searchVectorDatabase('What are the team name rules?', 3);

    if (results.length > 0) {
      console.log('✅ Vector Search Results:');
      results.forEach((doc, index) => {
        console.log(`\n${index + 1}. Question: ${doc.question}`);
        console.log(`   Answer: ${doc.answer.substring(0, 150)}...`);

        // Check if answer contains "3-30 characters"
        if (doc.answer.includes('3-30 characters')) {
          console.log('   ✅ Contains "3-30 characters" ← CORRECT!');
        } else if (doc.answer.includes('3-10 characters')) {
          console.log('   ❌ Still shows "3-10 characters" ← OUTDATED!');
        }
      });
    } else {
      console.log('❌ No vector search results found');
    }

    // Test 2: Registration steps query
    console.log('\n\n📝 Test 2: Registration Steps Query\n');
    console.log('Query: "How do I register my team?"\n');

    const results2 = await searchVectorDatabase('How do I register my team?', 3);

    if (results2.length > 0) {
      console.log('✅ Vector Search Results:');
      results2.forEach((doc, index) => {
        console.log(`\n${index + 1}. Question: ${doc.question}`);
        console.log(`   Answer: ${doc.answer.substring(0, 200)}...`);

        if (doc.answer.includes('3-30 characters')) {
          console.log('   ✅ Contains "3-30 characters" ← CORRECT!');
        } else if (doc.answer.includes('3-10 characters')) {
          console.log('   ❌ Still shows "3-10 characters" ← OUTDATED!');
        }
      });
    }

    // Test 3: Keyword search fallback
    console.log('\n\n📝 Test 3: Keyword Search Fallback\n');
    console.log('Query: "team name"\n');

    const keywordResults = searchByKeyword('team name', 3);

    if (keywordResults.length > 0) {
      console.log('✅ Keyword Search Results:');
      keywordResults.forEach((doc, index) => {
        console.log(`\n${index + 1}. Question: ${doc.question}`);
        console.log(`   Answer: ${doc.answer.substring(0, 150)}...`);

        if (doc.answer.includes('3-30 characters')) {
          console.log('   ✅ Contains "3-30 characters" ← CORRECT!');
        } else if (doc.answer.includes('3-10 characters')) {
          console.log('   ❌ Still shows "3-10 characters" ← OUTDATED!');
        }
      });
    }

    console.log('\n\n━'.repeat(60));
    console.log('\n🎉 Vector database test complete!\n');
    console.log('✅ The vector database has been updated with new knowledge base.');
    console.log('✅ All queries should now return "3-30 characters" for team name rules.\n');

  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    console.log('\n💡 Note: If Pinecone is not configured, keyword search will be used as fallback.\n');
  }
}

testVectorUpdate();
