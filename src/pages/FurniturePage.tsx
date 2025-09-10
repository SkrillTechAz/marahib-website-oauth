import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid, List, Star, RefreshCw } from 'lucide-react';
import LuxuryProductCard from '../components/product/LuxuryProductCard';
import { Product } from '../types';
import { 
  useSubcategories, 
  useProducts, 
   
} from '../utils/categoriesApi';

const FurniturePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Use custom hooks for data fetching
  const { subcategories, loading: subcategoriesLoading, error: subcategoriesError, refetch: refetchSubcategories } = useSubcategories();
  const { products, loading: productsLoading, error: productsError, fetchProducts } = useProducts();

  // Helper function to create URL-safe slugs
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/&/g, '-and-')  // Replace & with -and-
      .replace(/\s+/g, '-')    // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
      .replace(/-+/g, '-')     // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
  };

  // Helper function to convert color names to hex values
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'grey': '#808080',
      'beige': '#F5F5DC',
      'cream': '#F5F5DC',
      'navy': '#000080',
      'maroon': '#800000',
      'teal': '#008080',
      'silver': '#C0C0C0',
      'gold': '#FFD700'
    };
    
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || '#000000';
  };

  // Transform API product to match Product interface
  const transformProduct = (apiProduct: any): Product => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      brand: apiProduct.brand || 'Unknown Brand',
      front_png: apiProduct.front_png || '',
      additional_images: apiProduct.additional_images || [],
      designer: apiProduct.brand || 'Unknown Designer',
      price: apiProduct.price || 0,
      originalPrice: apiProduct.retail_price || undefined,
      currency: 'AED',
      images: [apiProduct.front_png, ...(apiProduct.additional_images || [])].filter(Boolean),
      colors: apiProduct.colors?.map((color: string) => ({
        name: color.replace(/'/g, ''),
        hex: getColorHex(color.replace(/'/g, ''))
      })) || [{ name: 'Default', hex: '#000000' }],
      category: apiProduct.category?.toLowerCase() || 'furniture',
      subcategory: apiProduct.subcategory || '',
      rating: 4.5,
      reviews: 12,
      stock: apiProduct.stock_quantity || 0,
      description: apiProduct.description || '',
      inStock: (apiProduct.stock_quantity || 0) > 0,
      featured: false,
      isNew: apiProduct.new_in || false,
      stockQuantity: apiProduct.stock_quantity || 0,
      materials: apiProduct.materials || '',
      dimensions: {
        length: apiProduct.dimensions_l || 0,
        width: apiProduct.dimensions_w || 0,
        height: apiProduct.dimensions_h || 0
      },
      weight: apiProduct.weight || 0,
      features: [],
      warranty: apiProduct.warranty || '',
      careInstructions: apiProduct.care_instructions || '',
      assemblyRequired: apiProduct.assembly_required || false,
      style: apiProduct.style || '',
      roomType: apiProduct.room_type || '',
      sku: apiProduct.sku || '',
      countryOfOrigin: apiProduct.country_of_origin || '',
      finish: apiProduct.finish || '',
      shippingCost: apiProduct.shipping_cost || 0,
      tags: apiProduct.tag ? [apiProduct.tag] : []
    };
  };

  // Transform and sort products
  const transformedProducts = products.map(transformProduct);
  const sortedProducts = [...transformedProducts].sort((a, b) => {
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

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // Initial products fetch
  useEffect(() => {
    fetchProducts('all');
  }, []);

  
// Add this debugging effect after your existing useEffect hooks
useEffect(() => {
  console.log('=== PRODUCTS DEBUG ===');
  console.log('Products loading:', productsLoading);
  console.log('Products error:', productsError);
  console.log('Products count:', products.length);
  console.log('Selected category:', selectedCategory);
  console.log('=====================');
}, [products, productsLoading, productsError, selectedCategory]);

  // Loading state
  if (subcategoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (subcategoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {subcategoriesError}</p>
          <button 
            onClick={refetchSubcategories}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-6xl text-gray-900 mb-6">
              Furniture Collections
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover our curated selection of premium furniture pieces, each designed to transform 
              your space into a sanctuary of style and comfort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-gray-600">
                <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                <span className="font-medium">4.8 Average Rating</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
              <div className="text-gray-600">
                <span className="font-medium">{subcategories.length}+ Categories</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
              <div className="text-gray-600">
                <span className="font-medium">Free Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4 text-center">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Browse our thoughtfully organized furniture collections designed for every room in your home.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories
            .filter(subcategory => subcategory.id >= 1 && subcategory.id <= 12)
            .map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group cursor-pointer"
              >
                <Link to={`/category/${createSlug(category.name)}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                      
                      {/* Product Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {category.subSubcategories?.length || 0} Types
                      </div>

                      {/* Category Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <h3 className="font-serif text-2xl text-white mb-2">{category.name}</h3>
                        <div className="flex items-center text-white/80 text-sm">
                          <span>Explore Collection</span>
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="p-6">
                      <h4 className="font-medium text-gray-900 mb-3">Popular Items:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.subSubcategories?.slice(0, 4).map((sub, idx) => (
                          <span
                            key={sub.id}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {(category.subSubcategories?.length || 0) > 4 && (
                          <span className="text-xs text-gray-500">
                            +{(category.subSubcategories?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked pieces from our premium collections
              </p>
            </div>

            {/* Filters and View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 lg:mt-0">
              <div className="flex items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  disabled={productsLoading}
                >
                  <option value="all">All Categories</option>
                  {subcategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-300 rounded-md">
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
          </div>

          {/* Products Loading State */}
          {productsLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Products Error State */}
          {productsError && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading products: {productsError}</p>
              <button 
                onClick={() => fetchProducts(selectedCategory)}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && !productsError && (
            <>
              <div className={`grid gap-0 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.slice(0, 8).map((product, index) => (
                  <LuxuryProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    variant="detailed"
                    showWishlist={true}
                    showRating={true}
                    showAddToCart={true}
                    className="shadow-sm hover:shadow-md transition-all duration-300"
                  />
                ))}
              </div>

              {/* No Products Message */}
              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No products found for the selected category.</p>
                </div>
              )}
            </>
          )}

          {/* View All Products Button */}
          {sortedProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/category/all"
                className="inline-flex items-center bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide"
              >
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16" style={{ backgroundColor: '#FAF6E7' }}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Our design experts are here to help you create the perfect space. 
              Get personalized recommendations and styling advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/virtual-stores"
                className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide"
              >
                Explore Virtual Showrooms
              </Link>
              <button className="border border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-wide">
                Book Design Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FurniturePage;