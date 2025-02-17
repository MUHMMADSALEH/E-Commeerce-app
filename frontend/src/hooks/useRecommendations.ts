'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/mockProducts';
import { recommendationService } from '@/services/recommendation';
import { usePreferences } from '@/contexts/PreferencesContext';

// Cache object to store recommendations
const recommendationsCache = new Map<string, {
  products: Product[];
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useRecommendations(products: Product[], type: 'personal' | 'similar', currentProduct?: Product) {
  const { preferences } = usePreferences();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create a cache key based on the type and relevant data
  const cacheKey = type === 'personal' 
    ? `personal-${JSON.stringify(preferences)}`
    : `similar-${currentProduct?._id}`;

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      // Check cache first
      const cached = recommendationsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setRecommendations(cached.products);
        return;
      }

      // Only show loading state if we don't have any recommendations
      if (!recommendations.length) {
        setIsLoading(true);
      }

      try {
        let newRecommendations: Product[] = [];

        if (type === 'personal') {
          newRecommendations = await recommendationService.getPersonalizedRecommendations(
            products,
            preferences
          );
        } else if (currentProduct) {
          newRecommendations = await recommendationService.getSimilarProducts(
            currentProduct,
            products
          );
        }

        if (isMounted && newRecommendations.length > 0) {
          // Update cache
          recommendationsCache.set(cacheKey, {
            products: newRecommendations,
            timestamp: Date.now()
          });
          setRecommendations(newRecommendations);
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        // Fallback to random products only if we have no recommendations
        if (isMounted && !recommendations.length) {
          const fallbackProducts = products
            .filter(p => p._id !== currentProduct?._id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
          setRecommendations(fallbackProducts);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (products.length > 0) {
      loadRecommendations();
    }

    return () => {
      isMounted = false;
    };
  }, [products, cacheKey, currentProduct, type]);

  return { recommendations, isLoading };
} 