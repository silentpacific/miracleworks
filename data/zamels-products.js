// data/zamels-products.js
// Sample jewelry data for Zamels demo

export const zamelsProducts = [
  {
    name: "Diamond Solitaire Engagement Ring",
    description: "Classic round brilliant diamond in 18k white gold setting. Perfect for proposals and engagements. Single stone design showcases the diamond beautifully.",
    price: 3500.00,
    currency: "AUD",
    sku: "ZAM-DR-001",
    category: "engagement-rings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Diamond+Ring",
    product_url: "https://zamels.com.au/diamond-solitaire-ring"
  },
  {
    name: "Gold Hoop Earrings",
    description: "Elegant 14k yellow gold hoops. Classic everyday jewelry that complements any outfit. Lightweight and comfortable for all-day wear.",
    price: 450.00,
    currency: "AUD",
    sku: "ZAM-HE-002",
    category: "earrings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Gold+Hoops",
    product_url: "https://zamels.com.au/gold-hoop-earrings"
  },
  {
    name: "Men's Stainless Steel Wedding Band",
    description: "Durable brushed stainless steel wedding ring for men. Modern masculine design perfect for everyday wear. Scratch resistant and hypoallergenic.",
    price: 280.00,
    currency: "AUD",
    sku: "ZAM-MB-003",
    category: "wedding-bands",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Wedding+Band",
    product_url: "https://zamels.com.au/mens-wedding-band"
  },
  {
    name: "Ruby Cluster Ring",
    description: "Stunning red ruby stones arranged in a cluster setting. Vintage-inspired design with intricate detailing. Set in 14k yellow gold.",
    price: 1200.00,
    currency: "AUD",
    sku: "ZAM-RR-004",
    category: "gemstone-rings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Ruby+Ring",
    product_url: "https://zamels.com.au/ruby-cluster-ring"
  },
  {
    name: "Pearl Necklace",
    description: "Elegant freshwater pearl necklace. Classic strand of lustrous white pearls. Perfect for formal occasions and special events.",
    price: 650.00,
    currency: "AUD",
    sku: "ZAM-PN-005",
    category: "necklaces",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Pearl+Necklace",
    product_url: "https://zamels.com.au/pearl-necklace"
  },
  {
    name: "Sapphire Tennis Bracelet",
    description: "Beautiful blue sapphires set in sterling silver tennis bracelet. Continuous line of sparkling stones. Elegant addition to any jewelry collection.",
    price: 850.00,
    currency: "AUD",
    sku: "ZAM-SB-006",
    category: "bracelets",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Sapphire+Bracelet",
    product_url: "https://zamels.com.au/sapphire-tennis-bracelet"
  },
  {
    name: "Vintage Art Deco Brooch",
    description: "Exquisite vintage-style art deco brooch with crystals and geometric patterns. Statement piece perfect for special occasions and formal wear.",
    price: 320.00,
    currency: "AUD",
    sku: "ZAM-VB-007",
    category: "brooches",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Art+Deco+Brooch",
    product_url: "https://zamels.com.au/vintage-art-deco-brooch"
  },
  {
    name: "Rose Gold Stacking Rings Set",
    description: "Set of three delicate rose gold rings designed to stack together. Mix and match design with different textures. Modern minimalist jewelry.",
    price: 390.00,
    currency: "AUD",
    sku: "ZAM-RS-008",
    category: "rings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Stacking+Rings",
    product_url: "https://zamels.com.au/rose-gold-stacking-rings"
  },
  {
    name: "Diamond Stud Earrings",
    description: "Classic diamond stud earrings in white gold. Timeless design suitable for everyday wear or special occasions. Brilliant cut diamonds.",
    price: 1800.00,
    currency: "AUD",
    sku: "ZAM-DS-009",
    category: "earrings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Diamond+Studs",
    product_url: "https://zamels.com.au/diamond-stud-earrings"
  },
  {
    name: "Emerald Drop Necklace",
    description: "Elegant emerald pendant on delicate gold chain. Rich green stone in classic teardrop cut. Perfect statement piece for evening wear.",
    price: 950.00,
    currency: "AUD",
    sku: "ZAM-EN-010",
    category: "necklaces",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Emerald+Necklace",
    product_url: "https://zamels.com.au/emerald-drop-necklace"
  },
  {
    name: "Titanium Men's Ring",
    description: "Modern titanium ring for men with brushed finish. Ultra-lightweight and durable. Contemporary design perfect for active lifestyle.",
    price: 220.00,
    currency: "AUD",
    sku: "ZAM-TR-011",
    category: "mens-rings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Titanium+Ring",
    product_url: "https://zamels.com.au/titanium-mens-ring"
  },
  {
    name: "Crystal Chandelier Earrings",
    description: "Glamorous chandelier earrings with cascading crystals. Statement jewelry perfect for formal events and special occasions. Sparkling design.",
    price: 180.00,
    currency: "AUD",
    sku: "ZAM-CE-012",
    category: "earrings",
    brand: "Zamels",
    image_url: "https://via.placeholder.com/400x400?text=Chandelier+Earrings",
    product_url: "https://zamels.com.au/crystal-chandelier-earrings"
  }
];

// Import function to add these to Supabase
export async function importZamelsData() {
  const { importProducts } = await import('../utils/embeddings.js');
  await importProducts(zamelsProducts, 'zamels');
}