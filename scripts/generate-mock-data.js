// scripts/generate-mock-data.js
// Backup realistic product data if scraping fails

export const zamelsProductTemplates = [
  {
    name: "Classic Diamond Solitaire Engagement Ring",
    description: "Stunning round brilliant cut diamond set in 18k white gold. The perfect symbol of eternal love with timeless elegance. Features a 1 carat center stone.",
    price: 4500,
    category: "engagement-rings"
  },
  {
    name: "Vintage Rose Gold Wedding Band",
    description: "Delicate rose gold wedding ring with intricate vintage detailing. Hand-engraved patterns and milgrain edges. Perfect for stacking.",
    price: 850,
    category: "wedding-bands"
  },
  {
    name: "Gold Hoop Earrings - Medium",
    description: "Classic 14k yellow gold hoops perfect for everyday wear. Lightweight design with secure click closure. Versatile and timeless.",
    price: 320,
    category: "earrings"
  },
  {
    name: "Ruby and Diamond Cluster Ring",
    description: "Gorgeous red rubies surrounded by sparkling diamonds in white gold setting. Vintage-inspired cluster design makes a bold statement.",
    price: 1850,
    category: "gemstone-rings"
  },
  {
    name: "Pearl Drop Necklace",
    description: "Elegant freshwater pearl pendant on delicate gold chain. Perfect for formal occasions or adding sophistication to any outfit.",
    price: 480,
    category: "necklaces"
  },
  {
    name: "Men's Tungsten Wedding Ring",
    description: "Modern brushed tungsten carbide wedding band for men. Scratch-resistant and durable with comfortable fit. Contemporary masculine design.",
    price: 280,
    category: "mens-rings"
  },
  {
    name: "Sapphire Tennis Bracelet",
    description: "Brilliant blue sapphires set in sterling silver tennis bracelet. Continuous line of matched stones creates stunning sparkle.",
    price: 1200,
    category: "bracelets"
  },
  {
    name: "Diamond Stud Earrings",
    description: "Classic diamond studs in white gold settings. Perfect for daily wear or special occasions. Brilliant cut diamonds catch light beautifully.",
    price: 2200,
    category: "earrings"
  },
  {
    name: "Emerald Cut Engagement Ring",
    description: "Sophisticated emerald cut diamond in platinum setting. Art deco inspired design with baguette side stones. Truly stunning piece.",
    price: 6800,
    category: "engagement-rings"
  },
  {
    name: "Antique Brooch with Crystals",
    description: "Vintage-style decorative brooch featuring Austrian crystals in ornate gold-tone setting. Perfect statement piece for special events.",
    price: 180,
    category: "brooches"
  }
];

export const sydneyStreetProductTemplates = [
  {
    name: "Flowy Summer Maxi Dress",
    description: "Lightweight chiffon maxi dress perfect for warm weather. Features delicate floral print and adjustable straps. Ideal for beach vacations or garden parties.",
    price: 120,
    category: "dresses"
  },
  {
    name: "Classic White Button-Up Shirt",
    description: "Crisp cotton button-up shirt that works from office to weekend. Tailored fit with quality construction. A wardrobe essential.",
    price: 85,
    category: "tops"
  },
  {
    name: "High-Waisted Dark Wash Jeans",
    description: "Flattering high-waisted jeans in premium dark wash denim. Slim fit with stretch for comfort. Perfect for casual or dressed-up looks.",
    price: 95,
    category: "bottoms"
  },
  {
    name: "Wool Blend Winter Coat",
    description: "Warm and stylish wool blend coat for cold weather. Classic silhouette with modern details. Available in multiple colors.",
    price: 280,
    category: "outerwear"
  },
  {
    name: "Leather Ankle Boots",
    description: "Versatile genuine leather ankle boots with low heel. Perfect for transitional weather and pairs with dresses or jeans.",
    price: 165,
    category: "shoes"
  },
  {
    name: "Designer Crossbody Bag",
    description: "Luxury leather crossbody bag with gold hardware. Compact size perfect for essentials. Adjustable strap for versatile wear.",
    price: 220,
    category: "accessories"
  },
  {
    name: "Silk Scarf with Print",
    description: "Beautiful silk scarf featuring artistic print design. Can be worn around neck, in hair, or tied to handbag. Luxurious feel.",
    price: 65,
    category: "accessories"
  },
  {
    name: "Knit Sweater Dress",
    description: "Cozy knit sweater dress perfect for cooler weather. Midi length with flattering silhouette. Great for office or weekend wear.",
    price: 110,
    category: "dresses"
  },
  {
    name: "Wide Leg Trousers",
    description: "Elegant wide leg trousers in flowing fabric. High-waisted design creates long, lean silhouette. Perfect for professional settings.",
    price: 130,
    category: "bottoms"
  },
  {
    name: "Statement Gold Earrings",
    description: "Bold geometric gold-tone earrings that make a statement. Lightweight design despite dramatic appearance. Perfect conversation starter.",
    price: 45,
    category: "accessories"
  }
];

