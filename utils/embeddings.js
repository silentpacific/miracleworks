// utils/embeddings.js
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
);

/**
 * Generate embedding for a text string using OpenAI
 */
export async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // Cheaper and fast
      input: text.replace(/\n/g, ' ').trim()
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Create searchable text from product data
 */
export function createSearchText(product) {
  const parts = [
    product.name,
    product.description,
    product.category,
    product.brand,
    // Add semantic keywords for jewelry
    product.category === 'rings' ? 'ring band jewelry' : '',
    product.category === 'earrings' ? 'earring ear jewelry' : '',
    product.category === 'necklaces' ? 'necklace chain jewelry' : '',
  ].filter(Boolean);
  
  return parts.join(' ').toLowerCase();
}

/**
 * Add embeddings to products in database
 */
export async function addEmbeddingsToProducts(storeFilter = null) {
  console.log('Starting embedding generation...');
  
  // Get products without embeddings
  let query = supabase
    .from('products')
    .select('*')
    .is('embedding', null);
    
  if (storeFilter) {
    query = query.eq('store_name', storeFilter);
  }
  
  const { data: products, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  console.log(`Found ${products.length} products to process`);
  
  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}...`);
    
    for (const product of batch) {
      try {
        const searchText = createSearchText(product);
        const embedding = await generateEmbedding(searchText);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ embedding })
          .eq('id', product.id);
          
        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError);
        } else {
          console.log(`✓ Updated ${product.name}`);
        }
        
        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
      }
    }
    
    // Longer pause between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Embedding generation complete!');
}

/**
 * Search products using natural language query
 */
export async function searchProducts(query, storeFilter = null, limit = 20) {
  try {
    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);
    
    // Call Supabase search function
    const { data, error } = await supabase
      .rpc('search_products', {
        query_embedding: queryEmbedding,
        store_filter: storeFilter,
        match_threshold: 0.6, // Lower threshold for more results
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

/**
 * Batch import products with embeddings
 */
export async function importProducts(products, storeName) {
  console.log(`Importing ${products.length} products for ${storeName}...`);
  
  for (const product of products) {
    try {
      // Create search text and generate embedding
      const searchText = createSearchText(product);
      const embedding = await generateEmbedding(searchText);
      
      // Insert product with embedding
      const { error } = await supabase
        .from('products')
        .insert({
          ...product,
          store_name: storeName,
          embedding
        });
        
      if (error) {
        console.error(`Error inserting product ${product.name}:`, error);
      } else {
        console.log(`✓ Imported ${product.name}`);
      }
      
      // Rate limit protection
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Error processing product ${product.name}:`, error);
    }
  }
  
  console.log(`Import complete for ${storeName}!`);
}