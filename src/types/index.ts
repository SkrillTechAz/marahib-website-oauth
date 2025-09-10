export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  front_png: string;
  side_png: string;
  detail_png: string;
  lifestyle_png: string;
  designer: string;
  price: number | string;
  additional_images: string[];
  discount: number;
  retail_price: number;
  vat_percent: number;
  originalPrice?: number | string;
  formattedPrice?: string;     
  formattedOriginalPrice?: string;
  currency: string;
  images: string[];
  colors: Color[];
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  stockQuantity?: number;
  materials?: string;
  dimensions?: ProductDimensions;
  weight?: number;
  features?: string[];
  warranty?: string;
  careInstructions?: string;
  assemblyRequired?: boolean;
  style?: string;
  roomType?: string;
  sku?: string;
  countryOfOrigin?: string;
  finish?: string;
  shippingCost?: number;
  tags?: string[];
}

export interface Color {
  name: string;
  hex: string;
}

export interface VirtualStore {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  style: string;
  has360Tour: boolean;
  isLuxury?: boolean;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  source: string;
  consent_given: boolean;
}

export interface RoomStyle {
  id: string;
  name: string;
  designer: string;
  description: string;
  style: string;
  room: string;
  image: string;
  totalPrice: number;
  originalPrice: number;
  currency: string;
  products: string[];
  features: string[];
  designerNote: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'room-style' | 'designer-collection';
  productId?: string;
  roomStyleId?: string;
  designerCollectionId?: string;
  name: string;
  designer: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedColor?: Color;
  customizations?: Record<string, any>;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  itemCount: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'cash_on_delivery';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}