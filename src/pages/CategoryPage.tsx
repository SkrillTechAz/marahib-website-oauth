import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/product/ProductCard";
import { Product } from "../types";

interface SubSubcategory {
  id: string;
  name: string;
  subcategory_id: string;
  category_id: string;
  image_url: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category_id: string;
  subSubcategories: SubSubcategory[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  subcategories: Subcategory[];
}

const CategoryPage: React.FC = () => {
  const { roomType: category, subcategory } = useParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategories, setCurrentSubcategories] = useState<
    Subcategory[]
  >([]);
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
    // FIXED: Handle colors - prioritize 'color' string field over unreliable 'colors' array
    let productColors = [];

    // First try to use the color string field (which is correct for bulk uploads)
    if (apiProduct.color && typeof apiProduct.color === "string") {
      const colorString = apiProduct.color.trim();
      if (colorString) {
        // Split by comma and process each color
        productColors = colorString
          .split(",")
          .map((color) => color.trim())
          .filter((color) => color.length > 0);
      }
    }
    // Fallback to colors array only if color string is not available
    else if (apiProduct.colors && Array.isArray(apiProduct.colors)) {
      productColors = apiProduct.colors;
    }
    // Final fallback to available_colors
    else if (
      apiProduct.available_colors &&
      Array.isArray(apiProduct.available_colors)
    ) {
      productColors = apiProduct.available_colors;
    }

