// netlify/functions/search.js
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, ' ').trim()
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function searchProducts(query, storeFilter = null, limit = 20) {
  try {
    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Call Supabase search function
    const { data, error } = await supabase
      .rpc('search_products', {
        query_embedding: queryEmbedding,
        store_filter: storeFilter,
        match_threshold: 0.2, // Much lower threshold for better results
        match_count: limit
      });
      
    if (error) {
      console.error('Search error:', error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
}

export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query, store, limit = 20 } = JSON.parse(event.body || '{}');
    
    if (!query || typeof query !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query parameter is required and must be a string' })
      };
    }

    // Clean and validate store parameter
    const validStores = ['zamels', 'sydneystreet'];
    const storeFilter = validStores.includes(store) ? store : null;

    console.log(`Searching for "${query}" in store "${storeFilter || 'all'}"`);
    
    const results = await searchProducts(query.trim(), storeFilter, Math.min(limit, 50));
    
    // Log successful search for monitoring
    console.log(`Found ${results.length} results for "${query}"`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        query: query.trim(),
        store: storeFilter,
        results,
        count: results.length,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Search function error:', error);
    
    // Return a more helpful error message
    const errorMessage = error.message.includes('API key') 
      ? 'Search service configuration error'
      : error.message.includes('embedding')
      ? 'Search processing error'
      : 'Internal server error';
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      })
    };
  }
}