import { useState, useEffect } from 'react';
import { mockProducts, type Product } from '@/data/mockProducts';
import { productService } from '@/services/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // If using mock data, return immediately
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          setProducts(mockProducts);
          setIsLoading(false);
          return;
        }

        // Otherwise, fetch from API
        const response = await productService.getProducts();
        setProducts(response.products);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
        // Fallback to mock products
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    setProducts
  };
} 