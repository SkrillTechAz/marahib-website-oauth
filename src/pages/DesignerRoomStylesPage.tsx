import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import {
  User,
  Package,
  CheckCircle,
  Heart,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import AddToCartButton from "../components/cart/AddToCartButton";
import { Product } from "../types";
import { useWishlist } from "../contexts/WishlistContext";

// Types
interface Designer {
  id: string;
  display_name: string;
  profile_image_url?: string;
}

export interface DesignLook {
  id: string;
  title: string;
  description?: string;
  style?: string;
  room_type?: string;
  color_palette?: string[];
  product_ids: string[];
  mood_board_url?: string;
  likes_count: number;
  saves_count: number;
  created_at: string;
  tags?: string[];
  designer: Designer;
  designer_id?: string;
  is_active: boolean;
  status: string;
}

interface DesignLookImage {
  id: string;
  design_look_id: string;
  image_url: string;
  image_label: string;
  image_order: number;
}

interface ImageSpot {
  id: string;
  x_percentage: number;
  y_percentage: number;
  product_id?: string;
  product?: Product;
  design_look_image_id: string;
}

interface Filters {
  styles: string[];
  roomTypes: string[];
  designers: Designer[];
}
// Enhanced look data structure
interface LookData {
  images: DesignLookImage[];
  products: Product[];
  allSpots: ImageSpot[];
  currentImageIndex: number;
  isLoading: boolean;
  isLoaded: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DesignerRoomStylesPage: React.FC = () => {
  const [designLooks, setDesignLooks] = useState<DesignLook[]>([]);
  const [filters, setFilters] = useState<Filters>({
    styles: [],
    roomTypes: [],
    designers: [],
  });
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedDesigner, setSelectedDesigner] = useState<string>("all");
  const [expandedLook, setExpandedLook] = useState<string | null>(null);

  // Consolidated look data state
  const [looksData, setLooksData] = useState<{ [key: string]: LookData }>({});

  const [hoveredSpotId, setHoveredSpotId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [addedLooks, setAddedLooks] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [wishlistAnimating, setWishlistAnimating] = useState<string[]>([]);
  const imageRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

  const parsePrice = (price: string | number): number => {
    if (price === null || price === undefined || price === '') {
      console.log('Price is null/undefined/empty:', price);
      return 0;
    }
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const parsed = parseFloat(price.replace(/,/g, ""));
      if (isNaN(parsed)) {
        console.log('Failed to parse price string:', price);
        return 0;
      }
      return parsed;
    }
    console.log('Unexpected price type:', typeof price, price);
    return 0;
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  // Fetch filters on component mount
  useEffect(() => {
    fetchFilters();
  }, []);

  // Fetch design looks when filters change
  useEffect(() => {
    fetchDesignLooks();
  }, [selectedStyle, selectedRoom, selectedDesigner]);

  // Modified: Load data for all looks immediately after they're fetched
  useEffect(() => {
    if (designLooks.length > 0) {
      // Initialize look data state
      const initialLooksData: { [key: string]: LookData } = {};
      designLooks.forEach((look) => {
        if (!looksData[look.id]) {
          initialLooksData[look.id] = {
            images: [],
            products: [],
            allSpots: [],
            currentImageIndex: 0,
            isLoading: false,
            isLoaded: false,
          };
        }
      });

      if (Object.keys(initialLooksData).length > 0) {
        setLooksData((prev) => ({ ...prev, ...initialLooksData }));

        // Load data for ALL looks immediately (instead of just first 3)
        designLooks.forEach((look) => {
          if (!looksData[look.id]?.isLoaded && !looksData[look.id]?.isLoading) {
            loadLookDataOptimized(look.id);
          }
        });
      }
    }
  }, [designLooks]);

  const handleWishlistAllProducts = async (look: DesignLook) => {
    const uniqueProducts = getUniqueProducts(look.id);
    
    if (uniqueProducts.length === 0) {
      console.warn('No products found for this design look');
      return;
    }

    setWishlistAnimating(prev => [...prev, look.id]);

    try {
      // Check if any products are already in wishlist
      const productsInWishlist = uniqueProducts.filter(({ product }) => 
        isInWishlist(product.id, 'product')
      );

      if (productsInWishlist.length === uniqueProducts.length) {
        // All products are in wishlist, remove them all
        uniqueProducts.forEach(({ product }) => {
          const wishlistItem = useWishlist().wishlist.items.find(item => 
            item.productId === product.id && item.type === 'product'
          );
          if (wishlistItem) {
            removeFromWishlist(wishlistItem.id);
          }
        });
      } else {
        // Add products that aren't already in wishlist
        uniqueProducts.forEach(({ product }) => {
          if (!isInWishlist(product.id, 'product')) {
            addToWishlist({
              type: 'product',
              productId: product.id,
              name: product.name,
              designer: look.designer.display_name,
              price: product.price,
              image: product.primary_image || product.image_url || '',
              selectedColor: product.color ? { name: product.color, hex: '#000000' } : { name: 'Default', hex: '#000000' },
              category: product.category,
              subcategory: product.subcategory,
              style: product.style,
              description: product.description,
              inStock: product.stock_quantity > 0,
              source: 'designer',
              sourceDesignerId: look.designer_id
            });
          }
        });
      }
    } catch (error) {
      console.error('Error handling wishlist:', error);
    } finally {
      setTimeout(() => {
        setWishlistAnimating(prev => prev.filter(id => id !== look.id));
      }, 500);
    }
  };

  const areAllProductsWishlisted = (lookId: string) => {
    const uniqueProducts = getUniqueProducts(lookId);
    if (uniqueProducts.length === 0) return false;
    
    return uniqueProducts.every(({ product }) => isInWishlist(product.id, 'product'));
  };

  const fetchFilters = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public/design-looks/filters`
      );
      if (response.ok) {
        const data = await response.json();
        setFilters(data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchDesignLooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStyle !== "all") params.append("style", selectedStyle);
      if (selectedRoom !== "all") params.append("room_type", selectedRoom);
      if (selectedDesigner !== "all")
        params.append("designer_id", selectedDesigner);

      const response = await fetch(
        `${API_BASE_URL}/api/public/design-looks?${params}`
      );
      if (response.ok) {
        const data = await response.json();
        setDesignLooks(data);
      }
    } catch (error) {
      console.error("Error fetching design looks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Optimized data loading function
  const loadLookDataOptimized = useCallback(
    async (lookId: string) => {
      if (looksData[lookId]?.isLoading || looksData[lookId]?.isLoaded) return;

      setLooksData((prev) => ({
        ...prev,
        [lookId]: { ...prev[lookId], isLoading: true },
      }));

      try {
        // Fetch images and spots in parallel
        const [images, allSpots] = await Promise.all([
          fetchLookImages(lookId),
          fetchAllLookSpots(lookId),
        ]);

        // Extract unique product IDs
        const productIds = [
          ...new Set(allSpots.map((spot) => spot.product_id).filter(Boolean)),
        ];

        // Fetch products if there are any
        let products: Product[] = [];
        if (productIds.length > 0) {
          products = await fetchProductsByIds(productIds);

          // Enhance spots with product data
          allSpots.forEach((spot) => {
            if (spot.product_id) {
              spot.product = products.find((p) => p.id === spot.product_id);
            }
          });
        }

        setLooksData((prev) => ({
          ...prev,
          [lookId]: {
            images,
            products,
            allSpots,
            currentImageIndex: 0,
            isLoading: false,
            isLoaded: true,
          },
        }));
      } catch (error) {
        console.error("Error loading look data:", error);
        setLooksData((prev) => ({
          ...prev,
          [lookId]: { ...prev[lookId], isLoading: false },
        }));
      }
    },
    [looksData]
  );

  const fetchLookImages = async (
    lookId: string
  ): Promise<DesignLookImage[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/public/design-looks/${lookId}/images`
    );
    if (response.ok) {
      return response.json();
    }
    return [];
  };

  const fetchAllLookSpots = async (lookId: string): Promise<ImageSpot[]> => {
    // First get images to get their IDs
    const images = await fetchLookImages(lookId);

    // Fetch spots for all images in batches
    const allSpots: ImageSpot[] = [];
    for (const image of images) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/public/design-looks/${lookId}/spots/${image.id}`
        );
        if (response.ok) {
          const spots = await response.json();
          allSpots.push(...spots);
        }
      } catch (error) {
        console.error("Error fetching spots for image:", image.id, error);
      }
    }

    return allSpots;
  };

  const fetchProductsByIds = async (
    productIds: string[]
  ): Promise<Product[]> => {
    console.log("Fetching products for IDs:", productIds);

    const params = new URLSearchParams();
    productIds.forEach((id) => params.append("product_ids", id));

    const response = await fetch(
      `${API_BASE_URL}/api/public/design-looks/products?${params}`
    );
    if (response.ok) {
      const products = await response.json();
      console.log(
        "Products fetched:",
        products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          priceType: typeof p.price,
        }))
      );
      return products;
    }
    console.error("Failed to fetch products");
    return [];
  };

  const handleExpandLook = (look: DesignLook) => {
    const isExpanding = expandedLook !== look.id;
    setExpandedLook(isExpanding ? look.id : null);
  };

  const handleImageNavigation = (
    lookId: string,
    direction: "prev" | "next"
  ) => {
    const lookData = looksData[lookId];
    if (!lookData?.images || lookData.images.length <= 1) return;

    const currentIndex = lookData.currentImageIndex;
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex === 0 ? lookData.images.length - 1 : currentIndex - 1;
    } else {
      newIndex =
        currentIndex === lookData.images.length - 1 ? 0 : currentIndex + 1;
    }

    setLooksData((prev) => ({
      ...prev,
      [lookId]: { ...prev[lookId], currentImageIndex: newIndex },
    }));
  };

  const handleThumbnailClick = (lookId: string, imageIndex: number) => {
    const lookData = looksData[lookId];
    if (!lookData?.images || imageIndex >= lookData.images.length) return;

    setLooksData((prev) => ({
      ...prev,
      [lookId]: { ...prev[lookId], currentImageIndex: imageIndex },
    }));
  };

  // Enhanced popup positioning with proper arrow direction
  const getPopupPositionWithArrow = (spot: ImageSpot, lookId: string) => {
    const imageRef = imageRefs.current[lookId];
    if (!imageRef) return { position: {}, arrowClass: "", arrowStyle: {} };

    const rect = imageRef.getBoundingClientRect();
    const containerRect = imageRef.parentElement?.getBoundingClientRect();

    if (!containerRect) return { position: {}, arrowClass: "", arrowStyle: {} };

    const popupWidth = 280;
    const popupHeight = 200;

    const spotX =
      rect.left - containerRect.left + (rect.width * spot.x_percentage) / 100;
    const spotY =
      rect.top - containerRect.top + (rect.height * spot.y_percentage) / 100;

    // Determine best position for popup
    const spaceAbove = spotY;
    const spaceBelow = containerRect.height - spotY;
    const spaceLeft = spotX;
    const spaceRight = containerRect.width - spotX;

    let position: any = {};
    let arrowClass = "";
    let arrowStyle: any = {};

    // Priority: above > below > right > left
    if (spaceAbove >= popupHeight + 20) {
      // Position above
      position = {
        left: `${Math.max(
          10,
          Math.min(
            spotX - popupWidth / 2,
            containerRect.width - popupWidth - 10
          )
        )}px`,
        top: `${spotY - popupHeight - 15}px`,
      };
      arrowClass = "border-t-white border-l-transparent border-r-transparent";
      arrowStyle = {
        position: "absolute",
        bottom: "-8px",
        left: `${Math.max(
          20,
          Math.min(
            spotX -
              (spotX - popupWidth / 2 < 10
                ? 10
                : Math.min(
                    spotX - popupWidth / 2,
                    containerRect.width - popupWidth - 10
                  )),
            popupWidth - 20
          )
        )}px`,
        transform: "translateX(-50%)",
        borderWidth: "8px 8px 0 8px",
      };
    } else if (spaceBelow >= popupHeight + 20) {
      // Position below
      position = {
        left: `${Math.max(
          10,
          Math.min(
            spotX - popupWidth / 2,
            containerRect.width - popupWidth - 10
          )
        )}px`,
        top: `${spotY + 15}px`,
      };
      arrowClass = "border-b-white border-l-transparent border-r-transparent";
      arrowStyle = {
        position: "absolute",
        top: "-8px",
        left: `${Math.max(
          20,
          Math.min(
            spotX -
              (spotX - popupWidth / 2 < 10
                ? 10
                : Math.min(
                    spotX - popupWidth / 2,
                    containerRect.width - popupWidth - 10
                  )),
            popupWidth - 20
          )
        )}px`,
        transform: "translateX(-50%)",
        borderWidth: "0 8px 8px 8px",
      };
    } else if (spaceRight >= popupWidth + 20) {
      // Position to the right
      position = {
        left: `${spotX + 15}px`,
        top: `${Math.max(
          10,
          Math.min(
            spotY - popupHeight / 2,
            containerRect.height - popupHeight - 10
          )
        )}px`,
      };
      arrowClass = "border-r-white border-t-transparent border-b-transparent";
      arrowStyle = {
        position: "absolute",
        left: "-8px",
        top: `${Math.max(
          20,
          Math.min(
            spotY -
              (spotY - popupHeight / 2 < 10
                ? 10
                : Math.min(
                    spotY - popupHeight / 2,
                    containerRect.height - popupHeight - 10
                  )),
            popupHeight - 20
          )
        )}px`,
        transform: "translateY(-50%)",
        borderWidth: "8px 8px 8px 0",
      };
    } else if (spaceLeft >= popupWidth + 20) {
      // Position to the left
      position = {
        left: `${spotX - popupWidth - 15}px`,
        top: `${Math.max(
          10,
          Math.min(
            spotY - popupHeight / 2,
            containerRect.height - popupHeight - 10
          )
        )}px`,
      };
      arrowClass = "border-l-white border-t-transparent border-b-transparent";
      arrowStyle = {
        position: "absolute",
        right: "-8px",
        top: `${Math.max(
          20,
          Math.min(
            spotY -
              (spotY - popupHeight / 2 < 10
                ? 10
                : Math.min(
                    spotY - popupHeight / 2,
                    containerRect.height - popupHeight - 10
                  )),
            popupHeight - 20
          )
        )}px`,
        transform: "translateY(-50%)",
        borderWidth: "8px 0 8px 8px",
      };
    } else {
      // Fallback: center with no arrow (very constrained space)
      position = {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    return { position, arrowClass, arrowStyle };
  };

  const getImagePosition = (spot: ImageSpot, lookId: string) => {
    const imageRef = imageRefs.current[lookId];
    if (!imageRef) {
      return {
        left: `${spot.x_percentage}%`,
        top: `${spot.y_percentage}%`,
      };
    }

    const rect = imageRef.getBoundingClientRect();
    const containerRect = imageRef.parentElement?.getBoundingClientRect();

    if (!containerRect) {
      return {
        left: `${spot.x_percentage}%`,
        top: `${spot.y_percentage}%`,
      };
    }

    const spotX =
      rect.left - containerRect.left + (rect.width * spot.x_percentage) / 100;
    const spotY =
      rect.top - containerRect.top + (rect.height * spot.y_percentage) / 100;

    return {
      left: `${spotX}px`,
      top: `${spotY}px`,
    };
  };

  const mapApiProductToCartProduct = (
    apiProduct: Product,
    designer: string
  ): any => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      designer: designer,
      price: apiProduct.price,
      currency: "AED",
      images: [
        apiProduct.front_png || apiProduct.image_url || "",
        ...(apiProduct.additional_images || []),
      ].filter(Boolean),
      colors: apiProduct.color
        ? [{ name: apiProduct.color, hex: "#000000" }]
        : [{ name: "Default", hex: "#000000" }],
      category: apiProduct.category,
      subcategory: apiProduct.subcategory,
      rating: 4.5,
      reviews: 12,
      stock: apiProduct.stock_quantity,
      description: apiProduct.description || "",
      inStock: apiProduct.stock_quantity > 0,
      featured: false,
      isNew: false,
    };
  };

  const handleAddCompleteRoom = (look: DesignLook) => {
    const uniqueProducts = getUniqueProducts(look.id);

    if (uniqueProducts.length === 0) {
      console.warn("No products found for this design look");
      return;
    }

    uniqueProducts.forEach(({ product, count }) => {
      const mappedProduct = mapApiProductToCartProduct(
        product,
        look.designer.display_name
      );

      addToCart({
        source: "designer",
        sourceDesignerId: look.designer_id,

        type: 'designer-collection',
        productId: product.id,
        name: product.name,
        designer: look.designer.display_name,
        price: product.price,
        image: product.front_png || product.image_url || "",
        quantity: count,

        selectedColor: product.color ? { name: product.color, hex: '#000000' } : { name: 'Default', hex: '#000000' },
        // Additional metadata to show this came from a designer collection
        collectionName: look.title,
        collectionId: look.id
      });
    });

    setAddedLooks((prev) => [...prev, look.id]);
  };

  const getUniqueProducts = (lookId: string) => {
    const lookData = looksData[lookId];
    if (!lookData?.allSpots) {
      console.log(`No look data or spots for look ${lookId}`);
      return [];
    }

    console.log(`Processing spots for look ${lookId}:`, {
      totalSpots: lookData.allSpots.length,
      spotsWithProductIds: lookData.allSpots.filter((s) => s.product_id).length,
      spotsWithProducts: lookData.allSpots.filter(
        (s) => s.product_id && s.product
      ).length,
    });

    const productMap = new Map<string, { product: Product; count: number }>();

    lookData.allSpots.forEach((spot, index) => {
      if (spot.product_id && spot.product) {
        const existing = productMap.get(spot.product_id);
        if (existing) {
          existing.count += 1;
        } else {
          productMap.set(spot.product_id, { product: spot.product, count: 1 });
        }
      } else {
        console.log(`Spot ${index} missing data:`, {
          spotId: spot.id,
          hasProductId: !!spot.product_id,
          hasProduct: !!spot.product,
          productId: spot.product_id,
        });
      }
    });

    return Array.from(productMap.values());
  };

  const calculateTotalPrice = (lookId: string) => {
    const uniqueProducts = getUniqueProducts(lookId);

    // Debug logging
    console.log(`Calculating total for look ${lookId}:`, {
      uniqueProducts: uniqueProducts.length,
      products: uniqueProducts.map(({ product, count }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        priceType: typeof product.price,
        parsedPrice: parsePrice(product.price),
        count,
        total: parsePrice(product.price) * count,
      })),
    });

    const total = uniqueProducts.reduce(
      (sum, { product, count }) => sum + parsePrice(product.price) * count,
      0
    );

    console.log(`Final total for look ${lookId}: ${total}`);
    return total;
  };

  // Memoized components for better performance
  const getCurrentImageSpots = useMemo(() => {
    return (lookId: string) => {
      const lookData = looksData[lookId];
      if (!lookData?.images || !lookData?.allSpots) return [];

      const currentImage = lookData.images[lookData.currentImageIndex];
      if (!currentImage) return [];

      return lookData.allSpots.filter(
        (spot) => spot.design_look_image_id === currentImage.id
      );
    };
  }, [looksData]);

  // Lazy load data when look comes into view
  const observerRef = useRef<IntersectionObserver>();
  const lookRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lookId = entry.target.getAttribute("data-look-id");
            if (
              lookId &&
              !looksData[lookId]?.isLoaded &&
              !looksData[lookId]?.isLoading
            ) {
              loadLookDataOptimized(lookId);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadLookDataOptimized, looksData]);

  useEffect(() => {
    if (observerRef.current) {
      Object.values(lookRefs.current).forEach((ref) => {
        if (ref) observerRef.current?.observe(ref);
      });
    }

    return () => {
      if (observerRef.current) {
        Object.values(lookRefs.current).forEach((ref) => {
          if (ref) observerRef.current?.unobserve(ref);
        });
      }
    };
  }, [designLooks]);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Designer Room Styles
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Complete room packages curated by our expert interior designers.
            Each collection is thoughtfully designed to create harmonious spaces
            that reflect your personal style.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              Filter Collections
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="all">All Styles</option>
                {filters.styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="all">All Rooms</option>
                {filters.roomTypes.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designer
              </label>
              <select
                value={selectedDesigner}
                onChange={(e) => setSelectedDesigner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="all">All Designers</option>
                {filters.designers.map((designer) => (
                  <option key={designer.id} value={designer.id}>
                    {designer.display_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Design Looks Grid */}
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  <div className="space-y-4">
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-4 bg-gray-200 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {designLooks.map((look, index) => {
              const lookData = looksData[look.id];
              const currentImage =
                lookData?.images?.[lookData.currentImageIndex];
              const spots = getCurrentImageSpots(look.id);
              const uniqueProducts = getUniqueProducts(look.id);
              const totalPrice = calculateTotalPrice(look.id);

              return (
                <motion.div
                  key={look.id}
                  ref={(el) => (lookRefs.current[look.id] = el)}
                  data-look-id={look.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* Look Image */}
                    <div className="space-y-4">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
                        <div className="relative w-full h-full">
                          {lookData?.isLoading ? (
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                                <p className="text-sm text-gray-500">
                                  Loading images...
                                </p>
                              </div>
                            </div>
                          ) : (
                            <img
                              ref={(el) => (imageRefs.current[look.id] = el)}
                              src={
                                currentImage?.image_url || look.mood_board_url
                              }
                              alt={currentImage?.image_label || look.title}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Image Navigation */}
                          {lookData?.images && lookData.images.length > 1 && (
                            <>
                              <button
                                onClick={() =>
                                  handleImageNavigation(look.id, "prev")
                                }
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleImageNavigation(look.id, "next")
                                }
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* MODIFIED: Spots are now always visible (removed expandedLook condition) */}
                          {lookData?.isLoaded &&
                            spots.map((spot, spotIndex) => {
                              const hasProduct = !!spot.product_id;
                              const isHovered = hoveredSpotId === spot.id;
                              const {
                                position: popupPosition,
                                arrowClass,
                                arrowStyle,
                              } = getPopupPositionWithArrow(spot, look.id);

                              return (
                                <div key={spot.id}>
                                  <div
                                    className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
                                      hasProduct
                                        ? "bg-black border-black hover:bg-gray-800"
                                        : "bg-gray-400 border-gray-400 hover:bg-gray-500"
                                    }`}
                                    style={getImagePosition(spot, look.id)}
                                    onMouseEnter={() =>
                                      setHoveredSpotId(spot.id)
                                    }
                                    onMouseLeave={() => setHoveredSpotId("")}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Plus className="h-3 w-3 text-white" />
                                    </div>
                                  </div>

                                  {spot.product && isHovered && (
                                    <div
                                      className="absolute z-20 pointer-events-auto"
                                      style={popupPosition}
                                      onMouseEnter={() =>
                                        setHoveredSpotId(spot.id)
                                      }
                                      onMouseLeave={() => setHoveredSpotId("")}
                                    >
                                      {/* Dynamic Arrow */}
                                      {arrowClass && (
                                        <div
                                          className={`${arrowClass} border-solid`}
                                          style={arrowStyle}
                                        ></div>
                                      )}

                                      <div className="bg-white rounded-lg shadow-xl p-4 w-70 border border-gray-100">
                                        <div className="flex items-start space-x-3 mb-3">
                                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                              src={
                                                spot.product.front_png ||
                                                spot.product.image_url
                                              }
                                              alt={spot.product.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                              {spot.product.name}
                                            </h5>
                                            <p className="text-xs text-gray-500 mb-2">
                                              {spot.product.brand ||
                                                spot.product.vendor
                                                  ?.business_name}
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                              <img
                                                src="/ed.png"
                                                className="w-[18px] inline-block"
                                                alt=""
                                              />{" "}
                                              {formatPrice(
                                                parsePrice(spot.product.price)
                                              )}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="text-xs text-gray-500 space-y-1">
                                          <div className="flex justify-between">
                                            <span className="font-medium">
                                              Category:
                                            </span>
                                            <span>{spot.product.category}</span>
                                          </div>
                                          {spot.product.style && (
                                            <div className="flex justify-between">
                                              <span className="font-medium">
                                                Style:
                                              </span>
                                              <span>{spot.product.style}</span>
                                            </div>
                                          )}
                                          {spot.product.color && (
                                            <div className="flex justify-between">
                                              <span className="font-medium">
                                                Color:
                                              </span>
                                              <span>{spot.product.color}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Thumbnail Images */}
                      {lookData?.images && lookData.images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                          {lookData.images.map((image, imageIndex) => (
                            <button
                              key={image.id}
                              onClick={() =>
                                handleThumbnailClick(look.id, imageIndex)
                              }
                              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                                lookData.currentImageIndex === imageIndex
                                  ? "border-black"
                                  : "border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              <img
                                src={image.image_url}
                                alt={image.image_label}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Designer Info */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Designer's Note
                        </h4>
                        <p className="text-sm text-gray-700 italic">
                          "
                          {look.description ||
                            "A carefully curated design look."}
                          "
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          — {look.designer.display_name}
                        </p>
                      </div>
                    </div>

                    {/* Look Details */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-serif text-2xl text-gray-900 mb-2">
                              {look.title}
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-1" />
                                <span>{look.designer.display_name}</span>
                              </div>
                              {look.style && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {look.style}
                                </span>
                              )}
                              {look.room_type && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {look.room_type}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {look.description ||
                                "A beautifully curated design look."}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">
                            What's Included:
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-stone-500 mr-3 flex-shrink-0" />
                              {lookData?.isLoaded ? (
                                `${uniqueProducts.length} carefully selected furniture pieces`
                              ) : (
                                <span className="bg-gray-200 h-4 w-32 rounded animate-pulse"></span>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-stone-500 mr-3 flex-shrink-0" />
                              Professional styling guidance
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-stone-500 mr-3 flex-shrink-0" />
                              Complete room transformation
                            </div>
                            {lookData?.images && lookData.images.length > 1 && (
                              <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-stone-500 mr-3 flex-shrink-0" />
                                {lookData.images.length} different styling
                                variations
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-stone-50 p-6 rounded-lg mb-6">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              Complete Package Price
                            </span>
                            <div className="text-right">
                              {lookData?.isLoading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                  <span className="text-sm text-gray-500">
                                    Loading...
                                  </span>
                                </div>
                              ) : lookData?.isLoaded ? (
                                <>
                                  <p className="font-bold text-2xl text-gray-900 flex items-center gap-1">
                                    <img
                                      src="/ed.png"
                                      className="w-[24px] inline-block"
                                      alt=""
                                    />{" "}
                                    {formatPrice(parsePrice(totalPrice))}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Price incl. VAT
                                  </p>
                                </>
                              ) : (
                                <div className="space-y-1">
                                  <div className="bg-gray-200 h-6 w-24 rounded animate-pulse"></div>
                                  <div className="bg-gray-200 h-3 w-16 rounded animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{look.likes_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{look.saves_count}</span>
                            </div>
                          </div>
                          {look.tags && look.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {look.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4">
                          <button
                            onClick={() => handleAddCompleteRoom(look)}
                            disabled={
                              addedLooks.includes(look.id) ||
                              !lookData?.isLoaded ||
                              uniqueProducts.length === 0
                            }
                            className={`flex-1 py-3 px-6 font-medium transition-colors text-sm uppercase tracking-wide flex items-center justify-center ${
                              addedLooks.includes(look.id)
                                ? "bg-stone-600 text-white cursor-default"
                                : !lookData?.isLoaded ||
                                  uniqueProducts.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-900"
                            }`}
                          >
                            {!lookData?.isLoaded ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Loading...
                              </>
                            ) : addedLooks.includes(look.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Added to Cart
                              </>
                            ) : (
                              <>
                                <Package className="w-4 h-4 mr-2" />
                                Add Complete Room
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleExpandLook(look)}
                            disabled={lookData?.isLoading}
                            className={`px-6 py-3 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium ${
                              lookData?.isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {lookData?.isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                <span>Loading...</span>
                              </div>
                            ) : expandedLook === look.id ? (
                              "Hide Items"
                            ) : (
                              "View Individual Items"
                            )}
                          </button>
                          
                          {/* Custom Wishlist Button for All Products */}
                          <button
                            onClick={() => handleWishlistAllProducts(look)}
                            disabled={wishlistAnimating.includes(look.id) || !lookData?.isLoaded || uniqueProducts.length === 0}
                            className={`p-3 border-2 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                              areAllProductsWishlisted(look.id)
                                ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            title={areAllProductsWishlisted(look.id) ? 'Remove all products from wishlist' : 'Add all products to wishlist'}
                          >
                            {wishlistAnimating.includes(look.id) ? (
                              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Heart 
                                className={`w-5 h-5 transition-colors duration-200 ${
                                  areAllProductsWishlisted(look.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                                }`} 
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Individual Items */}
                  {expandedLook === look.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 p-8"
                    >
                      <h4 className="font-medium text-gray-900 mb-6">
                        Individual Items in This Collection
                      </h4>
                      {!lookData?.isLoaded ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 rounded-lg overflow-hidden"
                            >
                              <div className="aspect-square bg-gray-200 animate-pulse"></div>
                              <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>
                                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : uniqueProducts.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            No products available for this look.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {uniqueProducts.map(({ product, count }) => (
                            <div
                              key={product.id}
                              className="bg-gray-50 rounded-lg overflow-hidden"
                            >
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={product.front_png || product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex items-center mb-2">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />

                                    <span className="font-medium ml-1 text-sm">0</span>
                                  </div>
                                  <span className="text-gray-500 text-sm ml-2">(0)</span>

                                  {count > 1 && (
                                    <span className="ml-auto text-xs bg-black text-white px-2 py-1 rounded-full">
                                      {count}x
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-500 mb-1">
                                  {product.brand ||
                                    product.vendor?.business_name}
                                </p>
                                <h5 className="font-medium text-base mb-3">
                                  {product.name}
                                </h5>

                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <p className="font-medium text-lg text-black flex items-center gap-1">
                                      <img
                                        src="/ed.png"
                                        className="w-[18px] inline-block"
                                        alt=""
                                      />{" "}
                                      {formatPrice(parsePrice(product.price))}
                                      {count > 1 && (
                                        <span className="text-sm text-gray-500 ml-1 flex items-center gap-1">
                                          each
                                        </span>
                                      )}
                                    </p>
                                    {count > 1 && (
                                      <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        Total:{" "}
                                        <img
                                          src="/ed.png"
                                          className="w-[16px] inline-block"
                                          alt=""
                                        />{" "}
                                        {formatPrice(
                                          parsePrice(product.price) * count
                                        )}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                      Price incl. VAT
                                    </p>
                                  </div>
                                  {product.stock_quantity <= 5 &&
                                    product.stock_quantity > 0 && (
                                      <span className="text-xs text-orange-600 font-medium">
                                        Only {product.stock_quantity} left
                                      </span>
                                    )}
                                </div>

                                <AddToCartButton
                                  product={mapApiProductToCartProduct(
                                    product,
                                    look.designer.display_name
                                  )}
                                  selectedColor={
                                    product.color
                                      ? { name: product.color, hex: "#000000" }
                                      : { name: "Default", hex: "#000000" }
                                  }
                                  quantity={count}
                                  variant="secondary"
                                  showQuantityControls={true}
                                  size="sm"
                                  className="w-full"
                                  disabled={product.stock_quantity === 0}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && designLooks.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No design looks found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more designer collections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerRoomStylesPage;
