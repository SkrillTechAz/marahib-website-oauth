import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Star, Heart, ArrowRight, Settings, Layers } from 'lucide-react';
import { allProducts } from '../data/allProducts';
import LuxuryProductCard from '../components/product/LuxuryProductCard';

const ModularPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const modularProducts = allProducts.filter(product => product.category === 'modular');
  
  const filteredProducts = selectedSubcategory === 'all' 
    ? modularProducts 
    : modularProducts.filter(product => product.subcategory === selectedSubcategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const subcategories = [
    { id: 'all', name: 'All Modular' },
    { id: 'modular-sofas', name: 'Modular Sofas' },
    { id: 'modular-storage', name: 'Storage Systems' },
    { id: 'modular-shelving', name: 'Shelving' },
    { id: 'modular-desks', name: 'Desk Systems' },
    { id: 'custom-configurations', name: 'Custom' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/furniture" className="hover:text-black transition-colors">Furniture</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Modular</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
              Modular Furniture
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Flexible furniture solutions that adapt to your space and lifestyle. 
              Create custom configurations that grow and change with your needs.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                <span>4.6 Average Rating</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                <span>Customizable</span>
              </div>
              <div className="flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                <span>Expandable Systems</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-8">
        <div className="container-custom">
          {/* Subcategory Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedSubcategory === sub.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''} transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {sortedProducts.length} of {modularProducts.length} products
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-0 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map((product, index) => (
              <LuxuryProductCard
                key={product.id}
                product={product}
                index={index}
                variant="minimal"
                useCustomImage={true}
              />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or browse all modular furniture.</p>
            </div>
          )}
        </div>
      </section>

      {/* Customization Feature */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" 
                alt="Modular furniture configuration"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-gray-900 mb-6">Endless Possibilities</h2>
              <p className="text-gray-600 mb-6">
                Our modular systems are designed to grow with your needs. Start with a basic configuration 
                and expand over time, or create a completely custom solution from day one.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Mix and match components freely
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Add pieces anytime to expand
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Free design consultation included
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  3D visualization available
                </li>
              </ul>
              <Link 
                to="/modular-configurator" 
                className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
              >
                Try Our Configurator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModularPage;