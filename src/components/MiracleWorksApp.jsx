import React, { useState } from 'react';
import { Search, Star, ShoppingBag, Sparkles, Diamond, Shirt } from 'lucide-react';

const MiracleWorksApp = ({ store: propStore }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(() => {
    // Use prop store if provided, otherwise auto-detect from URL
    if (propStore) return propStore;
    const path = window.location.pathname;
    if (path.includes('jewelry-store') || path.includes('zamels')) return 'jewelry-store';
    if (path.includes('fashion-store') || path.includes('sydneystreet')) return 'fashion-store';
    return 'jewelry-store'; // default
  });

  // Demo queries to inspire users
  const demoQueries = {
    'jewelry-store': [
      "ring with one stone",
      "gold hoops for everyday",
      "wedding ring for men", 
      "red stone ring",
      "something sparkly for ears",
      "elegant necklace for dinner",
      "diamond earrings",
      "engagement ring proposal"
    ],
    'fashion-store': [
      "casual summer dress",
      "warm winter coat", 
      "shoes for wedding",
      "designer handbag",
      "comfortable jeans",
      "statement jewelry",
      "office outfit",
      "weekend casual wear"
    ],
    // Keep legacy support
    zamels: [
      "ring with one stone",
      "gold hoops for everyday",
      "wedding ring for men", 
      "red stone ring",
      "something sparkly for ears",
      "elegant necklace for dinner",
      "diamond earrings",
      "engagement ring proposal"
    ],
    sydneystreet: [
      "casual summer dress",
      "warm winter coat", 
      "shoes for wedding",
      "designer handbag",
      "comfortable jeans",
      "statement jewelry",
      "office outfit",
      "weekend casual wear"
    ]
  };

  // Store branding
  const storeConfig = {
    'jewelry-store': {
      name: "Premium Jewelry Co",
      tagline: "Exquisite Jewelry for Life's Special Moments",
      icon: Diamond,
      colors: {
        primary: "purple-600",
        secondary: "purple-100",
        accent: "gold-500"
      },
      gradient: "from-purple-50 to-pink-50"
    },
    'fashion-store': {
      name: "Modern Fashion Co", 
      tagline: "Contemporary Fashion for the Modern You",
      icon: Shirt,
      colors: {
        primary: "blue-600",
        secondary: "blue-100", 
        accent: "blue-500"
      },
      gradient: "from-blue-50 to-indigo-50"
    },
    // Legacy support
    zamels: {
      name: "Premium Jewelry Co",
      tagline: "Exquisite Jewelry for Life's Special Moments",
      icon: Diamond,
      colors: {
        primary: "purple-600",
        secondary: "purple-100",
        accent: "gold-500"
      },
      gradient: "from-purple-50 to-pink-50"
    },
    sydneystreet: {
      name: "Modern Fashion Co", 
      tagline: "Contemporary Fashion for the Modern You",
      icon: Shirt,
      colors: {
        primary: "blue-600",
        secondary: "blue-100", 
        accent: "blue-500"
      },
      gradient: "from-blue-50 to-indigo-50"
    }
  };

  const currentStore = storeConfig[store] || storeConfig['jewelry-store']; // Fallback to jewelry-store

  const searchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Map new store names to legacy backend names
      const backendStore = store === 'jewelry-store' ? 'zamels' : 
                          store === 'fashion-store' ? 'sydneystreet' : store;
      
      const response = await fetch('/.netlify/functions/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          store: backendStore,
          limit: 12
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      
      // Show success message for demo
      if (data.results && data.results.length > 0) {
        console.log(`🎯 Found ${data.results.length} products for "${searchQuery}"`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      // Show fallback message
      alert('Search temporarily unavailable. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts(query);
  };

  const tryDemoQuery = (demoQuery) => {
    setQuery(demoQuery);
    searchProducts(demoQuery);
  };

  const formatPrice = (price, currency = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const IconComponent = currentStore.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStore.gradient}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-8 h-8 text-${currentStore.colors.primary}`} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentStore.name}</h1>
                <p className="text-sm text-gray-600">{currentStore.tagline}</p>
              </div>
            </div>
            
            {/* Store Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by</span>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">MiracleWorks AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Search Like You Think
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            No more keyword guessing. Just describe what you're looking for in natural language.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Try: "${demoQueries[store]?.[0] || "ring with one stone"}" or "${demoQueries[store]?.[1] || "gold hoops"}"`}
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Demo Query Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-sm text-gray-500 mr-2">Try these:</span>
            {(demoQueries[store] || demoQueries['jewelry-store']).slice(0, 4).map((demo, index) => (
              <button
                key={index}
                onClick={() => tryDemoQuery(demo)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
                "{demo}"
              </button>
            ))}
          </div>

          {/* Store Switch Links */}
          <div className="flex justify-center space-x-4 text-sm">
            <span className="text-gray-500">Try other demos:</span>
            <button
              onClick={() => window.open('/jewelry-store', '_blank')}
              className={`${store === 'jewelry-store' || store === 'zamels' ? 'font-semibold text-purple-600' : 'text-gray-600 hover:text-purple-600'} transition-colors`}
            >
              Premium Jewelry Co
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => window.open('/fashion-store', '_blank')}
              className={`${store === 'fashion-store' || store === 'sydneystreet' ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              Modern Fashion Co
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Searching with AI...</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Results for "{query}"
              </h3>
              <span className="text-gray-500">{results.length} products found</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image" 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.similarity && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        {Math.round(product.similarity * 100)}% match
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-600">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500">
                          {(4.2 + Math.random() * 0.8).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>View Product</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && query && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No products found for "{query}"</p>
              <p className="text-sm mt-2">Try a different search term or browse our suggestions above.</p>
            </div>
          </div>
        )}

        {/* Demo Footer */}
        <div className="mt-16 text-center py-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Impressed by the Natural Language Search?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            MiracleWorks AI can transform your e-commerce store with intelligent product discovery. 
            Your customers will find exactly what they're looking for, even when they don't know the exact product names.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Request Demo for Your Store
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-100 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiracleWorksApp;