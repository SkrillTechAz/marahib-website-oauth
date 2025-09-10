import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  Package,
  User,
  CheckCircle,
  MessageCircle,
  X,
  Eye,
  Palette,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import BookingModal from "../components/ui/BookingModal";
import AddToCartButton from "../components/cart/AddToCartButton";
import { DesignLook } from "./DesignerRoomStylesPage";

interface Designer {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  commission_rate: number;
  status: string;
  years_experience: number;
  rating: number;
  total_reviews: number;
  created_at: string;
  total_portfolios?: number;
  total_consultations?: number;
  total_earnings?: number;
  total_looks?: number;
  specialties?: string[];
  profile_image_url?: string;
  banner_image_url?: string;
  philosophy?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    linkedin?: string;
  };
  location: string;
}

interface DesignLookImage {
  id: string;
  design_look_id: string;
  image_url: string;
  image_label: string;
  image_order: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  front_png?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  style?: string;
  room_type?: string;
  color?: string;
  materials?: string;
  description?: string;
  stock_quantity: number;
  vendor?: {
    business_name: string;
  };
}

interface ImageSpot {
  id: string;
  x_percentage: number;
  y_percentage: number;
  product_id?: string;
  product?: Product;
  design_look_image_id: string;
}

// Skeleton component for designer info
const DesignerInfoSkeleton = () => (
  <div className="container-custom relative -mt-24 z-10">
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-lg" />
        </div>

        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-1" />
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-1" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Loading component for initial page load
const PageLoader = () => (
  <div className="container-custom py-20 text-center">
    <div className="flex flex-col items-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-600 mb-4" />
      <h2 className="font-serif text-2xl mb-2 text-gray-900">
        Loading Designer...
      </h2>
      <p className="text-gray-600">
        Please wait while we fetch the designer details.
      </p>
    </div>
  </div>
);

// Skeleton Components for Design Looks
const DesignLookSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Left side - Image and Note */}
        <div className="space-y-4">
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"></div>

          {/* Thumbnails skeleton */}
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
          </div>

          {/* Designer Note skeleton */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4/5 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>

        {/* Right side - Details */}
        <div className="space-y-6">
          {/* Title and tags */}
          <div>
            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="flex gap-2 mb-3">
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* What's included */}
          <div>
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="text-right">
                <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesignerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"ready" | "past">("ready");
  const [addedToCart, setAddedToCart] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [designerProjects, setDesignerProjects] = useState<any[]>([]);
  const [designerLooks, setDesignerLooks] = useState<DesignLook[]>([]);
  const [looksLoading, setLooksLoading] = useState(false);
  const [expandedLook, setExpandedLook] = useState<string | null>(null);
  const [lookImages, setLookImages] = useState<{
    [key: string]: DesignLookImage[];
  }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [allLookSpots, setAllLookSpots] = useState<{
    [key: string]: ImageSpot[];
  }>({});
  const [imageSpots, setImageSpots] = useState<{ [key: string]: ImageSpot[] }>(
    {}
  );
  const [hoveredSpotId, setHoveredSpotId] = useState<string>("");
  const [addedLooks, setAddedLooks] = useState<string[]>([]);
  const [loadingLooks, setLoadingLooks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const imageRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    type?: string;
    projectTitle?: string;
  }>({ isOpen: false });

  const { addToCart } = useCart();

  const fetchDesignerLooks = async (designerId: string) => {
    try {
      setLooksLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/website/designers/looks/${designerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch looks");
      const data = await response.json();
      return data.looks || [];
    } catch (error) {
      console.error("Error fetching looks:", error);
      throw error;
    } finally {
      setLooksLoading(false);
    }
  };

  const fetchLookImages = async (lookId: string) => {
    try {
      const response = await fetch(

        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/public/design-looks/${lookId}/images`
      );
      if (response.ok) {
        const images = await response.json();
        return images;
      }
    } catch (error) {
      console.error("Error fetching look images:", error);
    }
    return [];
  };

  const fetchImageSpots = async (
    imageId: string,
    lookId: string
  ): Promise<ImageSpot[]> => {
    try {
      const response = await fetch(

        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/public/design-looks/${lookId}/spots/${imageId}`
      );
      if (response.ok) {
        const spots = await response.json();
        return spots;
      }
    } catch (error) {
      console.error("Error fetching image spots:", error);
    }
    return [];
  };

  const loadLookData = async (lookId: string) => {
    setLoadingLooks((prev) => ({ ...prev, [lookId]: true }));

    try {
      // 1. Fetch images
      const images = await fetchLookImages(lookId);

      // 2. Fetch spots for all images
      const allSpots: ImageSpot[] = [];
      for (const image of images) {
        const spots = await fetchImageSpots(image.id, lookId);
        allSpots.push(...spots);
      }

      // 3. Get unique product IDs
      const productIds = [
        ...new Set(
          allSpots
            .map((spot) => spot.product_id)
            .filter((id) => id !== null && id !== undefined)
        ),
      ];

      // 4. Fetch products if there are any
      let products: Product[] = [];
      if (productIds.length > 0) {
        const response = await fetch(

          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/public/design-looks/products?${new URLSearchParams(
            productIds.map((id) => ["product_ids", id])
          )}`
        );
        if (response.ok) {
          products = await response.json();
        }
      }

      // 5. Map products to spots
      const updatedSpots = allSpots.map((spot) => ({
        ...spot,
        product: products.find((p) => p.id === spot.product_id),
      }));

      // 6. Update all state at once
      setLookImages((prev) => ({ ...prev, [lookId]: images }));
      setAllLookSpots((prev) => ({ ...prev, [lookId]: updatedSpots }));

      if (images.length > 0) {
        setCurrentImageIndex((prev) => ({ ...prev, [lookId]: 0 }));
        const firstImageSpots = updatedSpots.filter(
          (spot) => spot.design_look_image_id === images[0].id
        );
        setImageSpots((prev) => ({
          ...prev,
          [`${lookId}-${images[0].id}`]: firstImageSpots,
        }));
      }
    } catch (error) {
      console.error("Error loading look data:", error);
    } finally {
      setLoadingLooks((prev) => ({ ...prev, [lookId]: false }));
    }
  };
  

  const handleExpandLook = (look: DesignLook) => {
    const isExpanding = expandedLook !== look.id;
    setExpandedLook(isExpanding ? look.id : null);

    if (isExpanding && !lookImages[look.id]) {
      loadLookData(look.id);
    }
  };

  const handleImageNavigation = async (
    lookId: string,
    direction: "prev" | "next"
  ) => {
    const images = lookImages[lookId];
    if (!images || images.length <= 1) return;

    const currentIndex = currentImageIndex[lookId] || 0;
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    }

    setCurrentImageIndex((prev) => ({ ...prev, [lookId]: newIndex }));

    // Set spots for the new image
    const allSpots = allLookSpots[lookId] || [];
    const newImageSpots = allSpots.filter(
      (spot) => spot.design_look_image_id === images[newIndex].id
    );
    setImageSpots((prev) => ({
      ...prev,
      [`${lookId}-${images[newIndex].id}`]: newImageSpots,
    }));
  };

  const handleThumbnailClick = (lookId: string, imageIndex: number) => {
    const images = lookImages[lookId];
    if (!images || imageIndex >= images.length) return;

    setCurrentImageIndex((prev) => ({ ...prev, [lookId]: imageIndex }));

    // Set spots for the selected image
    const allSpots = allLookSpots[lookId] || [];
    const selectedImageSpots = allSpots.filter(
      (spot) => spot.design_look_image_id === images[imageIndex].id
    );
    setImageSpots((prev) => ({
      ...prev,
      [`${lookId}-${images[imageIndex].id}`]: selectedImageSpots,
    }));
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

  const getPopupPosition = (spot: ImageSpot, lookId: string) => {
    const imageRef = imageRefs.current[lookId];
    if (!imageRef) return {};

    const rect = imageRef.getBoundingClientRect();
    const containerRect = imageRef.parentElement?.getBoundingClientRect();

    if (!containerRect) return {};

    const popupWidth = 280;
    const popupHeight = 200;

    const spotX =
      rect.left - containerRect.left + (rect.width * spot.x_percentage) / 100;
    const spotY =
      rect.top - containerRect.top + (rect.height * spot.y_percentage) / 100;

    let left = spotX;
    let top = spotY - popupHeight - 10;

    if (left + popupWidth > containerRect.width) {
      left = Math.max(0, containerRect.width - popupWidth);
    }
    if (left < 0) left = 0;

    if (top < 0) {
      top = spotY + 30;
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
    };
  };

  const getUniqueProducts = (lookId: string) => {
    const allSpots = allLookSpots[lookId] || [];
    const productMap = new Map<string, { product: Product; count: number }>();

    allSpots.forEach((spot) => {
      if (spot.product_id && spot.product) {
        const existing = productMap.get(spot.product_id);
        if (existing) {
          existing.count += 1;
        } else {
          productMap.set(spot.product_id, { product: spot.product, count: 1 });
        }
      }
    });

    return Array.from(productMap.values());
  };

  const parsePrice = (price: string | number): number => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      return parseFloat(price.replace(/,/g, "")) || 0;
    }
    return 0;
  };

  // Update your calculateTotalPrice function:

  const calculateTotalPrice = (lookId: string) => {
    const uniqueProducts = getUniqueProducts(lookId);
    if (!uniqueProducts || uniqueProducts.length === 0) return 0;
    return uniqueProducts.reduce((sum, { product, count }) => {
      if (!product || !product.price) return sum;
      // Parse the formatted price string to number for calculation
      const numericPrice = parsePrice(product.price);
      return sum + numericPrice * count;
    }, 0);
  };

  const mapApiProductToCartProduct = (
    apiProduct: Product,
    designer: string
  ) => {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      designer: designer,
      price: apiProduct.price,
      currency: "AED",
      images: [apiProduct.front_png || apiProduct.image_url || ""].filter(
        Boolean
      ),
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
    console.log("look: ", look);

    uniqueProducts.forEach(({ product, count }) => {
      addToCart({
        source: "designer",
        sourceDesignerId: look.designer_id,

        type: "product",
        productId: product.id,
        name: product.name,
        designer: designer?.display_name || "",
        price: product.price,
        image: product.front_png || product.image_url || "",
        quantity: count,
        selectedColor: product.color
          ? { name: product.color, hex: "#000000" }
          : { name: "Default", hex: "#000000" },
      });
    });

    setAddedLooks((prev) => [...prev, look.id]);
  };

  const handleRequestConsultation = () => {
    setBookingModal({
      isOpen: true,
      type: "consultation",
    });
  };

  const handleAddCompleteDesign = (
    projectId: string,
    projectTitle: string,
    price: number
  ) => {
    addToCart({
      type: "designer-collection",
      designerCollectionId: projectId,
      name: projectTitle,
      designer: designer?.display_name || "",
      price: price,
      image: designerProjects.find((p) => p.id === projectId)?.image || "",
      quantity: 1,
    });

    setAddedToCart((prev) => [...prev, projectId]);
  };

  const handleRequestSimilarDesign = (
    projectId: string,
    projectTitle: string
  ) => {
    setBookingModal({
      isOpen: true,
      type: "similar-design",
      projectTitle,
    });
  };

  const getSelectedProjectDetails = () => {
    if (!selectedProject) return null;
    return designerProjects.find((p) => p.id === selectedProject);
  };

  const getProjectFurniture = (project: any) => {
    // Placeholder function - return empty array for now
    return [];
  };

  useEffect(() => {
    const fetchDesigner = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/website/designers/${id}`
        );
        if (!response.ok) throw new Error("Designer not found");
        const data = await response.json();
        setDesigner(data);
        console.log("Fetched designer:", data);

        // Fetch looks data
        const looks = await fetchDesignerLooks(data.id);
        setDesignerLooks(looks);

        // Load data for all looks immediately
        looks.forEach((look: DesignLook) => {
          loadLookData(look.id);
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch designer"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDesigner();
    }
  }, [id]);

  // Show page loader while initially loading
  if (loading) {
    return (
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container-custom py-6">
            <Link
              to="/designers"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to All Designers
            </Link>
          </div>
        </div>

        {/* Hero Section with skeleton */}
        <div className="relative">
          <div className="h-[300px] bg-gray-200 animate-pulse relative">
            <div className="absolute inset-0 bg-black/40" />
            <PageLoader />
          </div>
        </div>

        {/* Loading content */}
        <DesignerInfoSkeleton />
        <DesignLookSkeleton />
      </div>
    );
  }

  // Show error state
  if (error || !designer) {
    return (
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container-custom py-6">
            <Link
              to="/designers"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to All Designers
            </Link>
          </div>
        </div>

        <div className="container-custom py-20 text-center">
          <h2 className="font-serif text-3xl mb-4">Designer Not Found</h2>
          <p className="mb-8">
            The designer you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/designers" className="btn-primary">
            Back to Designers
          </Link>
        </div>
      </div>
    );
  }

  const designerPastProjects = designerProjects.filter(
    (project) =>
      project.designer === designer?.display_name &&
      project.type === "past-project"
  );

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom py-6">
          <Link
            to="/designers"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Designers
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div
          className="h-[300px] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${designer?.banner_image_url})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Designer Info Section */}
        <div className="container-custom relative -mt-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0">
                <img
                  src={designer.profile_image_url}
                  alt={designer.display_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div>
                    <h1 className="font-serif text-3xl text-gray-900 mb-2">
                      {designer.display_name}
                    </h1>
                    <p className="text-gray-600 mb-4">{designer.bio}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {designer.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Est. {designer.years_experience}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-16">
        <div className="gap-12">
          {/* Main Content */}
          <div className="space-y-2">
            {/* Philosophy */}
            {designer?.philosophy && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-stone-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Design Philosophy
                  </h3>
                  <p className="text-gray-700 italic">
                    "{designer.philosophy}"
                  </p>
                </div>
              </motion.section>
            )}

            {/* Projects Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl text-gray-900">Portfolio</h2>

                {/* Tab Navigation */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("ready")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "ready"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Design Looks
                  </button>
                  {/* <button
                    onClick={() => setActiveTab("past")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "past"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Past Projects
                  </button> */}
                </div>
              </div>

              {/* Design Looks */}
              {activeTab === "ready" && (
                <div className="space-y-8">
                  {looksLoading ? (
                    <div className="space-y-8">
                      {[...Array(3)].map((_, i) => (
                        <DesignLookSkeleton key={i} />
                      ))}
                    </div>
                  ) : designerLooks.length > 0 ? (
                    <>
                      {designerLooks
                        .filter(
                          (look) =>
                            look.is_active == true && look.status == "approved"
                        )
                        .map((look, index) => {
                          const images = lookImages[look.id] || [];
                          const currentIndex = currentImageIndex[look.id] || 0;
                          const currentImage = images[currentIndex];
                          const spots =
                            imageSpots[`${look.id}-${currentImage?.id}`] || [];
                          const uniqueProducts = getUniqueProducts(look.id);
                          const totalPrice = calculateTotalPrice(look.id);

                          return (
                            <motion.div
                              key={look.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                                {/* Look Image + Designer Note */}
                                <div className="space-y-4">
                                  {/* Image */}
                                  <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
                                    <div className="relative w-full h-full">
                                      <img
                                        ref={(el) =>
                                          (imageRefs.current[look.id] = el)
                                        }
                                        src={
                                          currentImage?.image_url ||
                                          look.mood_board_url
                                        }
                                        alt={
                                          currentImage?.image_label ||
                                          look.title
                                        }
                                        className="w-full h-full object-cover"
                                      />

                                      {/* Navigation */}
                                      {images.length > 1 && (
                                        <>
                                          <button
                                            onClick={() =>
                                              handleImageNavigation(
                                                look.id,
                                                "prev"
                                              )
                                            }
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                                          >
                                            <ChevronLeft className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleImageNavigation(
                                                look.id,
                                                "next"
                                              )
                                            }
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                                          >
                                            <ChevronRight className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}

                                      {/* Product Spots */}
                                      {spots.map((spot, spotIndex) => {
                                        const hasProduct = !!spot.product_id;
                                        const isHovered =
                                          hoveredSpotId === spot.id;

                                        return (
                                          <div key={spot.id}>
                                            <div
                                              className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
                                                hasProduct
                                                  ? "bg-black border-black hover:bg-gray-800"
                                                  : "bg-gray-400 border-gray-400 hover:bg-gray-500"
                                              }`}
                                              style={getImagePosition(
                                                spot,
                                                look.id
                                              )}
                                              onMouseEnter={() =>
                                                setHoveredSpotId(spot.id)
                                              }
                                              onMouseLeave={() =>
                                                setHoveredSpotId("")
                                              }
                                            >
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <Plus className="h-3 w-3 text-white" />
                                              </div>
                                            </div>

                                            {spot.product && isHovered && (
                                              <div
                                                className="absolute z-20 pointer-events-auto"
                                                style={getPopupPosition(
                                                  spot,
                                                  look.id
                                                )}
                                                onMouseEnter={() =>
                                                  setHoveredSpotId(spot.id)
                                                }
                                                onMouseLeave={() =>
                                                  setHoveredSpotId("")
                                                }
                                              >
                                                <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                                                <div className="bg-white rounded-lg shadow-xl p-4 w-70 border border-gray-100">
                                                  <div className="flex items-start space-x-3 mb-3">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                      <img
                                                        src={
                                                          spot.product
                                                            .front_png ||
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
                                                          className="w-[20px] inline-block"
                                                          alt=""
                                                        />{" "}
                                                        {formatPrice(
                                                          parsePrice(
                                                            spot.product.price
                                                          )
                                                        )}

                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="text-xs text-gray-500 space-y-1">
                                                    <div className="flex justify-between">
                                                      <span className="font-medium">
                                                        Category:
                                                      </span>
                                                      <span>
                                                        {spot.product.category}
                                                      </span>
                                                    </div>
                                                    {spot.product.style && (
                                                      <div className="flex justify-between">
                                                        <span className="font-medium">
                                                          Style:
                                                        </span>
                                                        <span>
                                                          {spot.product.style}
                                                        </span>
                                                      </div>
                                                    )}
                                                    {spot.product.color && (
                                                      <div className="flex justify-between">
                                                        <span className="font-medium">
                                                          Color:
                                                        </span>
                                                        <span>
                                                          {spot.product.color}
                                                        </span>
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

                                  {/* Thumbnails */}
                                  {images.length > 1 && (
                                    <div className="flex space-x-2 overflow-x-auto">
                                      {images.map((image, imageIndex) => (
                                        <button
                                          key={image.id}
                                          onClick={() =>
                                            handleThumbnailClick(
                                              look.id,
                                              imageIndex
                                            )
                                          }
                                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                                            currentIndex === imageIndex
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

                                  {/* Designer Note */}
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
                                      — {designer?.display_name}
                                    </p>
                                  </div>
                                </div>

                                {/* Look Details */}
                                <div className="space-y-6">
                                  <div>
                                    <h3 className="font-serif text-2xl text-gray-900 mb-2">
                                      {look.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mb-3">
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

                                  {/* Included */}
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-3">
                                      What's Included:
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-stone-500 mr-2" />
                                        {uniqueProducts.length} carefully
                                        selected furniture pieces
                                      </div>
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-stone-500 mr-2" />
                                        Professional styling guidance
                                      </div>
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-stone-500 mr-2" />
                                        Complete room transformation
                                      </div>
                                      {images.length > 1 && (
                                        <div className="flex items-center">
                                          <CheckCircle className="w-4 h-4 text-stone-500 mr-2" />
                                          {images.length} different styling
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
                                        {loadingLooks[look.id] ? (
                                          <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                            <span className="text-sm text-gray-500">
                                              Loading...
                                            </span>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="font-bold text-2xl text-gray-900 flex items-center gap-1">
                                              <img
                                                src="/ed.png"
                                                className="w-[22px] inline-block"
                                                alt=""
                                              />{" "}
                                              {formatPrice(totalPrice)}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              Price incl. VAT
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stats & Tags */}
                                  <div className="flex items-center justify-between mb-4">
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
                                        {look.tags.slice(0, 3).map((tag, i) => (
                                          <span
                                            key={i}
                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() =>
                                        handleAddCompleteRoom(look)
                                      }
                                      disabled={
                                        addedLooks.includes(look.id) ||
                                        uniqueProducts.length === 0 ||
                                        loadingLooks[look.id]
                                      }
                                      className={`flex-1 py-3 px-6 font-medium transition-colors text-sm uppercase tracking-wide flex items-center justify-center ${
                                        addedLooks.includes(look.id)
                                          ? "bg-stone-600 text-white cursor-default"
                                          : uniqueProducts.length === 0 ||
                                            loadingLooks[look.id]
                                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                          : "bg-black text-white hover:bg-gray-900"
                                      }`}
                                    >
                                      {loadingLooks[look.id] ? (
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
                                      disabled={loadingLooks[look.id]}
                                      className={`px-6 py-3 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium ${
                                        loadingLooks[look.id]
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      {loadingLooks[look.id]
                                        ? "Loading..."
                                        : expandedLook === look.id
                                        ? "Hide Items"
                                        : "View Items"}
                                    </button>
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
                                  {uniqueProducts.length === 0 ? (
                                    <div className="text-center py-8">
                                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                      <p className="text-gray-600">
                                        No products available for this look.
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {uniqueProducts.map(
                                        ({ product, count }) => (
                                          <div
                                            key={product.id}
                                            className="bg-gray-50 rounded-lg overflow-hidden"
                                          >
                                            <div className="aspect-square overflow-hidden">
                                              <img
                                                src={
                                                  product.front_png ||
                                                  product.image_url
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                            <div className="p-4">
                                              <div className="flex items-center mb-2">
                                                <div className="flex items-center">
                                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                  <span className="font-medium ml-1 text-sm">
                                                    4.5
                                                  </span>
                                                </div>
                                                <span className="text-gray-500 text-sm ml-2">
                                                  (12)
                                                </span>
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
                                                    {formatPrice(
                                                      parsePrice(product.price)
                                                    )}
                                                    {count > 1 && (
                                                      <span className="text-sm text-gray-500 ml-1">
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
                                                        parsePrice(
                                                          product.price
                                                        ) * count
                                                      )}
                                                    </p>
                                                  )}
                                                  <p className="text-xs text-gray-500">
                                                    Price incl. VAT
                                                  </p>
                                                </div>
                                                {product.stock_quantity <= 5 &&
                                                  product.stock_quantity >
                                                    0 && (
                                                    <span className="text-xs text-orange-600 font-medium">
                                                      Only{" "}
                                                      {product.stock_quantity}{" "}
                                                      left
                                                    </span>
                                                  )}
                                              </div>

                                              <AddToCartButton
                                                product={mapApiProductToCartProduct(
                                                  product,
                                                  look.designer?.display_name
                                                )}
                                                selectedColor={
                                                  product.color
                                                    ? {
                                                        name: product.color,
                                                        hex: "#000000",
                                                      }
                                                    : {
                                                        name: "Default",
                                                        hex: "#000000",
                                                      }
                                                }
                                                quantity={count}
                                                variant="secondary"
                                                size="sm"
                                                className="w-full"
                                                showQuantityControls={true}
                                                disabled={
                                                  product.stock_quantity === 0
                                                }
                                              />
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}

                      {/* Request Consultation Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-black text-white p-8 rounded-lg"
                      >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <h3 className="font-serif text-white text-2xl mb-3">
                              Need a Custom Design?
                            </h3>
                            <p className="text-gray-300">
                              {designer.display_name} accepts select custom
                              furniture commissions. Schedule a consultation to
                              discuss your project.
                            </p>
                          </div>
                          <button
                            onClick={handleRequestConsultation}
                            className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
                          >
                            Request Consultation
                          </button>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Design Looks Available
                      </h3>
                      <p className="text-gray-600">
                        This designer hasn't published any looks yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Past Projects */}
              {activeTab === "past" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {designerPastProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-serif text-lg text-gray-900 mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {project.description}
                          </p>

                          <div className="space-y-1 text-sm text-gray-600">
                            {project.client && (
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                <span>{project.client}</span>
                              </div>
                            )}
                            {project.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{project.location}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{project.year}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleRequestSimilarDesign(
                              project.id,
                              project.title
                            )
                          }
                          className="w-full bg-stone-600 text-white py-3 px-4 font-medium hover:bg-stone-700 transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Request Similar
                        </button>
                      </div>
                    </div>
                  ))}

                  {designerPastProjects.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Past Projects Showcased
                      </h3>
                      <p className="text-gray-600">
                        This designer's portfolio is currently being updated.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Specialties */}
            {designer?.specialties && designer.specialties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="font-medium text-gray-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {designer.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stats */}
            {designer && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="font-medium text-gray-900 mb-4">
                  Designer Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years Experience</span>
                    <span className="font-medium">
                      {designer.years_experience}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Projects</span>
                    <span className="font-medium">
                      {designer.total_portfolios || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Design Looks</span>
                    <span className="font-medium">
                      {designer.total_looks || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Furniture List Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const project = getSelectedProjectDetails();
                if (!project) return null;

                const furnitureList = getProjectFurniture(project);

                return (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="font-serif text-xl text-gray-900 mb-1">
                          {project.title}
                        </h2>
                        <p className="text-gray-600 text-sm">What's included</p>
                      </div>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Furniture List */}
                    <div className="space-y-4">
                      {furnitureList.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm mb-1">
                              {item.name}
                            </h4>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                              <img
                                src="/ed.png"
                                className="w-[20px] inline-block"
                                alt=""
                              />{" "}
                              {item.price.toLocaleString()}
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-stone-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          Complete Package:
                        </span>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 flex items-center gap-1">
                            <img
                              src="/ed.png"
                              className="w-[20px] inline-block"
                              alt=""
                            />{" "}
                            {project.price?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            Price incl. VAT
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          handleAddCompleteDesign(
                            project.id,
                            project.title,
                            project.price || 0
                          );
                          setSelectedProject(null);
                        }}
                        disabled={addedToCart.includes(project.id)}
                        className={`w-full py-3 px-4 font-medium transition-all duration-300 text-sm uppercase tracking-wide flex items-center justify-center ${
                          addedToCart.includes(project.id)
                            ? "bg-stone-600 text-white cursor-default"
                            : "bg-black text-white hover:bg-gray-900"
                        }`}
                      >
                        {addedToCart.includes(project.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Added
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      {designer && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
          designerId={designer.id}
          designerName={designer.display_name}
          projectTitle={bookingModal.projectTitle}
          type={bookingModal.type}
        />
      )}
    </div>
  );
};

export default DesignerDetailPage;
