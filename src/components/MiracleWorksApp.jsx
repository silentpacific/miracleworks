import React, { useState, useEffect } from 'react';
import { Search, Star, ShoppingBag, Sparkles } from 'lucide-react';

const MiracleWorksApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState('zamels');

  // Demo queries to inspire users
  const demoQueries = {
    zamels: [
      "ring with one stone",
      "gold hoops for everyday",
      "wedding ring for men", 
      "red stone ring",
      "something sparkly for ears",
      "elegant necklace for dinner"
    ],
    sydneystreet: [
      "casual summer dress",
      "warm winter coat",
      "shoes for wedding",
      "designer handbag",
      "comfortable jeans",
      "statement jewelry"
    ]
  };

  const searchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          store: store,
          limit: 12
        })
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MiracleWorks</h1>
                <p className="text-sm text-gray-600">AI-Powered Product Discovery</p>
              </div>
            </div>
            
            {/* Store Selector */}
            <select 
              value={store} 
              onChange={(e) => setStore(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="zamels">Zamels Jewelry</option>
              <option value="sydneystreet">Sydney Street Fashion</option>
            </select>
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
                placeholder={`Try: "${demoQueries[store][0]}" or "${demoQueries[store][1]}"`}
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
            {demoQueries[store].slice(0, 4).map((demo, index) => (
              <button
                key={index}
                onClick={() => tryDemoQuery(demo)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
              >
                "{demo}"
              </button>
            ))}
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
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x400/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`;
                      }}
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
                      <span className={`text-lg font-bold text-${currentStore.colors.primary}`}>
                        {formatPrice(product.price, product.currency)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500">
                          {(4.2 + Math.random() * 0.8).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <button className={`w-full mt-3 bg-${currentStore.colors.primary} text-white py-2 rounded-lg hover:bg-${currentStore.colors.primary.replace('600', '700')} transition-colors flex items-center justify-center space-x-2`}>
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
            <button className={`border-2 border-${currentStore.colors.primary} text-${currentStore.colors.primary} px-6 py-3 rounded-lg hover:bg-${currentStore.colors.secondary} transition-colors`}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiracleWorksApp;