'use client';

import { useState, useEffect } from 'react';
import { mockProducts, type Product } from '@/data/mockProducts';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Using mock data directly
        setProducts(mockProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
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