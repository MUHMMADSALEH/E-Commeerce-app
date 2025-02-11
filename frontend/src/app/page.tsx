'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { productService, Product } from '@/services/product';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await productService.getProducts({ limit: 3 });
        setFeaturedProducts(response.products);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format"
            alt="Hero background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Welcome to E-Store
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
              Discover amazing products at great prices. Shop the latest trends in electronics, fashion, and home decor.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="px-8 py-3">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div className="group relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                      <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/products?category=Electronics"
              className="group relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format"
                  alt="Electronics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Electronics</h3>
                <p className="mt-2 text-gray-600">Latest gadgets and smart devices</p>
                <ul className="mt-4 text-sm text-gray-500">
                  <li>• Smart TVs & Audio</li>
                  <li>• Laptops & Computers</li>
                  <li>• Cameras & Photography</li>
                  <li>• Wearable Technology</li>
                </ul>
              </div>
            </Link>

            <Link
              href="/products?category=Home & Kitchen"
              className="group relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&auto=format"
                  alt="Home & Kitchen"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Home & Kitchen</h3>
                <p className="mt-2 text-gray-600">Everything for your home</p>
                <ul className="mt-4 text-sm text-gray-500">
                  <li>• Kitchen Appliances</li>
                  <li>• Cookware & Bakeware</li>
                  <li>• Smart Home Devices</li>
                  <li>• Home Accessories</li>
                </ul>
              </div>
            </Link>

            <Link
              href="/products?category=Furniture"
              className="group relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format"
                  alt="Furniture"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Furniture</h3>
                <p className="mt-2 text-gray-600">Stylish and comfortable furniture</p>
                <ul className="mt-4 text-sm text-gray-500">
                  <li>• Living Room</li>
                  <li>• Bedroom Sets</li>
                  <li>• Office Furniture</li>
                  <li>• Dining & Kitchen</li>
                </ul>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 