    // Clean up color names - handle nested quotes like "'Red'" -> "Red"
    productColors = productColors
      .filter((color) => color && color.toString().trim()) // Remove empty/null colors
      .map((color) => {
        let cleanColor = color.toString();
        // Remove outer quotes first, then inner quotes
        cleanColor = cleanColor.replace(/^["']|["']$/g, ""); // Remove outer quotes
        cleanColor = cleanColor.replace(/^["']|["']$/g, ""); // Remove inner quotes (in case of nested quotes)
        return cleanColor.trim();
      })
      .filter((color) => color.length > 0); // Remove empty strings after cleaning

    // Handle images from your actual database structure
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

    // Handle price - use your actual price fields
    const productPrice = apiProduct.price || apiProduct.price_range?.min || 0;
    const originalPrice =
      apiProduct.retail_price ||
      apiProduct.price_range?.compare_at_min ||
      undefined;

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      brand: apiProduct.brand || "Unknown Brand",
      front_png: primaryImageUrl || "",
      additional_images: additionalImages,
      designer: apiProduct.brand || "Unknown Designer",
      price: apiProduct.price,
      originalPrice: apiProduct.retail_price,

      retail_price:apiProduct.retail_price,
      vat_percent: apiProduct.vat_percent,
      discount: apiProduct.discount,
      currency: "AED",
      images: [primaryImageUrl, ...additionalImages].filter(Boolean),

      // Uses the fixed color processing
      colors: productColors.map((color: string) => ({
        name: color,
        hex: getColorHex(color),
      })),

      category: apiProduct.category?.toLowerCase() || "furniture",
      subcategory: apiProduct.subcategory || "",
      rating: 0,
      reviews: 0,
      stock: apiProduct.stock_quantity || apiProduct.total_inventory || 0,
      description: apiProduct.description || "",
      inStock:
        (apiProduct.stock_quantity || apiProduct.total_inventory || 0) > 0,
      featured: false,
      isNew: apiProduct.new_in || apiProduct.is_on_sale || false,
      stockQuantity:
        apiProduct.stock_quantity || apiProduct.total_inventory || 0,
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
    };
  };

  // New API function for navbar-generated URLs
  // Fixed fetchProductsFromNewAPI function for CategoryPage.tsx
  // Replace the existing function with this corrected version

  // New API function for navbar-generated URLs
  // Also add this debugging version of fetchProductsFromNewAPI
  const fetchProductsFromNewAPI = async (
    roomType: string,
    subcategory?: string
  ) => {
    console.log("=== FETCHPRODUCTSFROMNEWAPI DEBUG START ===");
    console.log("Function called with:", { roomType, subcategory });

    try {
      setLoading(true);
      console.log("⏳ Loading state set to true");

      let url: string;

      // Handle special cases first
      if (roomType === "all") {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/category/all`;
        console.log("🌐 Using 'all' endpoint:", url);
      } else if (roomType === "new") {
        url = `${import.meta.env.VITE_API_BASE_URL}/api/category/new`;
        console.log("🌐 Using 'new' endpoint:", url);
      } else if (subcategory) {
        // Existing subcategory logic
        url = `${
          import.meta.env.VITE_API_BASE_URL
        }/api/category/${roomType}/${subcategory}`;
        console.log("🌐 Using room + subcategory endpoint:", url);
      } else {
        // Existing room type only logic
        url = `${import.meta.env.VITE_API_BASE_URL}/api/category/${roomType}`;
        console.log("🌐 Using room type only endpoint:", url);
      }

      console.log("🔄 About to fetch from:", url);

      const response = await fetch(url);
      console.log("📡 Fetch response received");
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} - ${response.statusText}`
        );
      }

      const json = await response.json();
      console.log("📊 Raw API Response:", json);
      console.log("Response result:", json.result);
      console.log("Response data length:", json.data?.length);

      if (json.result === "success" && json.data) {
        console.log("✅ API returned success with data");
        const transformedProducts = json.data.map(transformProduct);
        console.log("🔄 Transformed products:", transformedProducts.length);

        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        console.log(
          `✅ SUCCESS: Set ${transformedProducts.length} products from API`
        );
        console.log(
          "Sample product names:",
          transformedProducts.slice(0, 3).map((p) => p.name)
        );
      } else {
        console.error("❌ API returned no data or failed:", json);
        console.log("Setting empty arrays...");
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (error: any) {
      console.error("❌ ERROR in fetchProductsFromNewAPI:", error.message);
      console.error("❌ Full error:", error);
      // console.error("❌ URL that failed:", url);

      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
      console.log("⏹️ Loading state set to false");
      console.log("=== FETCHPRODUCTSFROMNEWAPI DEBUG END ===");
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/categories`
      );
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();

      if (json.success) {
        setCategories(json.data);
        console.log("Fetched categories:", json.data);
      } else {
        console.error("Failed to fetch categories:", json.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubcategoriesForCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/subcategories/${categoryId}`
      );
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();

      if (json.success) {
        setCurrentSubcategories(json.data);
        console.log("Fetched subcategories for category:", json.data);
      } else {
        console.error("Failed to fetch subcategories:", json.error);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch all products (no filters)
  const getAllProducts = async () => {
    console.log("Fetching all products");

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/products`;
    console.log("API URL:", url);

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();

      console.log("API Response:", json);

      if (json.result === "success" && json.data) {
        const transformedProducts = json.data.map(transformProduct);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        console.log("Fetched and transformed products:", transformedProducts);
      } else {
        console.error("API returned no data or failed:", json);
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by subcategory
  const getProductsBySubcategory = async (subcategoryParam: string) => {
    console.log("Fetching products for subcategory:", subcategoryParam);

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/products?s_c=${subcategoryParam}`;
    console.log("API URL:", url);

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();

      console.log("API Response:", json);

      if (json.result === "success" && json.data) {
        const transformedProducts = json.data.map(transformProduct);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        console.log("Fetched and transformed products:", transformedProducts);
      } else {
        console.error("API returned no data or failed:", json);
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by sub-subcategory
  const getProductsBySubSubcategory = async (subSubcategoryParam: string) => {
    console.log("Fetching products for sub-subcategory:", subSubcategoryParam);

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/products?s_s_c=${subSubcategoryParam}`;
    console.log("API URL:", url);

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const json = await response.json();

      console.log("API Response:", json);

      if (json.result === "success" && json.data) {
        const transformedProducts = json.data.map(transformProduct);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        console.log("Fetched and transformed products:", transformedProducts);
      } else {
        console.error("API returned no data or failed:", json);
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Display name functions that handle both navbar and existing URLs
  const getCategoryDisplayName = () => {
    const navbarRoomTypes: { [key: string]: string } = {
      "living-room": "Living Room",
      bedroom: "Bedroom",
      "dining-room": "Dining Room",
      office: "Office",
      kitchen: "Kitchen",
      entryway: "Entryway",
      outdoor: "Outdoor",
    };

    if (category === "all") {
      return "All Products";
    }

    if (category && navbarRoomTypes[category]) {
      return navbarRoomTypes[category];
    }

    if (currentCategory) {
      return currentCategory.name;
    }

    return category
      ? category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "Products";
  };

  const getSubcategoryDisplayName = () => {
    if (subcategory && category) {
      const navbarRoomTypes = [
        "living-room",
        "bedroom",
        "dining-room",
        "office",
        "kitchen",
        "entryway",
        "outdoor",
      ];

      if (navbarRoomTypes.includes(category)) {
        // Convert kebab-case back to display format
        return subcategory
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .replace(/\band\b/gi, "&");
      }
    }

    // Use existing logic for other URLs
    if (category === "all") {
      return "All Products";
    }
    if (category && subcategory && currentSubcategories.length > 0) {
      const foundSubcategory = currentSubcategories.find(
        (s) => s.slug === category || s.id === category
      );
      if (foundSubcategory && foundSubcategory.subSubcategories) {
        const foundSubSubcategory = foundSubcategory.subSubcategories.find(
          (ss) =>
            ss.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and") ===
              subcategory || ss.id === subcategory
        );
        return foundSubSubcategory ? foundSubSubcategory.name : subcategory;
      }
    } else if (category && currentSubcategories.length > 0) {
      const foundSubcategory = currentSubcategories.find(
        (s) => s.slug === category || s.id === category
      );
      return foundSubcategory ? foundSubcategory.name : category;
    }
    return null;
  };

  // Initialize categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Find current category and fetch its subcategories when category changes
  useEffect(() => {
    const navbarRoomTypes = [
      "living-room",
      "bedroom",
      "dining-room",
      "office",
      "kitchen",
      "entryway",
      "outdoor",
    ];

    // Skip this logic for navbar-generated URLs
    if (category && !navbarRoomTypes.includes(category)) {
      if (categories.length > 0 && category !== "all") {
        const foundCategory = categories.find(
          (c) => c.slug === category || c.id === category
        );
        setCurrentCategory(foundCategory || null);

        if (foundCategory) {
          fetchSubcategoriesForCategory(foundCategory.id);
        }
      } else if (category === "all") {
        setCurrentCategory(null);
        setCurrentSubcategories([]);
      }
    }
  }, [categories, category]);

  // SINGLE useEffect to fetch products when URL params change
  // Improved useEffect for CategoryPage.tsx
  // Replace the existing useEffect with this enhanced version

  // SINGLE useEffect to fetch products when URL params change
  useEffect(() => {
    console.log("=== URL PARAMS DEBUG START ===");
    console.log("Raw category from useParams():", category);
    console.log("Raw subcategory from useParams():", subcategory);

    // List of navbar room types + 'all' + 'new' that should use the new API
    const navbarRoomTypes = [
      "living-room",
      "bedroom",
      "dining-room",
      "office",
      "kitchen",
      "entryway",
      "outdoor",
      "all",
      "new",
    ];
    console.log(
      "Available navbar room types (including 'all' and 'new'):",
      navbarRoomTypes
    );

    // Check if category matches any navbar room type, 'all', or 'new'
    const isNewAPICategory = category && navbarRoomTypes.includes(category);
    console.log("Should use new API?", isNewAPICategory);

    if (isNewAPICategory) {
      console.log(`✅ CONDITION MET: Using NEW API for category: ${category}`);
      console.log(`Subcategory: ${subcategory || "none"}`);
      console.log("About to call fetchProductsFromNewAPI...");

      try {
        // Use new API for navbar-generated URLs + 'all' + 'new'
        fetchProductsFromNewAPI(category, subcategory);
        console.log("✅ Successfully called fetchProductsFromNewAPI");
      } catch (error) {
        console.error("❌ Error calling fetchProductsFromNewAPI:", error);
      }
    } else {
      console.log(`❌ CONDITION NOT MET: Using OLD API logic`);
      console.log("Reason for old API:");
      if (!category) {
        console.log("- No category provided");
      } else if (!navbarRoomTypes.includes(category)) {
        console.log(`- Category "${category}" not in navbar room types`);
      }

      // Use existing logic for other URLs
      if (category && subcategory) {
        console.log(`→ Fetching by sub-subcategory: ${subcategory}`);
        getProductsBySubSubcategory(subcategory);
      } else if (category) {
        console.log(`→ Fetching by subcategory: ${category}`);
        getProductsBySubcategory(category);
      } else {
        console.log("→ No specific category, fetching all products");
        getAllProducts();
      }
    }

    console.log("=== URL PARAMS DEBUG END ===");
  }, [category, subcategory]);

  // Extract available colors from products
  useEffect(() => {
    console.log("=== EXTRACTING AVAILABLE COLORS ===");
    console.log("All products count:", allProducts.length);

    if (allProducts.length > 0) {
      const colors = new Set<string>();

      allProducts.forEach((product, index) => {
        console.log(`Product ${index + 1} (${product.name}):`, {
          colors: product.colors,
          colorsType: typeof product.colors,
          colorsLength: product.colors?.length,
        });

        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach((colorObj, colorIndex) => {
            console.log(`  Color ${colorIndex}:`, colorObj);

            if (colorObj && colorObj.name && colorObj.name.trim()) {
              const cleanColorName = colorObj.name.trim();
              colors.add(cleanColorName);
              console.log(`    Added color: "${cleanColorName}"`);
            } else {
              console.log(`    Skipped invalid color:`, colorObj);
            }
          });
        } else {
          console.log(`  No valid colors array for product ${index + 1}`);
        }
      });

      const uniqueColors = Array.from(colors).sort();
      console.log("Final unique colors:", uniqueColors);
      setAvailableColors(uniqueColors);
    } else {
      console.log("No products available, setting empty colors");
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
        // Parse formatted price string to number for comparison
        const numericPrice =
          typeof p.price === "string"
            ? parseFloat(p.price.replace(/,/g, ""))
            : p.price;
        if (max) {
          return numericPrice  >= min && numericPrice  <= max;
        } else {
          return numericPrice  >= min;
        }
      });
    }

    // Apply color filter (case-insensitive matching)
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
    if (sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
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
            {getSubcategoryDisplayName() || getCategoryDisplayName()}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {category === "all"
              ? "Explore our complete collection of exceptional furniture and home decor pieces from all room types and categories."
              : `Discover our curated collection of exceptional ${(
                  getSubcategoryDisplayName() || getCategoryDisplayName()
                ).toLowerCase()} pieces, each handpicked for its outstanding design and quality craftsmanship.`}
          </p>
        </motion.div>

        {/* Subcategories - Only show for non-navbar URLs */}
        {currentSubcategories.length > 0 &&
          !subcategory &&
          category !== "all" &&
          ![
            "living-room",
            "bedroom",
            "dining-room",
            "office",
            "kitchen",
            "entryway",
            "outdoor",
          ].includes(category || "") && (
            <div className="flex flex-wrap gap-4 mb-8">
              {currentSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/furniture/${sub.slug}`}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    category === sub.slug || category === sub.id
                      ? "bg-primary-500 text-white border-primary-500"
                      : "border-gray-300 hover:border-primary-500"
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

        {/* Search Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name or brand..."
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
                  <option value="featured">Featured</option>
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
                  {/* Always show available colors if any exist, otherwise show default colors */}
                  {(() => {
                    // Use available colors if we have any, otherwise use defaults
                    const colorsToShow =
                      availableColors.length > 0
                        ? availableColors
                        : ["White", "Black", "Gray", "Brown", "Blue", "Green"];

                    console.log("Colors to show:", colorsToShow);

                    return colorsToShow.map((color) => (
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
                    ));
                  })()}
                </div>
                {selectedColors.length > 0 && (
                  <button
                    onClick={() => setSelectedColors([])}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear ({selectedColors.length})
                  </button>
                )}
                {/* Debug info - remove this after testing */}
                <div className="text-xs text-gray-500">
                  Available: {availableColors.length} colors
                </div>
              </div>
            </div>

            {/* Reset Filters Button */}
            {(sortBy !== "featured" ||
              priceRange !== "all" ||
              selectedColors.length > 0 ||
              searchQuery.trim()) && (
              <button
                onClick={() => {
                  setSortBy("featured");
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
                  <ProductCard
                    product={product}
                    showAddToCart={true}
                    showWishlist={true}
                  />
                </motion.div>
              ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-600">
              Please try adjusting your filters or check back later for new
              arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
