import { useState, useCallback } from 'react';
import { Product } from '../types';

interface UseNewArrivalsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchNewArrivals: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useNewArrivals = (): UseNewArrivalsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewArrivals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/new-arrivals`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.result === 'success') {
        setProducts(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch new arrivals');
      }
    } catch (err) {
      console.error('Error fetching new arrivals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load new arrivals');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchNewArrivals();
  }, [fetchNewArrivals]);

  return {
    products,
    loading,
    error,
    fetchNewArrivals,
    refetch
  };
};