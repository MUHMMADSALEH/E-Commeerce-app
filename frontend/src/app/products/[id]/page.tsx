'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/contexts/CartContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/products/ProductCard';

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { addItem } = useCart();
  const { addRecentView } = usePreferences();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!id) {
        setError('Product not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // Find product in mock data
        const productData = mockProducts.find(p => p._id === id);
        
        if (!productData) {
          throw new Error('Product not found');
        }

        if (!isMounted) return;

        setProduct(productData);
        addRecentView(productData._id);

        // Find similar products from the same category
        const similarFromCategory = mockProducts
          .filter(p => p.category === productData.category && p._id !== productData._id)
          .slice(0, 4);

        if (!isMounted) return;
        setSimilarProducts(similarFromCategory);
      } catch (err) {
        if (!isMounted) return;
        setError('Product not found');
        router.push('/products'); // Redirect to products page if product not found
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, addRecentView, router]);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/products')}>
            View All Products
          </Button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-shop-purple">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span>{product.rating}</span>
          </div>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select
                value={quantity}
                onChange={handleQuantityChange}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddToCart} disabled={product.stock === 0}>
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
            
            <p className={`text-sm font-medium ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {product.stock > 10 ? 'In Stock' :
               product.stock > 0 ? `Only ${product.stock} left` :
               'Out of Stock'}
            </p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct._id} product={similarProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 