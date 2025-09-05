// scripts/setup-database.js
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { generateMockProducts } from './generate-mock-data.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

function createSearchText(product) {
  const parts = [
    product.name,
    product.description,
    product.category,
    product.brand,
    // Add semantic keywords
    product.category === 'rings' ? 'ring band jewelry engagement wedding' : '',
    product.category === 'earrings' ? 'earring ear jewelry studs hoops' : '',
    product.category === 'necklaces' ? 'necklace chain jewelry pendant' : '',
    product.category === 'dresses' ? 'dress clothing fashion wear outfit' : '',
    product.category === 'tops' ? 'shirt blouse top clothing fashion' : '',
    product.category === 'shoes' ? 'shoes footwear boots heels sneakers' : '',
  ].filter(Boolean);
  
  return parts.join(' ').toLowerCase();
}

async function setupDatabase() {
  console.log('🔧 Setting up database schema...');
  
  try {
    // Create the products table (if it doesn't exist)
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id uuid default gen_random_uuid() primary key,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          name text not null,
          description text,
          price decimal,
          currency text default 'AUD',
          sku text,
          category text,
          brand text,
          image_url text,
          product_url text,
          store_name text not null,
          embedding vector(1536),
          metadata jsonb,
          search_text text generated always as (
            name || ' ' || coalesce(description, '') || ' ' || coalesce(category, '')
          ) stored
        );
        
        CREATE INDEX IF NOT EXISTS products_store_name_idx ON products (store_name);
        CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
        CREATE INDEX IF NOT EXISTS products_embedding_idx ON products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
      `
    });
    
    if (tableError) {
      console.log('Table might already exist, continuing...');
    }
    
    console.log('✅ Database schema ready');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    // Continue anyway - table might already exist
  }
}

async function importProducts(products, storeName) {
  console.log(`📥 Importing ${products.length} products for ${storeName}...`);
  
  let imported = 0;
  let failed = 0;
  
  for (const product of products) {
    try {
      const searchText = createSearchText(product);
      const embedding = await generateEmbedding(searchText);
      
      const { error } = await supabase
        .from('products')
        .insert({
          ...product,
          store_name: storeName,
          embedding
        });
        
      if (error) {
        console.error(`❌ Error inserting ${product.name}:`, error.message);
        failed++;
      } else {
        imported++;
        console.log(`✅ [${imported}/${products.length}] ${product.name}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Error processing ${product.name}:`, error.message);
      failed++;
    }
  }
  
  console.log(`📊 ${storeName}: ${imported} imported, ${failed} failed`);
  return { imported, failed };
}

async function clearExistingData() {
  console.log('🗑️ Clearing existing product data...');
  
  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
  if (error) {
    console.error('Error clearing data:', error);
  } else {
    console.log('✅ Existing data cleared');
  }
}

async function createSearchFunction() {
  console.log('🔍 Creating search function...');
  
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION search_products(
          query_embedding vector(1536),
          store_filter text default null,
          match_threshold float default 0.7,
          match_count int default 20
        )
        RETURNS TABLE (
          id uuid,
          name text,
          description text,
          price decimal,
          currency text,
          image_url text,
          product_url text,
          category text,
          brand text,
          similarity float
        )
        LANGUAGE sql STABLE
        AS $$
          SELECT
            products.id,
            products.name,
            products.description,
            products.price,
            products.currency,
            products.image_url,
            products.product_url,
            products.category,
            products.brand,
            1 - (products.embedding <=> query_embedding) as similarity
          FROM products
          WHERE 
            (store_filter IS NULL OR products.store_name = store_filter)
            AND (products.embedding <=> query_embedding) < (1 - match_threshold)
          ORDER BY products.embedding <=> query_embedding
          LIMIT match_count;
        $$;
      `
    });
    
    if (error) {
      console.error('Error creating search function:', error);
    } else {
      console.log('✅ Search function created');
    }
    
  } catch (error) {
    console.error('Error with search function:', error);
  }
}

async function main() {
  console.log('🚀 Starting database setup...');
  
  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.OPENAI_API_KEY) {
    console.error('❌ Missing required environment variables');
    console.error('Required: SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY');
    process.exit(1);
  }
  
  try {
    // 1. Setup database schema
    await setupDatabase();
    
    // 2. Create search function
    await createSearchFunction();
    
    // 3. Clear existing data (optional - comment out if you want to keep existing data)
    await clearExistingData();
    
    // 4. Generate mock product data
    console.log('🎭 Generating product data...');
    const productData = generateMockProducts();
    
    // 5. Import products with embeddings
    const zamelsResult = await importProducts(productData.zamels, 'zamels');
    const sydneyResult = await importProducts(productData.sydneyStreet, 'sydneystreet');
    
    console.log('\n📊 Import Summary:');
    console.log(`Zamels: ${zamelsResult.imported} products imported`);
    console.log(`Sydney Street: ${sydneyResult.imported} products imported`);
    console.log(`Total: ${zamelsResult.imported + sydneyResult.imported} products ready for search`);
    
    // 6. Test the search function
    console.log('\n🧪 Testing search function...');
    await testSearch();
    
    console.log('\n✅ Database setup complete!');
    console.log('🎯 Ready for demo at: https://miracleworks.netlify.app');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

async function testSearch() {
  const testQueries = [
    { query: 'ring with one stone', store: 'zamels' },
    { query: 'gold hoops', store: 'zamels' },
    { query: 'summer dress', store: 'sydneystreet' },
    { query: 'wedding ring for men', store: 'zamels' }
  ];
  
  for (const test of testQueries) {
    try {
      const queryEmbedding = await generateEmbedding(test.query);
      
      const { data, error } = await supabase
        .rpc('search_products', {
          query_embedding: queryEmbedding,
          store_filter: test.store,
          match_threshold: 0.6,
          match_count: 3
        });
        
      if (error) {
        console.error(`❌ Test failed for "${test.query}":`, error);
      } else {
        console.log(`✅ "${test.query}" → ${data.length} results`);
        if (data.length > 0) {
          console.log(`   Best match: ${data[0].name} (${Math.round(data[0].similarity * 100)}% similarity)`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Test error for "${test.query}":`, error);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
    