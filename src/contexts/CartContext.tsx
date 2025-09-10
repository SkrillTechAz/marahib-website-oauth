import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Types
interface CartItem {
  id: string;
  type: 'product' | 'room-style' | 'designer-collection';
  productId?: string;
  roomStyleId?: string;
  designerCollectionId?: string;
  lookId?: string;
  name: string;
  designer: string;
  price: number | string; // Allow both number and string to handle formatting
  originalPrice?: number | string;
  image: string;
  quantity: number;
  selectedColor?: {
    name: string;
    hex: string;
  };
  
  customizations?: Record<string, any>;
  addedAt: Date;

  source?: 'designer' | 'site' ;
  sourceDesignerId?:  string;
}

interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  itemCount: number;
}

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id' | 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 500; // AED
const SHIPPING_COST = 50; // AED
const CART_STORAGE_KEY = 'marahb_cart';

// Price parsing function (same as in CartDrawer)
function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    return parseFloat(price.replace(/,/g, "")) || 0;
  }
  return 0;
}

function calculateCartTotals(items: CartItem[]): Omit<CartState, 'items'> {
  // Use parsePrice to handle both string and number prices
  const subtotal = items.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
  
  // Prices already include VAT, so no additional tax calculation needed
  const tax = 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = 0; // Can be implemented later for promotions
  const total = subtotal + shipping - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  console.log('Calculating cart totals:', {
    items: items.length,
    subtotal,
    shipping,
    total,
    itemCount,
    priceDebug: items.map(item => ({ name: item.name, price: item.price, parsed: parsePrice(item.price) }))
  });

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
    itemCount
  };
}

function saveCartToStorage(cart: CartState) {
  try {
    // Convert Date objects to strings for JSON storage
    const cartToSave = {
      ...cart,
      items: cart.items.map(item => ({
        ...item,
        addedAt: item.addedAt.toISOString()
      }))
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
    console.log('Cart saved to localStorage:', cartToSave);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

function loadCartFromStorage(): CartState {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      
      // Convert date strings back to Date objects
      const cartWithDates = {
        ...parsedCart,
        items: (parsedCart.items || []).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
      };
      
      // Recalculate totals in case of price changes
      const totals = calculateCartTotals(cartWithDates.items);
      const finalCart = {
        items: cartWithDates.items,
        ...totals
      };
      
      console.log('Cart loaded from localStorage:', finalCart);
      return finalCart;
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  
  return {
    items: [],
    total: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    itemCount: 0
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: CartItem = {
        ...action.payload,
        id: `${action.payload.type}_${action.payload.productId || action.payload.roomStyleId || action.payload.designerCollectionId || action.payload.lookId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date()
      };

      console.log('Adding item to cart:', newItem);

      // // Check if item already exists (same product, color, etc.)
      // const existingItemIndex = state.items.findIndex(item => 
      //   item.type === newItem.type &&
      //   item.productId === newItem.productId &&
      //   item.roomStyleId === newItem.roomStyleId &&
      //   item.designerCollectionId === newItem.designerCollectionId &&
      //   item.lookId === newItem.lookId &&
      //   item.selectedColor?.name === newItem.selectedColor?.name
      // );

      let newItems: CartItem[];
      // if (existingItemIndex >= 0) {
      //   // Update quantity of existing item
      //   newItems = state.items.map((item, index) =>
      //     index === existingItemIndex
      //       ? { ...item, quantity: item.quantity + newItem.quantity }
      //       : item
      //   );
      //   console.log('Updated existing item quantity');
      // } else {
        // Add new item
        newItems = [...state.items, newItem];
        console.log('Added new item to cart');
      // }

      const totals = calculateCartTotals(newItems);
      newState = {
        items: newItems,
        ...totals
      };
      break;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateCartTotals(newItems);
      newState = {
        items: newItems,
        ...totals
      };
      console.log('Removed item from cart:', action.payload);
      break;
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      const totals = calculateCartTotals(newItems);
      newState = {
        items: newItems,
        ...totals
      };
      console.log('Updated item quantity:', action.payload);
      break;
    }

    case 'CLEAR_CART': {
      newState = {
        items: [],
        total: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        itemCount: 0
      };
      console.log('Cleared cart');
      break;
    }

    case 'LOAD_CART': {
      newState = action.payload;
      console.log('Loaded cart state:', newState);
      break;
    }

    default:
      return state;
  }

  // Save to localStorage after every state change
  saveCartToStorage(newState);
  return newState;
}

const initialState: CartState = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  itemCount: 0
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('CartProvider mounting, loading cart from localStorage...');
    const savedCart = loadCartFromStorage();
    if (savedCart.items.length > 0) {
      dispatch({
        type: 'LOAD_CART',
        payload: savedCart
      });
    }
  }, []);

  const addToCart = (item: Omit<CartItem, 'id' | 'addedAt'>) => {
    console.log('addToCart called with:', item);
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (itemId: string) => {
    console.log('removeFromCart called with:', itemId);
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    console.log('updateQuantity called with:', itemId, quantity);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    console.log('clearCart called');
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = () => cart.itemCount;

  const getCartTotal = () => cart.total;

  // Debug: Log cart state changes
  useEffect(() => {
    console.log('Cart state updated:', {
      itemCount: cart.itemCount,
      total: cart.total,
      subtotal: cart.subtotal,
      items: cart.items.length
    });
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};