function generateVariations(template, count = 10) {
  const variations = [];
  const adjectives = ['Classic', 'Elegant', 'Modern', 'Vintage', 'Luxury', 'Designer', 'Premium', 'Delicate', 'Bold', 'Sophisticated'];
  const materials = {
    jewelry: ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Sterling Silver', 'White Gold'],
    fashion: ['Cotton', 'Silk', 'Wool', 'Linen', 'Cashmere', 'Leather']
  };
  
  for (let i = 0; i < count; i++) {
    const variation = { ...template };
    
    // Add random variations to name
    if (Math.random() > 0.5) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      variation.name = `${adj} ${template.name}`;
    }
    
    // Vary price slightly
    const priceVariation = 0.8 + (Math.random() * 0.4); // ±20%
    variation.price = Math.round(template.price * priceVariation);
    
    // Add size/color variations to description
    const sizes = ['Small', 'Medium', 'Large', 'XS', 'XL'];
    const colors = ['Black', 'White', 'Navy', 'Grey', 'Brown', 'Gold', 'Silver'];
    
    if (template.category.includes('dress') || template.category.includes('top') || template.category.includes('bottom')) {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      variation.description += ` Available in size ${size}.`;
    }
    
    // Generate unique SKU
    variation.sku = generateSku(template.category === 'jewelry' ? 'ZAM' : 'SYD', variation.name);
    
    variations.push(variation);
  }
  
  return variations;
}

export function generateMockProducts() {
  console.log('🎭 Generating mock product data...');
  
  // Generate Zamels jewelry products
  const zamelsProducts = [];
  zamelsProductTemplates.forEach(template => {
    const variations = generateVariations(template, 12);
    variations.forEach(product => {
      zamelsProducts.push({
        ...product,
        currency: 'AUD',
        brand: 'Zamels',
        image_url: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
        product_url: `https://zamels.com.au/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`
      });
    });
  });
  
  // Generate Sydney Street fashion products
  const sydneyStreetProducts = [];
  sydneyStreetProductTemplates.forEach(template => {
    const variations = generateVariations(template, 10);
    variations.forEach(product => {
      sydneyStreetProducts.push({
        ...product,
        currency: 'AUD',
        brand: 'Sydney Street',
        image_url: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000) + 1000}`,
        product_url: `https://sydneystreet.com.au/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`
      });
    });
  });
  
  console.log(`📦 Generated ${zamelsProducts.length} Zamels products`);
  console.log(`📦 Generated ${sydneyStreetProducts.length} Sydney Street products`);
  
  return {
    zamels: zamelsProducts.slice(0, 100),
    sydneyStreet: sydneyStreetProducts.slice(0, 100)
  };
}

function generateSku(prefix, name) {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${clean}-${random}`;
}