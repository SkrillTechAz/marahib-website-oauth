import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Star, Heart, ArrowRight } from 'lucide-react';
import { allProducts } from '../data/allProducts';
import LuxuryProductCard from '../components/product/LuxuryProductCard';

const LivingRoomPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const livingRoomProducts = allProducts.filter(product => product.category === 'living-room');
  
  const filteredProducts = selectedSubcategory === 'all' 
    ? livingRoomProducts 
    : livingRoomProducts.filter(product => product.subcategory === selectedSubcategory);

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
    { id: 'all', name: 'All Living Room' },
    { id: 'coffee-tables', name: 'Coffee Tables' },
    { id: 'side-tables', name: 'Side Tables' },
    { id: 'bookcases', name: 'Bookcases' },
    { id: 'console-tables', name: 'Console Tables' },
    { id: 'media-consoles', name: 'Media Consoles' },
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
            <span className="text-black font-medium">Living Room</span>
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
              Living Room Furniture
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your living space with our carefully curated collection of tables, storage, 
              and accent pieces designed to complement any style.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                <span>4.6 Average Rating</span>
              </div>
              <div>
                <span className="font-medium">{livingRoomProducts.length} Products</span>
              </div>
              <div>
                <span>Matching Sets Available</span>
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
              Showing {sortedProducts.length} of {livingRoomProducts.length} products
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
              <p className="text-gray-600">Try adjusting your filters or browse all living room furniture.</p>
            </div>
          )}
        </div>
      </section>

      {/* Style Guide */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Living Room Style Guide</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create the perfect living space with our expert styling tips and coordinated furniture collections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Modern Minimalist',
                description: 'Clean lines and functional design',
                image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
                link: '/style-guide/modern'
              },
              {
                title: 'Classic Elegance',
                description: 'Timeless pieces with sophisticated details',
                image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
                link: '/style-guide/classic'
              },
              {
                title: 'Contemporary Mix',
                description: 'Blend of modern and traditional elements',
                image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg',
                link: '/style-guide/contemporary'
              }
            ].map((style, index) => (
              <motion.div
                key={style.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={style.link}>
                  <div className="relative aspect-[4/3] overflow-hidden mb-4">
                    <img 
                      src={style.image} 
                      alt={style.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-serif text-xl mb-1 text-white font-bold">{style.title}</h3>
                      <p className="text-sm text-white/80">{style.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LivingRoomPage;