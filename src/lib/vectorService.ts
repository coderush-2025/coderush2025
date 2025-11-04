/**
 * Vector Service using Pinecone and Gemini Embeddings
 * Handles vector storage and semantic search for RAG
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { knowledgeBase, type KnowledgeDocument } from './knowledgeBase';

// Initialize clients lazily
let pinecone: Pinecone | null = null;
let genAI: GoogleGenerativeAI | null = null;

function getPinecone(): Pinecone {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });
  }
  return pinecone;
}

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
  }
  return genAI;
}

const INDEX_NAME = 'coderush-knowledge';
const EMBEDDING_MODEL = 'text-embedding-004'; // Gemini embedding model
const DIMENSION = 768; // Gemini embedding dimensions

/**
 * Initialize Pinecone index (call once during setup)
 */
export async function initializePineconeIndex() {
  try {
    const pc = getPinecone();

    // Check if index exists
    const indexList = await pc.listIndexes();
    const indexExists = indexList.indexes?.some(idx => idx.name === INDEX_NAME);

    if (!indexExists) {
      console.log('Creating Pinecone index...');
      await pc.createIndex({
        name: INDEX_NAME,
        dimension: DIMENSION,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log('✅ Pinecone index created successfully');

      // Wait for index to be ready
      await new Promise(resolve => setTimeout(resolve, 10000));
    } else {
      console.log('✅ Pinecone index already exists');
    }

    return true;
  } catch (error) {
    console.error('❌ Error initializing Pinecone:', error);
    return false;
  }
}

/**
 * Generate embedding using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Populate Pinecone with knowledge base (run once)
 */
export async function populateVectorDatabase() {
  try {
    console.log('📊 Starting vector database population...');

    const pc = getPinecone();
    const index = pc.index(INDEX_NAME);

    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < knowledgeBase.length; i += batchSize) {
      const batch = knowledgeBase.slice(i, i + batchSize);

      const vectors = await Promise.all(
        batch.map(async (doc) => {
          // Combine question and answer for better semantic search
          const text = `${doc.question} ${doc.answer}`;
          const embedding = await generateEmbedding(text);

          return {
            id: doc.id,
            values: embedding,
            metadata: {
              question: doc.question,
              answer: doc.answer,
              category: doc.category,
              keywords: doc.keywords.join(', '),
              priority: doc.priority
            }
          };
        })
      );

      await index.upsert(vectors);
      console.log(`✅ Upserted batch ${Math.floor(i / batchSize) + 1}`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Vector database populated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error populating vector database:', error);
    return false;
  }
}

/**
 * Search vector database for relevant documents
 */
export async function searchVectorDatabase(
  query: string,
  topK = 3
): Promise<KnowledgeDocument[]> {
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search Pinecone
    const pc = getPinecone();
    const index = pc.index(INDEX_NAME);
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true
    });

    // Convert results back to KnowledgeDocument format
    const documents: KnowledgeDocument[] = searchResults.matches
      .filter(match => match.score && match.score > 0.5) // Similarity threshold
      .map(match => ({
        id: match.id,
        question: (match.metadata?.question as string) || '',
        answer: (match.metadata?.answer as string) || '',
        category: (match.metadata?.category as string) || '',
        keywords: ((match.metadata?.keywords as string) || '').split(', '),
        priority: (match.metadata?.priority as number) || 5
      }));

    return documents;
  } catch (error) {
    console.error('❌ Error searching vector database:', error);
    // Fallback to keyword search
    const { searchByKeyword } = await import('./knowledgeBase');
    return searchByKeyword(query, topK);
  }
}

/**
 * Check if Pinecone is available and configured
 */
export async function isPineconeAvailable(): Promise<boolean> {
  try {
    if (!process.env.PINECONE_API_KEY) {
      console.log('⚠️ Pinecone API key not configured');
      return false;
    }

    const pc = getPinecone();
    const indexList = await pc.listIndexes();
    const available = indexList.indexes?.some(idx => idx.name === INDEX_NAME) || false;

    if (!available) {
      console.log('⚠️ Pinecone index not found');
    }

    return available;
  } catch (error) {
    console.error('⚠️ Pinecone connection error:', error);
    return false;
  }
}
