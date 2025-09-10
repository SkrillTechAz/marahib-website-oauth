import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, RefreshCw, Sparkles, Clock } from 'lucide-react';
import LuxuryProductCard from '../components/product/LuxuryProductCard';
import { Product } from '../types';
import { useNewArrivals } from '../hooks/useNewArrivals'; 

const NewArrivalsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  // Use the new arrivals hook
  const { products: apiProducts, loading, error, fetchNewArrivals } = useNewArrivals();

  const parsePrice = (price: string | number): number => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      return parseFloat(price.replace(/,/g, "")) || 0;
    }
    return 0;
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
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
  const transformProduct = (apiProduct: Product ): Product => {
    // Handle colors - use both 'colors' array and 'color' text fields from database
    let productColors = [];
  
    if (apiProduct.colors && Array.isArray(apiProduct.colors)) {
      productColors = apiProduct.colors;
    } else if (apiProduct.color) {
      productColors = [apiProduct.color];
    } else if (apiProduct.available_colors && Array.isArray(apiProduct.available_colors)) {
      productColors = apiProduct.available_colors;
    }

    // Clean up color names - handle nested quotes like "'Red'" -> "Red"
    productColors = productColors
      .filter(color => color && color.toString().trim()) // Remove empty/null colors
      .map(color => {
        let cleanColor = color.toString();
        // Remove outer quotes first, then inner quotes
        cleanColor = cleanColor.replace(/^["']|["']$/g, ''); // Remove outer quotes
        cleanColor = cleanColor.replace(/^["']|["']$/g, ''); // Remove inner quotes (in case of nested quotes)
        return cleanColor.trim();
      })
      .filter(color => color.length > 0); // Remove empty strings after cleaning

      // Parse prices to ensure they're numbers for calculations
    const parsedPrice = parsePrice(apiProduct.price || 0);
    const parsedOriginalPrice = apiProduct.retail_price ? parsePrice(apiProduct.retail_price) : undefined;


    return {
      id: apiProduct.id,
      name: apiProduct.name,
      brand: apiProduct.brand || 'Unknown Brand',
      front_png: apiProduct.front_png || '',
      additional_images: apiProduct.additional_images || [],
      designer: apiProduct.brand || 'Unknown Designer',
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      currency: 'AED',
      images: [apiProduct.front_png, ...(apiProduct.additional_images || [])].filter(Boolean),
      colors: productColors.map((color: string) => ({
        name: color,
        hex: getColorHex(color),
      })),
      category: apiProduct.category?.toLowerCase() || 'furniture',
      subcategory: apiProduct.subcategory || '',
      rating: 4.5,
      reviews: 12,
      stock: apiProduct.stock_quantity || 0,
      description: apiProduct.description || '',
      inStock: (apiProduct.stock_quantity || 0) > 0,
      featured: false,
      isNew: true, // All products from new arrivals API are new
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

  // Transform products for display
  const allProducts = apiProducts.map(transformProduct);

  // Apply filters and sorting
  let filteredProducts = [...allProducts];

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
    );
  }

  // Apply price range filter
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    filteredProducts = filteredProducts.filter((p: Product) => {
      const productPrice = parsePrice(p.price);
      if (max) {
        return productPrice >= min && productPrice <= max;
      } else {
        return productPrice >= min;
      }
    });
  }

  // Apply color filter (case-insensitive matching)
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter((p: Product) =>
      p.colors?.some((c) =>
        selectedColors.some(
          (selectedColor) =>
            selectedColor.toLowerCase() === c.name.toLowerCase()
        )
      )
    );
  }

  // Apply sorting
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sortBy === "newest") {
    filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  // Fetch new arrivals on component mount
  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  // Extract available colors from products
  useEffect(() => {
    if (allProducts.length > 0) {
      const colors = new Set<string>();
      
      allProducts.forEach((product) => {
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach((colorObj) => {
            if (colorObj && colorObj.name && colorObj.name.trim()) {
              const cleanColorName = colorObj.name.trim();
              colors.add(cleanColorName);
            }
          });
        }
      });
      
      const uniqueColors = Array.from(colors).sort();
      setAvailableColors(uniqueColors);
    } else {
      setAvailableColors([]);
    }
  }, [allProducts]);

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };


  // Add debugging effect
  useEffect(() => {
    console.log('=== NEW ARRIVALS DEBUG ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('API Products count:', apiProducts.length);
    console.log('All products count:', allProducts.length);
    console.log('Filtered products count:', filteredProducts.length);
    console.log('Sort by:', sortBy);
    console.log('Filters:', { priceRange, selectedColors, searchQuery });
    
    if (allProducts.length > 0) {
      console.log('New products sample:');
      allProducts.slice(0, 3).forEach(product => {
        console.log(`- ${product.name} (ID: ${product.id}, Price: ${product.price})`);
      });
    }
    console.log('============================');
  }, [allProducts, filteredProducts, loading, error, sortBy, apiProducts.length, priceRange, selectedColors, searchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchNewArrivals()}
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
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-500 mr-3" />
              <h1 className="font-serif text-4xl md:text-6xl text-gray-900">
                New Arrivals
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-500 ml-3" />
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover the latest additions to our collection. Fresh designs and innovative pieces 
              that define contemporary luxury living.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">Just Added</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
              <div className="flex items-center text-gray-600">
                <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
              <div className="text-gray-600">
                <span className="font-medium">Limited Stock</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Stats */}
      <section className="py-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-3xl font-bold mb-2">{allProducts.length}</div>
              <div className="text-gray-300">New Products</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-3xl font-bold mb-2">This Week</div>
              <div className="text-gray-300">Latest Additions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-gray-300">Delivery Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
                Latest Products
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} brand new pieces waiting to transform your space
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                {filteredProducts.length} result
                {filteredProducts.length !== 1 ? "s" : ""} found for "
                {searchQuery}"
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium">Price Range:</span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-1000">Under AED 1,000</option>
                    <option value="1000-3000">AED 1,000 - 3,000</option>
                    <option value="3000-5000">AED 3,000 - 5,000</option>
                    <option value="5000-">Over AED 5,000</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium">Colors:</span>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {availableColors.length > 0
                      ? availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              if (selectedColors.includes(color)) {
                                setSelectedColors(
                                  selectedColors.filter((c) => c !== color)
                                );
                              } else {
                                setSelectedColors([...selectedColors, color]);
                              }
                            }}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              selectedColors.includes(color)
                                ? "ring-2 ring-black ring-offset-2 border-black"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: getColorHex(color) }}
                            title={color}
                          >
                            {selectedColors.includes(color) && (
                              <svg
                                className="w-4 h-4 text-white mx-auto"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                        ))
                      : ["White", "Black", "Gray", "Brown", "Blue", "Green"].map(
                          (color) => (
                            <button
                              key={color}
                              onClick={() => {
                                if (selectedColors.includes(color)) {
                                  setSelectedColors(
                                    selectedColors.filter((c) => c !== color)
                                  );
                                } else {
                                  setSelectedColors([...selectedColors, color]);
                                }
                              }}
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                selectedColors.includes(color)
                                  ? "ring-2 ring-black ring-offset-2 border-black"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            >
                              {selectedColors.includes(color) && (
                                <svg
                                  className="w-4 h-4 text-white mx-auto"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          )
                        )}
                  </div>
                  {selectedColors.length > 0 && (
                    <button
                      onClick={() => setSelectedColors([])}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear ({selectedColors.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Reset Filters Button */}
              {(sortBy !== "featured" || priceRange !== "all" || selectedColors.length > 0 || searchQuery.trim()) && (
                <button
                  onClick={() => {
                    setSortBy("featured");
                    setPriceRange("all");
                    setSelectedColors([]);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <LuxuryProductCard
                    product={product}
                    index={index}
                    variant="detailed"
                    showWishlist={true}
                    showRating={true}
                    showAddToCart={true}
                    className="shadow-sm hover:shadow-md transition-all duration-300 relative"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No New Arrivals Yet</h3>
              <p className="text-gray-600 mb-6">
                We're constantly updating our collection. Check back soon for the latest additions!
              </p>
              <Link
                to="/furniture"
                className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16" style={{ backgroundColor: '#FAF6E7' }}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">
              Stay Updated
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Be the first to know about our latest arrivals, exclusive offers, and design inspiration. 
              Join our community of style enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">
              Need Design Inspiration?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Explore our virtual showrooms or speak with our design experts to see how 
              these new pieces can transform your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/virtual-stores"
                className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide"
              >
                Virtual Showrooms
              </Link>
              <Link
                to="/furniture"
                className="border border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-wide"
              >
                Browse All Furniture
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivalsPage;