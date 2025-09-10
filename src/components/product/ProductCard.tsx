import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import AddToCartButton from "../cart/AddToCartButton";
import { Product } from "../../types";
import { useWishlist } from "../../contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = false,
  showWishlist = true,
  className = "",
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const parsePrice = (value: any): number => {
  if (!value) return 0;
  
  // Handle string prices (production)
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  // Handle numeric prices (local)
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  
  return 0;
};

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  const selectedColor =
    product.colors?.[selectedColorIndex] || product.colors?.[0];

  // Updated discount calculation logic
  const currentPrice = parsePrice(product.price); 
  const retailPrice = parsePrice(product.retail_price);
  const vatPercent = parsePrice(product.vat_percent);
  const discountPercent = parsePrice(product.discount);

  // Calculate original price: retail_price + VAT
  const originalPrice =
    retailPrice > 0
      ? retailPrice * (1 + (vatPercent as number) / 100)
      : currentPrice;

  // Simple check: show discount if discount field is positive
  const hasDiscount = discountPercent > 0;
  const discountPercentage = product.discount;

  console.log("Product discount: ", product.discount);
  console.log("Product vat_percent: ", product.vat_percent);
  console.log("Product retail_price: ", product.retail_price);
  // Get the primary image for display
  const primaryImage = product.front_png || product.images?.[0] || "";

  const handleWishlistToggle = async () => {
    setIsWishlistAnimating(true);

    try {
      const productId = product.id;
      const inWishlist = isInWishlist(productId, "product");

      if (inWishlist) {
        const wishlistItem = useWishlist().wishlist.items.find(
          (item) => item.productId === productId && item.type === "product"
        );
        if (wishlistItem) {
          removeFromWishlist(wishlistItem.id);
        }
      } else {
        addToWishlist({
          type: "product",
          productId: product.id,
          name: product.name,
          designer: product.designer,
          price: product.price,
          originalPrice: originalPrice, 
          image: primaryImage,
          selectedColor: selectedColor,
          category: product.category,
          subcategory: product.subcategory,
          description: product.description,
          inStock: product.inStock,
          rating: product.rating,
          reviews: product.reviews,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setTimeout(() => setIsWishlistAnimating(false), 300);
    }
  };

  const inWishlist = isInWishlist(product.id, "product");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlistToggle();
            }}
            disabled={isWishlistAnimating}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors disabled:opacity-50"
          >
            {isWishlistAnimating ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart
                size={16}
                className={`transition-colors ${
                  inWishlist
                    ? "text-red-500 fill-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        {/* Product Info */}
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors truncate">
              {product.name.length > 30
                ? `${product.name.substring(0, 30)}...`
                : product.name}
            </h3>
          </Link>
          {/* Brand and Colors Row */}
          <div className="flex items-center justify-between mt-3">
            {/* Colors - Left Side */}
            <div className="flex items-center gap-2">
              {product.colors && product.colors.length > 0 && (
                <>
                  <span className="text-xs text-gray-600">Color:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedColorIndex(index);
                        }}
                        className={`w-3 h-3 rounded-full border transition-all ${
                          selectedColorIndex === index
                            ? "border-gray-800 ring-1 ring-gray-800 ring-offset-1"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{product.colors.length - 3}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Brand - Right Side */}
            <p className="text-sm text-gray-600">{product.designer}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Colors */}
        {/* {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Color:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColorIndex(index);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColorIndex === index
                      ? "border-gray-800 ring-2 ring-gray-800 ring-offset-1"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        )} */}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <img src="/ed.png" className="w-[1em] h-[1em]" alt="" />
                {formatPrice(currentPrice)}

              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through flex items-center gap-1">
                  <img src="/ed.png" className="w-[1em] h-[1em]" alt="" />
                  {formatPrice(originalPrice)}

                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">Price incl. VAT</p>
          </div>
        </div>

        {/* Stock Status */}
        {/* {product.stockQuantity <= 5 && product.inStock && (
          <p className="text-xs text-orange-600 font-medium">
            Only {product.stockQuantity} left in stock!
          </p>
        )} */}

        {/* Add to Cart Button - Always Visible */}
        {showAddToCart && (
          <div className="pt-2 mt-auto">
            <AddToCartButton
              product={product}
              selectedColor={selectedColor}
              quantity={1}
              variant="primary"
              size="sm"
              className="w-full"
              showQuantityControls={true}
              disabled={!product.inStock}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
