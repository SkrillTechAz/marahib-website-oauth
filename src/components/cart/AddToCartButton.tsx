import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Product, Color } from '../../types';
import WishlistButton from './WishlistButton';

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: Color;
  quantity?: number;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showWishlist?: boolean;
  onAddToCart?: () => void;
  disabled?: boolean;
  showQuantityControls?: boolean; // New prop to show/hide quantity controls
  onQuantityChange?: (quantity: number) => void; // Callback for quantity changes
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  selectedColor,
  quantity = 1,
  variant = 'primary',
  size = 'md',
  className = '',
  showWishlist = false,
  onAddToCart,
  disabled = false,
  showQuantityControls = false,
  onQuantityChange
}) => {
  const { addToCart, updateQuantity, removeFromCart, cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [tempAddedState, setTempAddedState] = useState(false);

  // Find if this product is already in cart
  const cartItem = cart.items.find(item => 
    item.type === 'product' && 
    item.productId === product.id &&
    item.selectedColor?.name === (selectedColor || product.colors[0])?.name
  );

  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      if (isInCart && cartItem) {
        // Update quantity if already in cart
        updateQuantity(cartItem.id, cartQuantity + quantity);
      } else {
        // Add new item to cart
        addToCart({
          type: 'product',
          productId: product.id,
          name: product.name,
          designer: product.designer,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          quantity,
          selectedColor: selectedColor || product.colors[0]
        });
      }

      setTempAddedState(true);
      onAddToCart?.();

      // Reset temp state after 2 seconds
      setTimeout(() => {
        setTempAddedState(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    if (!cartItem) return;
    
    if (newQuantity <= 0) {
      removeFromCart(cartItem.id);
    } else {
      updateQuantity(cartItem.id, newQuantity);
    }
    
    onQuantityChange?.(newQuantity);
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-900',
    secondary: 'bg-white text-black border border-black hover:bg-gray-50',
    icon: 'p-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-full'
  };

  // Icon variant with quantity controls
  if (variant === 'icon') {
    return (
      <div className="flex items-center gap-2">
        {isInCart ? (
          // Show quantity controls when in cart
          <div className="flex items-center border border-gray-300 rounded-full bg-white">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityUpdate(cartQuantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Minus size={14} />
            </motion.button>
            
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {cartQuantity}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityUpdate(cartQuantity + 1)}
              disabled={cartQuantity >= (product.stockQuantity || 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50"
            >
              <Plus size={14} />
            </motion.button>
          </div>
        ) : (
          // Regular add to cart button (only when not in cart)
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding || disabled}
            className={`${variantClasses.icon} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </motion.button>
        )}
        
        {showWishlist && (
          <WishlistButton
            item={{
              id: product.id,
              type: 'product',
              productId: product.id,
              name: product.name,
              designer: product.designer,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.images[0],
              selectedColor: selectedColor || product.colors[0],
              category: product.category,
              subcategory: product.subcategory,
              description: product.description,
              inStock: product.inStock,
              rating: product.rating,
              reviews: product.reviews
            }}
            variant="icon"
            size="md"
          />
        )}
      </div>
    );
  }

  // Regular button variants
  return (
    <div className={showWishlist ? "flex items-center gap-3" : ""}>
      <div className={`flex items-center ${showWishlist ? 'flex-1' : ''} ${isInCart ? 'justify-center' : ''}`}>
        {isInCart ? (
          // Only show quantity controls when in cart (no button)
          <div className="flex items-center border border-gray-300 rounded-md bg-white">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityUpdate(cartQuantity - 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-md"
            >
              <Minus size={16} />
            </motion.button>
            
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center border-x border-gray-300">
              {cartQuantity}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleQuantityUpdate(cartQuantity + 1)}
              disabled={cartQuantity >= (product.stockQuantity || 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-md disabled:opacity-50"
            >
              <Plus size={16} />
            </motion.button>
          </div>
        ) : (
          // Show add to cart button only when not in cart
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isAdding || disabled}
            className={`
              ${variantClasses[variant]} 
              ${sizeClasses[size]} 
              font-medium transition-all duration-300 uppercase tracking-wide 
              flex items-center justify-center
              disabled:opacity-50 disabled:cursor-not-allowed
              ${showWishlist ? 'flex-1' : 'w-full'}
              ${className}
            `}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : tempAddedState ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Cart
              </>
            ) : disabled ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </motion.button>
        )}
      </div>

      {showWishlist && (
        <WishlistButton
          item={{
            id: product.id,
            type: 'product',
            productId: product.id,
            name: product.name,
            designer: product.designer,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            selectedColor: selectedColor || product.colors[0],
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
            inStock: product.inStock,
            rating: product.rating,
            reviews: product.reviews
          }}
          variant="button"
          size={size}
          showText={true}
        />
      )}
    </div>
  );
};

export default AddToCartButton;