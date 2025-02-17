'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockProducts } from '@/data/mockProducts';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('default');

  // Update selected category when URL parameter changes
  useEffect(() => {
    setSelectedCategory(categoryParam || 'all');
  }, [categoryParam]);

  // Get unique categories from products
  const categories = ['all', ...new Set(mockProducts.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter(product => selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase())
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Title */}
      <h1 className="text-3xl font-bold mb-8">
        {selectedCategory === 'all' 
          ? 'All Products' 
          : `${selectedCategory} Products`}
      </h1>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                // Update URL without page reload
                const url = new URL(window.location.href);
                if (category === 'all') {
                  url.searchParams.delete('category');
                } else {
                  url.searchParams.set('category', category);
                }
                window.history.pushState({}, '', url);
              }}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="capitalize"
            >
              {category === 'all' ? 'All Products' : category}
            </Button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">
            No products available in the {selectedCategory} category.
          </p>
        </div>
      )}
    </div>
  );
} 