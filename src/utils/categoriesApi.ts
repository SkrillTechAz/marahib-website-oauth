// utils/categoriesApi.ts - FIXED VERSION
import { useState, useEffect } from 'react';


const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  count?: number;
}

export interface SubSubcategory {
  id: number;
  name: string;
  subcategory_id: number;
  category_id: number;
  image_url?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  category_id: number;
  subSubcategories?: SubSubcategory[];
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  subcategories?: Subcategory[];
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// FIXED: Generic API fetch function with flexible response handling
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`🌐 Making API request to: ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    });

    console.log(`📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    console.log('📄 Raw response data:', data);
    
    // FIXED: Handle both wrapped and unwrapped responses
    if (data && typeof data === 'object' && 'success' in data) {
      // Response is wrapped with success/data format
      if (!data.success) {
        throw new ApiError(data.error || 'API request failed');
      }
      console.log('✅ Wrapped response - returning data property');
      return data.data;
    } else {
      // Response is raw data (not wrapped)
      console.log('✅ Raw response - returning data directly');
      return data;
    }
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// FIXED: Updated fetchProductsByCategory with better error handling
export async function fetchProductsByCategory(category: string): Promise<any[]> {
  try {
    console.log(`🛍️ Fetching products for category: ${category}`);
    
    const endpoint = `/api/products?s_s_c=${category}`;
    const data = await apiRequest<any[]>(endpoint);
    
    console.log(`✅ Products fetched successfully:`, {
      count: Array.isArray(data) ? data.length : 'Not an array',
      firstItem: Array.isArray(data) && data[0] ? data[0] : 'N/A',
      dataType: typeof data
    });
    
    // Ensure we return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // If it's an object, try to find the products array
      if ('products' in data && Array.isArray(data.products)) {
        return data.products;
      } else if ('data' in data && Array.isArray(data.data)) {
        return data.data;
      } else {
        // Single product object
        return [data];
      }
    } else {
      console.warn('⚠️ Unexpected data format, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError('Products not found for this category');
    }
    throw new ApiError('Failed to fetch products');
  }
}

// Fetch all subcategories
export async function fetchSubcategories(): Promise<Subcategory[]> {
  try {
    const data = await apiRequest<Subcategory[]>('/api/categories/subcategories');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw new ApiError('Failed to fetch subcategories');
  }
}

// Fetch subcategories for a specific category
export async function fetchSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
  try {
    const data = await apiRequest<Subcategory[]>(`/api/categories/${categoryId}/subcategories`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    throw new ApiError('Failed to fetch subcategories for category');
  }
}

// Alternative: Fetch subcategories with category filter as query param
export async function fetchSubcategoriesWithFilter(categoryId?: string): Promise<Subcategory[]> {
  try {
    const endpoint = categoryId 
      ? `/api/categories/subcategories?category_id=${categoryId}`
      : '/api/categories/subcategories';
    
    const data = await apiRequest<Subcategory[]>(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching subcategories with filter:', error);
    throw new ApiError('Failed to fetch subcategories');
  }
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await apiRequest<Category[]>('/api/categories');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new ApiError('Failed to fetch categories');
  }
}

// Health check endpoint
export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  try {
    const data = await apiRequest<{ status: string; timestamp: string }>('/api/health');
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new ApiError('Health check failed');
  }
}

// Custom hook for subcategories
export function useSubcategories(categoryId?: string) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = categoryId 
          ? await fetchSubcategoriesByCategory(categoryId)
          : await fetchSubcategories();
        
        if (isMounted) {
          setSubcategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load subcategories');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSubcategories();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = categoryId 
        ? await fetchSubcategoriesByCategory(categoryId)
        : await fetchSubcategories();
      
      setSubcategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reload subcategories');
    } finally {
      setLoading(false);
    }
  };

  return { subcategories, loading, error, refetch };
}

// Custom hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load categories');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reload categories');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch };
}

// FIXED: Custom hook for products with enhanced debugging
export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (category: string = 'all') => {
    console.log(`🚀 useProducts.fetchProducts called with category: ${category}`);
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchProductsByCategory(category);
      
      console.log(`✅ Products loaded successfully:`, {
        category,
        count: data.length,
        firstProduct: data[0] || null
      });
      
      setProducts(data);
    } catch (err) {
      console.error('❌ useProducts error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
}

// REMOVED THE REST OF THE HELPER FUNCTIONS TO KEEP IT FOCUSED ON THE MAIN ISSUE

// Utility to handle API errors consistently
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

