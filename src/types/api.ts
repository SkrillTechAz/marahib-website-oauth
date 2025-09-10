
export interface Designer {
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
}

export interface DesignLookImage {
  id: string;
  design_look_id: string;
  image_url: string;
  image_label: string;
  image_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
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
  additional_images?: string[];
  vendor?: {
    business_name: string;
  };
}

export interface ImageSpot {
  id: string;
  x_percentage: number;
  y_percentage: number;
  product_id?: string;
  product?: Product;
  design_look_image_id: string;
}

export interface DesignLookFilters {
  styles: string[];
  roomTypes: string[];
  designers: Designer[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Cart integration types
export interface CartItemDesignLook {
  type: 'design-look';
  lookId: string;
  name: string;
  designer: string;
  price: number;
  image: string;
  quantity: number;
}