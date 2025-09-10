import { Product } from '../types';

export interface RoomStyle {
  id: string;
  name: string;
  designer: string;
  description: string;
  style: string;
  room: string;
  image: string;
  totalPrice: number;
  currency: string;
  products: string[]; // Product IDs included in this room
  features: string[];
  designerNote: string;
}

export const designerRoomStyles: RoomStyle[] = [
  {
    id: 'room_style_1',
    name: 'Modern Minimalist Living Suite',
    designer: 'Sarah Al-Mansouri',
    description: 'A complete living room designed with clean lines and sophisticated materials',
    style: 'Contemporary',
    room: 'Living Room',
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    totalPrice: 18500,
    currency: 'AED',
    products: ['prod_1', 'prod_4', 'prod_7', 'prod_3'],
    features: [
      'Sectional sofa with premium upholstery',
      'Designer coffee table in oak finish',
      'Accent chair for reading corner',
      'Coordinated lighting solution',
      'Professional styling consultation'
    ],
    designerNote: 'This collection embodies the essence of modern luxury - where every piece serves a purpose while maintaining aesthetic harmony. The neutral palette creates a timeless foundation that can evolve with your lifestyle.'
  },
  {
    id: 'room_style_2',
    name: 'Scandinavian Bedroom Retreat',
    designer: 'Erik Lundberg',
    description: 'A serene bedroom sanctuary with Nordic-inspired design elements',
    style: 'Scandinavian',
    room: 'Bedroom',
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    totalPrice: 12800,
    currency: 'AED',
    products: ['prod_5', 'prod_7'],
    features: [
      'Platform bed with upholstered headboard',
      'Bedside lighting with warm ambiance',
      'Organic cotton bedding set',
      'Natural wood nightstands',
      'Hygge-inspired accessories'
    ],
    designerNote: 'Inspired by the Danish concept of hygge, this bedroom creates a cozy sanctuary that promotes rest and well-being. Light woods and soft textures invite relaxation and peaceful sleep.'
  },
  {
    id: 'room_style_3',
    name: 'Executive Office Collection',
    designer: 'Ahmed Hassan',
    description: 'A sophisticated workspace designed for productivity and style',
    style: 'Contemporary',
    room: 'Office',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    totalPrice: 8900,
    currency: 'AED',
    products: ['prod_6', 'prod_8', 'prod_7'],
    features: [
      'Ergonomic executive desk',
      'Storage solutions with clean lines',
      'Task lighting for focused work',
      'Cable management system',
      'Productivity consultation session'
    ],
    designerNote: 'A workspace should inspire creativity while maintaining functionality. This collection balances professional aesthetics with ergonomic design to enhance your daily productivity.'
  },
  {
    id: 'room_style_4',
    name: 'Elegant Dining Experience',
    designer: 'Layla Khalil',
    description: 'A complete dining room setup for memorable gatherings',
    style: 'Traditional',
    room: 'Dining',
    image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    totalPrice: 15200,
    currency: 'AED',
    products: ['prod_2', 'prod_7'],
    features: [
      'Dining table set for 6 people',
      'Ambient lighting for dining',
      'Coordinated table accessories',
      'Seasonal styling guide',
      'Entertainment hosting tips'
    ],
    designerNote: 'Dining is about bringing people together. This collection creates an atmosphere where conversations flow as smoothly as the wine, making every meal a celebration.'
  }
];