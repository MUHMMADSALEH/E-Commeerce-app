'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart, type CartProduct } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: CartProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Calculate remaining stock after considering items in cart
  const itemInCart = items.find(item => item.product._id === product._id);
  const remainingStock = product.stock - (itemInCart?.quantity || 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (remainingStock <= 0) return;

    setIsAdding(true);
    try {
      await addItem(product);
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 bg-gray-200">
          <img
            src={product.image || '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              remainingStock > 10 ? 'text-green-600' : 
              remainingStock > 0 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {remainingStock > 10 ? 'In Stock' :
               remainingStock > 0 ? `Only ${remainingStock} left` :
               'Out of Stock'}
            </span>
            <Button
              onClick={handleAddToCart}
              disabled={remainingStock <= 0 || isAdding}
              className="w-32"
            >
              {isAdding ? 'Adding...' :
               remainingStock <= 0 ? 'Out of Stock' :
               'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
} 