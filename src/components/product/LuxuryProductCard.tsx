import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "../../types";
import AddToCartButton from "../cart/AddToCartButton";

interface LuxuryProductCardProps {
  product: Product;
  index?: number;
  showGradient?: boolean;
  showWishlist?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  variant?: "minimal" | "detailed";
  className?: string;
  useCustomImage?: boolean;
}

const LuxuryProductCard: React.FC<LuxuryProductCardProps> = ({
  product,
  index = 0,
  showGradient = false,
  showWishlist = false,
  showRating = false,
  showAddToCart = false,
  variant = "minimal",
  className = "",
  useCustomImage = false,
}) => {
  // Utiliser l'image Louis Vuitton pour tous les produits si useCustomImage est true
  const productImage = useCustomImage
    ? "/louis-vuitton-blossom-stool-metal-by-tokujin-yoshioka--R96193_PM2_Front view copy copy.png"
    : product.front_png;
  console.log("productImage: ", useCustomImage, productImage, product);
  console.log("product: ", product);

  const formatPrice = (price: number | string): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  // Discount calculation logic (same as ProductCard)
const parsePrice = (price: string | number): number => {
  if (price === null || price === undefined || price === "") return 0;
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const parsed = parseFloat(price.replace(/,/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const currentPrice = parsePrice(product.price);
const retailPrice = parsePrice(product.retail_price || 0);
const vatPercent = parsePrice(product.vat_percent || 5);
const discountPercent = parsePrice(product.discount || 0);

// Calculate original price: retail_price + VAT
const originalPrice = retailPrice > 0 
  ? retailPrice * (1 + vatPercent / 100)
  : currentPrice;

// Simple check: show discount if discount field is positive
const hasDiscount = discountPercent > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative overflow-hidden bg-white ${className}`}
      style={{ minHeight: variant === "minimal" ? "500px" : "500px" }}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image avec fond blanc pur */}
        {/* Image avec fond blanc pur */}
<div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center">
  <div className="absolute inset-0 bg-gradient-to-b from-gray-200/90 to-white/80 pointer-events-none z-0" />
  <img
    src={productImage}
    alt={product.name}
    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 relative z-10"
    style={{ padding: "10%" }}
  />

  {/* Discount Badge */}
  {hasDiscount && (
    <div className="absolute top-4 left-4 z-20">
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
        -{discountPercent}%
      </span>
    </div>
  )}

  {/* Bouton wishlist optionnel */}
  {showWishlist && (
    <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-20">
      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
    </button>
  )}
</div>

        {/* Informations produit - typographie raffinée */}
        <div className="bg-white flex flex-col justify-center px-6 py-4">
          {/* Designer */}
          <p
            className="text-[#6e6e6e] text-sm font-light tracking-wide uppercase"
            style={{ letterSpacing: "0.05em" }}
          >
            {product.brand}
          </p>

          {/* Nom du produit */}
          <h3
            className="text-[#1d1d1d] font-light leading-tight tracking-wide text-lg mt-1 mb-2"
            style={{ letterSpacing: "0.025em" }}
          >

            {product.name.length > 25
              ? `${product.name.substring(0, 25)}...`
              : product.name}
          </h3>

          {/* Prix */}
<div className="flex items-baseline gap-3">
  <span className="text-[#1d1d1d] font-light tracking-wide">
    <img src="/ed.png" className="w-[20px] inline-block" alt="" />{" "}
    {formatPrice(currentPrice)}
  </span>
  {hasDiscount && (
    <span className="text-[#6e6e6e] line-through text-sm font-light">
      <img src="/ed.png" className="w-[20px] inline-block" alt="" />{" "}
      {formatPrice(originalPrice)}
    </span>
  )}
</div>

          {/* Note discrète sur la TVA */}
          <p className="text-[#6e6e6e] text-xs font-light tracking-wide mt-1">
            Price incl. VAT
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default LuxuryProductCard;
