import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/product/ProductCard";
import { Product } from "../types";

const BestSellersPage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("bestseller-rank");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  // Helper function to convert color names to hex values
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      // Basic colors
      red: "#FF0000",
      blue: "#0000FF",
      green: "#00FF00",
      yellow: "#FFFF00",
      orange: "#FFA500",
      purple: "#800080",
      pink: "#FFC0CB",
      brown: "#A52A2A",
      black: "#000000",
      white: "#FFFFFF",
      gray: "#808080",
      grey: "#808080",

      // Extended colors
      beige: "#F5F5DC",
      cream: "#F5F5DC",
      navy: "#000080",
      maroon: "#800000",
      teal: "#008080",
      silver: "#C0C0C0",
      gold: "#FFD700",
      tan: "#D2B48C",
      olive: "#808000",
      lime: "#00FF00",
      aqua: "#00FFFF",
      fuchsia: "#FF00FF",
      coral: "#FF7F50",
      salmon: "#FA8072",
      khaki: "#F0E68C",
      lavender: "#E6E6FA",
      plum: "#DDA0DD",
      turquoise: "#40E0D0",
      crimson: "#DC143C",
      indigo: "#4B0082",
      magenta: "#FF00FF",
      cyan: "#00FFFF",
      mint: "#98FB98",
      rose: "#FF69B4",
      ivory: "#FFFFF0",
      chocolate: "#D2691E",
      caramel: "#C68E17",
      champagne: "#F7E7CE",
      copper: "#B87333",
      bronze: "#CD7F32",
      rust: "#B7410E",
      emerald: "#50C878",
      ruby: "#E0115F",
      sapphire: "#0F52BA",
      charcoal: "#36454F",
      slate: "#708090",
      steel: "#4682B4",
      pearl: "#EAE0C8",
      mahogany: "#C04000",
      walnut: "#773F1A",
      oak: "#806517",
      cherry: "#DE3163",
      ash: "#B2BEB5",
      maple: "#D2691E",
      pine: "#01796F",
      cedar: "#A0522D",
      birch: "#F5DEB3",
      ebony: "#555D50",
      rosewood: "#65000B",
      teak: "#B8860B",
      bamboo: "#C7B377",
      wicker: "#C19A6B",
      rattan: "#B7950B",
      linen: "#FAF0E6",
      cotton: "#FFFDD0",
      wool: "#F5F5DC",
      silk: "#F5F5DC",
      cashmere: "#E6E6FA",
      velvet: "#800080",
      suede: "#8B4513",
      leather: "#964B00",
      denim: "#1560BD",
      canvas: "#FAF0E6",
      burlap: "#DEB887",
      default: "#000000",
    };

    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || colorMap["default"];
  };

  // Transform API product to match Product interface
  const transformProduct = (apiProduct: any): Product => {
    // Handle colors - prioritize 'color' string field over unreliable 'colors' array
    let productColors = [];

    // First try to use the color string field
    if (apiProduct.color && typeof apiProduct.color === "string") {
      const colorString = apiProduct.color.trim();
      if (colorString) {
        productColors = colorString
          .split(",")
          .map((color) => color.trim())
          .filter((color) => color.length > 0);
      }
    }
    // Fallback to colors array
    else if (apiProduct.colors && Array.isArray(apiProduct.colors)) {
      productColors = apiProduct.colors;
    }

    // Clean up color names
    productColors = productColors
      .filter((color) => color && color.toString().trim())
      .map((color) => {
        let cleanColor = color.toString();
        cleanColor = cleanColor.replace(/^["']|["']$/g, "");
        cleanColor = cleanColor.replace(/^["']|["']$/g, "");
        return cleanColor.trim();
      })
      .filter((color) => color.length > 0);

    // Handle images
    const primaryImageUrl =
      apiProduct.front_png ||
      apiProduct.front_image_url ||
      apiProduct.image_url ||
      apiProduct.front_png?.image_url;

    const additionalImages = [
      apiProduct.side_image_url,
      apiProduct.detail_image_url,
      apiProduct.lifestyle_image_url,
      apiProduct.angle_2_image,
      apiProduct.angle_3_image,
      apiProduct.lifestyle_image,
      ...(apiProduct.additional_images || []),
    ].filter(Boolean);

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      brand: apiProduct.brand || "Unknown Brand",
      front_png: primaryImageUrl || "",
      additional_images: additionalImages,
      designer: apiProduct.brand || "Unknown Designer",
      price: apiProduct.price,
      originalPrice: apiProduct.retail_price,
      retail_price: apiProduct.retail_price,
      vat_percent: apiProduct.vat_percent,
      discount: apiProduct.discount,
      currency: "AED",
      images: [primaryImageUrl, ...additionalImages].filter(Boolean),

      colors: productColors.map((color: string) => ({
        name: color,
        hex: getColorHex(color),
      })),

      category: apiProduct.category?.toLowerCase() || "furniture",
      subcategory: apiProduct.subcategory || "",
      rating: 0,
      reviews: 0,
      stock: apiProduct.stock_quantity || 0,
      description: apiProduct.description || "",
      inStock: (apiProduct.stock_quantity || 0) > 0,
      featured: false,
      isNew: apiProduct.new_in || false,
      stockQuantity: apiProduct.stock_quantity || 0,
      materials: apiProduct.materials || "",
      dimensions: {
        length: apiProduct.dimensions_l || 0,
        width: apiProduct.dimensions_w || 0,
        height: apiProduct.dimensions_h || 0,
      },
      weight: apiProduct.weight || 0,
      features: [],
      warranty: apiProduct.warranty || "",
      careInstructions: apiProduct.care_instructions || "",
      assemblyRequired: apiProduct.assembly_required || false,
      style: apiProduct.style || "",
      roomType: apiProduct.room_type || "",
      sku: apiProduct.sku || "",
      countryOfOrigin: apiProduct.country_of_origin || "",
      finish: apiProduct.finish || "",
      shippingCost: apiProduct.shipping_cost || 0,
      tags: apiProduct.tag ? [apiProduct.tag] : [],
      
      // Bestseller-specific fields
      bestsellerRank: apiProduct.bestseller_rank,
      totalOrders: apiProduct.total_orders,
      totalQuantitySold: apiProduct.total_quantity_sold,
    };
  };

  // Fetch bestseller products from API
  const fetchBestsellerProducts = async () => {
    console.log("=== FETCHING BESTSELLER PRODUCTS ===");

    try {
      setLoading(true);
      
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/category/bestsellers`;
      console.log("API URL:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log("API Response:", json);

      if (json.result === "success" && json.data) {
        const transformedProducts = json.data.map(transformProduct);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        console.log(`✅ SUCCESS: Set ${transformedProducts.length} bestseller products`);
      } else {
        console.error("API returned no data or failed:", json);
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (error: any) {
      console.error("Error fetching bestseller products:", error.message);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bestsellers on component mount
  useEffect(() => {
    fetchBestsellerProducts();
  }, []);

  // Extract available colors from products
  useEffect(() => {
    if (allProducts.length > 0) {
      const colors = new Set<string>();

      allProducts.forEach((product) => {
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach((colorObj) => {
            if (colorObj && colorObj.name && colorObj.name.trim()) {
              colors.add(colorObj.name.trim());
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

  // Apply filters and sorting
  useEffect(() => {
    let products = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      products = products.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      products = products.filter((p: Product) => {
        const numericPrice =
          typeof p.price === "string"
            ? parseFloat(p.price.replace(/,/g, ""))
            : p.price;
        if (max) {
          return numericPrice >= min && numericPrice <= max;
        } else {
          return numericPrice >= min;
        }
      });
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      products = products.filter((p: Product) =>
        p.colors?.some((c) =>
          selectedColors.some(
            (selectedColor) =>
              selectedColor.toLowerCase() === c.name.toLowerCase()
          )
        )
      );
    }

    // Apply sorting
    if (sortBy === "bestseller-rank") {
      products.sort((a, b) => (a.bestsellerRank || 999) - (b.bestsellerRank || 999));
    } else if (sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === "most-ordered") {
      products.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    } else if (sortBy === "newest") {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    setFilteredProducts(products);
  }, [allProducts, sortBy, priceRange, selectedColors, searchQuery]);

  // Product card skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  // Enhanced ProductCard wrapper with bestseller badge
  const BestsellerProductCard = ({ product, index }: { product: Product; index: number }) => (
    <div className="relative">
      <ProductCard
        product={product}
        showAddToCart={true}
        showWishlist={true}
      />
    </div>
  );

  return (
    <div className="py-12 bg-primary-50">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-hatton text-4xl md:text-5xl mb-4">
            Bestsellers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and best-selling furniture pieces, loved by customers and proven by sales. These are the items that have won hearts and found homes across the UAE.
          </p>
        </motion.div>

        

        {/* Search Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bestselling products by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="bestseller-rank">Bestseller Rank</option>
                  <option value="most-ordered">Most Ordered</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">Price Range:</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Prices</option>
                  <option value="0-1000">Under 1,000 AED</option>
                  <option value="1000-3000">1,000 - 3,000 AED</option>
                  <option value="3000-5000">3,000 - 5,000 AED</option>
                  <option value="5000-">Over 5,000 AED</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">Colors:</span>
                <div className="flex flex-wrap gap-2 max-w-md">
                  {(availableColors.length > 0
                    ? availableColors
                    : ["White", "Black", "Gray", "Brown", "Blue", "Green"]
                  ).map((color) => (
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
                          ? "ring-2 ring-primary-500 ring-offset-2 border-primary-500"
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
                  ))}
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
            {(sortBy !== "bestseller-rank" ||
              priceRange !== "all" ||
              selectedColors.length > 0 ||
              searchQuery.trim()) && (
              <button
                onClick={() => {
                  setSortBy("bestseller-rank");
                  setPriceRange("all");
                  setSelectedColors([]);
                  setSearchQuery("");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }, (_, index) => (
                <ProductSkeleton key={`skeleton-${index}`} />
              ))
            : filteredProducts.map((product: Product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BestsellerProductCard product={product} index={index} />
                </motion.div>
              ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No bestseller products found</h3>
            <p className="text-gray-600">
              Please try adjusting your filters or check back later as our bestsellers list updates regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellersPage;