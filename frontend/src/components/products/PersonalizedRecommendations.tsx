'use client';

import { useProducts } from '@/hooks/useProducts';
import { useRecommendations } from '@/hooks/useRecommendations';
import ProductCard from './ProductCard';

export function PersonalizedRecommendations() {
  const { products } = useProducts();
  const { recommendations, isLoading } = useRecommendations(products, 'personal');

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recommended for You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
} 