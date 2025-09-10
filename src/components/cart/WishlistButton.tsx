import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';

interface WishlistButtonProps {
  item: {
    id: string;
    type: 'product' | 'room-style' | 'designer-collection' | 'design-look';
    productId?: string;
    roomStyleId?: string;
    designerCollectionId?: string;
    lookId?: string;
    name: string;
    designer: string;
    price: number;
    originalPrice?: number;
    image: string;
    selectedColor?: {
      name: string;
      hex: string;
    };
    category?: string;
    subcategory?: string;
    style?: string;
    roomType?: string;
    description?: string;
    inStock?: boolean;
    rating?: number;
    reviews?: number;
    source?: 'designer' | 'site';
    sourceDesignerId?: string;
  };
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  item,
  variant = 'icon',
  size = 'md',
  className = '',
  showText = false,
  onToggle
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine the ID to check based on item type
  const getItemId = () => {
    switch (item.type) {
      case 'product':
        return item.productId || item.id;
      case 'room-style':
        return item.roomStyleId || item.id;
      case 'designer-collection':
        return item.designerCollectionId || item.id;
      case 'design-look':
        return item.lookId || item.id;
      default:
        return item.id;
    }
  };

  const itemId = getItemId();
  const inWishlist = isInWishlist(itemId, item.type);

  const handleToggleWishlist = async () => {
    setIsAnimating(true);

    try {
      if (inWishlist) {
        // Find the wishlist item and remove it
        const wishlistItem = useWishlist().wishlist.items.find(wItem => {
          switch (item.type) {
            case 'product':
              return wItem.productId === itemId;
            case 'room-style':
              return wItem.roomStyleId === itemId;
            case 'designer-collection':
              return wItem.designerCollectionId === itemId;
            case 'design-look':
              return wItem.lookId === itemId;
            default:
              return false;
          }
        });
        
        if (wishlistItem) {
          removeFromWishlist(wishlistItem.id);
        }
      } else {
        // Add to wishlist
        const wishlistItem = {
          type: item.type,
          ...(item.type === 'product' && { productId: itemId }),
          ...(item.type === 'room-style' && { roomStyleId: itemId }),
          ...(item.type === 'designer-collection' && { designerCollectionId: itemId }),
          ...(item.type === 'design-look' && { lookId: itemId }),
          name: item.name,
          designer: item.designer,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          selectedColor: item.selectedColor,
          category: item.category,
          subcategory: item.subcategory,
          style: item.style,
          roomType: item.roomType,
          description: item.description,
          inStock: item.inStock,
          rating: item.rating,
          reviews: item.reviews,
          source: item.source,
          sourceDesignerId: item.sourceDesignerId
        };

        addToWishlist(wishlistItem);
      }

      onToggle?.(!inWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const sizeClasses = {
    sm: variant === 'icon' ? 'w-8 h-8' : 'px-3 py-2 text-sm',
    md: variant === 'icon' ? 'w-10 h-10' : 'px-4 py-2 text-sm',
    lg: variant === 'icon' ? 'w-12 h-12' : 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleWishlist}
        disabled={isAnimating}
        className={`
          ${sizeClasses[size]}
          bg-white border border-gray-300 hover:bg-gray-50 rounded-full 
          flex items-center justify-center transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${inWishlist ? 'border-red-300 bg-red-50' : ''}
          ${className}
        `}
      >
        {isAnimating ? (
          <div className={`${iconSizes[size]} border-2 border-gray-400 border-t-transparent rounded-full animate-spin`} />
        ) : (
          <Heart 
            className={`${iconSizes[size]} transition-colors duration-200 ${
              inWishlist ? 'text-red-500 fill-current' : 'text-gray-600'
            }`} 
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleToggleWishlist}
      disabled={isAnimating}
      className={`
        ${sizeClasses[size]}
        ${inWishlist 
          ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }
        border font-medium transition-all duration-300 
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isAnimating ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Heart 
            className={`${iconSizes[size]} mr-2 transition-colors duration-200 ${
              inWishlist ? 'fill-current' : ''
            }`} 
          />
          {showText && (
            <span>
              {inWishlist ? 'Saved' : 'Save'}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
};

export default WishlistButton;