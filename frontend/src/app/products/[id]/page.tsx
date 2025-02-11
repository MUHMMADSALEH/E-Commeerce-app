'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { productService, type Product } from '@/services/product';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setError('');

      try {
        const productData = await productService.getProduct(id as string);
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Failed to load product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { product, quantity });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div className="bg-gray-200 rounded-lg h-96" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-red-500">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        {/* Product Image */}
        <div className="relative h-96 rounded-lg overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="mt-8 lg:mt-0">
          <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-3xl text-gray-900">${product.price.toFixed(2)}</p>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Description</h3>
            <div className="mt-2 prose prose-sm text-gray-500">
              {product.description}
            </div>
          </div>

          {product.stock > 0 ? (
            <div className="mt-8 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  className="rounded-md border-gray-300 py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
                  value={quantity}
                  onChange={handleQuantityChange}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddToCart} className="w-full">
                Add to Cart
              </Button>
              <p className="text-sm text-gray-500">
                {product.stock} items in stock
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <Button disabled className="w-full">
                Out of Stock
              </Button>
            </div>
          )}

          {product.rating && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Rating</h3>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 