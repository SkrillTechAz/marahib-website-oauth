import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Wishlist Types
interface WishlistItem {
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
  addedAt: Date;
  source?: 'designer' | 'site';
  sourceDesignerId?: string;
  description?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

interface WishlistContextType {
  wishlist: WishlistState;
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromWishlist: (itemId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string, type?: string) => boolean;
  getWishlistItemCount: () => number;
  moveToCart?: (itemId: string) => void;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Omit<WishlistItem, 'id' | 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistState };

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'marahb_wishlist';

function saveWishlistToStorage(wishlist: WishlistState) {
  try {
    // Convert Date objects to strings for JSON storage
    const wishlistToSave = {
      ...wishlist,
      items: wishlist.items.map(item => ({
        ...item,
        addedAt: item.addedAt.toISOString()
      }))
    };
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistToSave));
    console.log('Wishlist saved to localStorage:', wishlistToSave);
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
}

function loadWishlistFromStorage(): WishlistState {
  try {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      const parsedWishlist = JSON.parse(savedWishlist);
      
      // Convert date strings back to Date objects
      const wishlistWithDates = {
        ...parsedWishlist,
        items: (parsedWishlist.items || []).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
      };
      
      const finalWishlist = {
        items: wishlistWithDates.items,
        itemCount: wishlistWithDates.items.length
      };
      
      console.log('Wishlist loaded from localStorage:', finalWishlist);
      return finalWishlist;
    }
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
  }
  
  return {
    items: [],
    itemCount: 0
  };
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  let newState: WishlistState;

  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists
      const existingItem = state.items.find(item => {
        if (action.payload.type === 'product') {
          return item.productId === action.payload.productId && 
                 item.selectedColor?.name === action.payload.selectedColor?.name;
        } else if (action.payload.type === 'room-style') {
          return item.roomStyleId === action.payload.roomStyleId;
        } else if (action.payload.type === 'designer-collection') {
          return item.designerCollectionId === action.payload.designerCollectionId;
        } else if (action.payload.type === 'design-look') {
          return item.lookId === action.payload.lookId;
        }
        return false;
      });

      if (existingItem) {
        console.log('Item already in wishlist');
        return state;
      }

      const newItem: WishlistItem = {
        ...action.payload,
        id: `${action.payload.type}_${action.payload.productId || action.payload.roomStyleId || action.payload.designerCollectionId || action.payload.lookId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date()
      };

      console.log('Adding item to wishlist:', newItem);

      newState = {
        items: [...state.items, newItem],
        itemCount: state.itemCount + 1
      };
      break;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      newState = {
        items: newItems,
        itemCount: newItems.length
      };
      console.log('Removed item from wishlist:', action.payload);
      break;
    }

    case 'CLEAR_WISHLIST': {
      newState = {
        items: [],
        itemCount: 0
      };
      console.log('Cleared wishlist');
      break;
    }

    case 'LOAD_WISHLIST': {
      newState = action.payload;
      console.log('Loaded wishlist state:', newState);
      break;
    }

    default:
      return state;
  }

  // Save to localStorage after every state change
  saveWishlistToStorage(newState);
  return newState;
}

const initialState: WishlistState = {
  items: [],
  itemCount: 0
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    console.log('WishlistProvider mounting, loading wishlist from localStorage...');
    const savedWishlist = loadWishlistFromStorage();
    if (savedWishlist.items.length > 0) {
      dispatch({
        type: 'LOAD_WISHLIST',
        payload: savedWishlist
      });
    }
  }, []);

  const addToWishlist = (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    console.log('addToWishlist called with:', item);
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromWishlist = (itemId: string) => {
    console.log('removeFromWishlist called with:', itemId);
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const clearWishlist = () => {
    console.log('clearWishlist called');
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId: string, type: string = 'product') => {
    return wishlist.items.some(item => {
      if (type === 'product') {
        return item.productId === productId;
      } else if (type === 'room-style') {
        return item.roomStyleId === productId;
      } else if (type === 'designer-collection') {
        return item.designerCollectionId === productId;
      } else if (type === 'design-look') {
        return item.lookId === productId;
      }
      return false;
    });
  };

  const getWishlistItemCount = () => wishlist.itemCount;

  // Debug: Log wishlist state changes
  useEffect(() => {
    console.log('Wishlist state updated:', {
      itemCount: wishlist.itemCount,
      items: wishlist.items.length
    });
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      getWishlistItemCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};