import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Star, Heart, ArrowRight, Users } from 'lucide-react';
import { allProducts } from '../data/allProducts';
import LuxuryProductCard from '../components/product/LuxuryProductCard';

const DiningRoomPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const diningProducts = allProducts.filter(product => product.category === 'dining-room');
  
  const filteredProducts = selectedSubcategory === 'all' 
    ? diningProducts 
    : diningProducts.filter(product => product.subcategory === selectedSubcategory);

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
    { id: 'all', name: 'All Dining' },
    { id: 'dining-tables', name: 'Dining Tables' },
    { id: 'dining-chairs', name: 'Dining Chairs' },
    { id: 'sideboards', name: 'Sideboards' },
    { id: 'bar-stools', name: 'Bar Stools' },
    { id: 'dining-sets', name: 'Complete Sets' },
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
            <span className="text-black font-medium">Dining Room</span>
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
              Dining Room Furniture
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create memorable dining experiences with our elegant collection of tables, chairs, 
              and storage solutions designed for entertaining and everyday meals.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                <span>4.8 Average Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>Seats 2-12 People</span>
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
              Showing {sortedProducts.length} of {diningProducts.length} products
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
              <p className="text-gray-600">Try adjusting your filters or browse all dining furniture.</p>
            </div>
          )}
        </div>
      </section>

      {/* Dining Sets Feature */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl text-gray-900 mb-6">Complete Dining Sets</h2>
              <p className="text-gray-600 mb-6">
                Take the guesswork out of decorating with our perfectly coordinated dining sets. 
                Each set is carefully curated to ensure style harmony and optimal functionality.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Professionally matched pieces
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Available for 4, 6, 8, or 12 people
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Special bundle pricing
                </li>
              </ul>
              <Link 
                to="/category/dining-sets" 
                className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
              >
                Shop Dining Sets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" 
                alt="Dining room set"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiningRoomPage;