// scripts/scraper.js
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Scrape Zamels jewelry products
 */
async function scrapeZamels(maxProducts = 100) {
  console.log('🔍 Scraping Zamels products...');
  
  const products = [];
  const baseUrl = 'https://zamels.com.au';
  
  try {
    // Start with main category pages
    const categoryUrls = [
      '/collections/engagement-rings',
      '/collections/wedding-rings', 
      '/collections/earrings',
      '/collections/necklaces',
      '/collections/bracelets',
      '/collections/rings'
    ];
    
    for (const categoryUrl of categoryUrls) {
      if (products.length >= maxProducts) break;
      
      console.log(`Scraping category: ${categoryUrl}`);
      
      try {
        const response = await fetch(`${baseUrl}${categoryUrl}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Find product links (adjust selectors based on actual site structure)
        const productLinks = [];
        $('a[href*="/products/"]').each((i, el) => {
          const href = $(el).attr('href');
          if (href && !productLinks.includes(href)) {
            productLinks.push(href.startsWith('http') ? href : `${baseUrl}${href}`);
          }
        });
        
        // Scrape individual products
        for (const productUrl of productLinks.slice(0, 20)) {
          if (products.length >= maxProducts) break;
          
          try {
            await delay(500); // Be respectful
            const product = await scrapeZamelsProduct(productUrl);
            if (product) {
              products.push(product);
              console.log(`✓ Scraped: ${product.name}`);
            }
          } catch (error) {
            console.log(`❌ Failed to scrape product: ${productUrl}`);
          }
        }
        
        await delay(1000);
        
      } catch (error) {
        console.log(`❌ Failed to scrape category: ${categoryUrl}`);
      }
    }
    
  } catch (error) {
    console.error('Error scraping Zamels:', error);
  }
  
  console.log(`📦 Scraped ${products.length} Zamels products`);
  return products;
}

async function scrapeZamelsProduct(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract product data (adjust selectors based on actual site)
    const name = $('h1').first().text().trim() || 
                 $('.product-title').text().trim() ||
                 $('[data-testid="product-title"]').text().trim();
    
    const description = $('.product-description').text().trim() ||
                       $('.product-details').text().trim() ||
                       $('meta[name="description"]').attr('content') || '';
    
    const priceText = $('.price').first().text().trim() ||
                     $('.product-price').text().trim() ||
                     $('[data-testid="price"]').text().trim();
    
    const price = extractPrice(priceText);
    
    const imageUrl = $('img[src*="product"]').first().attr('src') ||
                    $('.product-image img').first().attr('src') ||
                    $('img').first().attr('src');
    
    // Determine category from URL or content
    const category = extractCategory(url, name, description);
    
    if (!name || name.length < 3) return null;
    
    return {
      name: cleanText(name),
      description: cleanText(description),
      price: price || 0,
      currency: 'AUD',
      sku: generateSku('ZAM', name),
      category,
      brand: 'Zamels',
      image_url: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://zamels.com.au${imageUrl}`) : null,
      product_url: url
    };
    
  } catch (error) {
    return null;
  }
}

/**
 * Scrape Sydney Street fashion products
 */
async function scrapeSydneyStreet(maxProducts = 100) {
  console.log('🔍 Scraping Sydney Street products...');
  
  const products = [];
  const baseUrl = 'https://sydneystreet.com.au';
  
  try {
    const categoryUrls = [
      '/collections/dresses',
      '/collections/tops',
      '/collections/bottoms',
      '/collections/outerwear',
      '/collections/shoes',
      '/collections/accessories'
    ];
    
    for (const categoryUrl of categoryUrls) {
      if (products.length >= maxProducts) break;
      
      console.log(`Scraping category: ${categoryUrl}`);
      
      try {
        const response = await fetch(`${baseUrl}${categoryUrl}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const productLinks = [];
        $('a[href*="/products/"]').each((i, el) => {
          const href = $(el).attr('href');
          if (href && !productLinks.includes(href)) {
            productLinks.push(href.startsWith('http') ? href : `${baseUrl}${href}`);
          }
        });
        
        for (const productUrl of productLinks.slice(0, 20)) {
          if (products.length >= maxProducts) break;
          
          try {
            await delay(500);
            const product = await scrapeSydneyStreetProduct(productUrl);
            if (product) {
              products.push(product);
              console.log(`✓ Scraped: ${product.name}`);
            }
          } catch (error) {
            console.log(`❌ Failed to scrape product: ${productUrl}`);
          }
        }
        
        await delay(1000);
        
      } catch (error) {
        console.log(`❌ Failed to scrape category: ${categoryUrl}`);
      }
    }
    
  } catch (error) {
    console.error('Error scraping Sydney Street:', error);
  }
  
  console.log(`📦 Scraped ${products.length} Sydney Street products`);
  return products;
}

async function scrapeSydneyStreetProduct(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const name = $('h1').first().text().trim() || 
                 $('.product-title').text().trim();
    
    const description = $('.product-description').text().trim() ||
                       $('meta[name="description"]').attr('content') || '';
    
    const priceText = $('.price').first().text().trim() ||
                     $('.product-price').text().trim();
    
    const price = extractPrice(priceText);
    
    const imageUrl = $('img[src*="product"]').first().attr('src') ||
                    $('.product-image img').first().attr('src');
    
    const category = extractCategory(url, name, description);
    
    if (!name || name.length < 3) return null;
    
    return {
      name: cleanText(name),
      description: cleanText(description),
      price: price || 0,
      currency: 'AUD',
      sku: generateSku('SYD', name),
      category,
      brand: 'Sydney Street',
      image_url: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://sydneystreet.com.au${imageUrl}`) : null,
      product_url: url
    };
    
  } catch (error) {
    return null;
  }
}

// Helper functions
function extractPrice(priceText) {
  if (!priceText) return 0;
  const match = priceText.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(',', '')) : 0;
}

function extractCategory(url, name, description) {
  const text = `${url} ${name} ${description}`.toLowerCase();
  
  if (text.includes('ring') || text.includes('engagement')) return 'rings';
  if (text.includes('earring')) return 'earrings';
  if (text.includes('necklace') || text.includes('pendant')) return 'necklaces';
  if (text.includes('bracelet')) return 'bracelets';
  if (text.includes('dress')) return 'dresses';
  if (text.includes('top') || text.includes('blouse') || text.includes('shirt')) return 'tops';
  if (text.includes('pant') || text.includes('jean') || text.includes('trouser')) return 'bottoms';
  if (text.includes('jacket') || text.includes('coat') || text.includes('blazer')) return 'outerwear';
  if (text.includes('shoe') || text.includes('boot') || text.includes('sandal')) return 'shoes';
  
  return 'accessories';
}

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim().substring(0, 500);
}

function generateSku(prefix, name) {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${clean}-${random}`;
}

// Main scraping function
export async function scrapeAllProducts() {
  console.log('🚀 Starting product scraping...');
  
  const zamelsProducts = await scrapeZamels(100);
  const sydneyStreetProducts = await scrapeSydneyStreet(100);
  
  // Save to files for backup
  fs.writeFileSync('./data/zamels-scraped.json', JSON.stringify(zamelsProducts, null, 2));
  fs.writeFileSync('./data/sydney-street-scraped.json', JSON.stringify(sydneyStreetProducts, null, 2));
  
  console.log('📁 Products saved to data/ folder');
  
  return {
    zamels: zamelsProducts,
    sydneyStreet: sydneyStreetProducts
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAllProducts().then(() => {
    console.log('✅ Scraping complete!');
    process.exit(0);
  }).catch(console.error);
}