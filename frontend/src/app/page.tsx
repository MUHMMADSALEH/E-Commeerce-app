'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { productService, Product } from '@/services/product';
import { mockProducts } from '@/data/mockProducts';

interface FloatingImage {
  src: string;
  alt: string;
  size: number;
  style: {
    '--float-x'?: string;
    '--float-y'?: string;
    '--rotate'?: string;
    '--float-time'?: string;
    '--float-delay'?: string;
    'zIndex'?: string;
    'opacity'?: string;
  };
}

const generateFloatingImages = (screenWidth: number = 1920, screenHeight: number = 1080): FloatingImage[] => {
  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format', // Headphones
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=500&auto=format', // Watch
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format', // Smartphone
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format', // Sneakers
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format', // Perfume
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format', // Jewelry
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format', // Beauty
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format', // Sports
  ];

  const repeatedImages = Array(8).fill(images).flat();
  const floatingImages: FloatingImage[] = [];

  repeatedImages.forEach((src, index) => {
    // Use grid-based positioning for better distribution
    const gridCols = 6;
    const gridRows = 4;
    
    const col = index % gridCols;
    const row = Math.floor(index / gridCols) % gridRows;
    
    // Calculate base position within the grid cell
    const cellWidth = screenWidth / gridCols;
    const cellHeight = screenHeight / gridRows;
    
    const baseX = (col + 0.5) * cellWidth;
    const baseY = (row + 0.5) * cellHeight;
    
    // Add random offset within the cell
    const xOffset = (Math.random() - 0.5) * cellWidth * 0.8;
    const yOffset = (Math.random() - 0.5) * cellHeight * 0.8;
    
    const x = baseX + xOffset - screenWidth / 2;
    const y = baseY + yOffset - screenHeight / 2;

    const size = Math.random() * 60 + 160; // Random size between 160px and 220px
    const rotateAngle = Math.random() * 360; // Random rotation
    const floatTime = Math.random() * 25 + 15; // Random float time between 15s and 40s
    const floatDelay = -Math.random() * 30; // Negative delay for immediate start
    const zIndex = Math.floor(Math.random() * 10).toString();

    floatingImages.push({
      src,
      alt: 'Product image',
      size,
      style: {
        '--float-x': `${x}px`,
        '--float-y': `${y}px`,
        '--rotate': `${rotateAngle}deg`,
        '--float-time': `${floatTime}s`,
        '--float-delay': `${floatDelay}s`,
        'zIndex': zIndex,
        'opacity': '0.85'
      }
    });
  });

  return floatingImages;
};

export default function HomePage() {
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState(mockProducts.slice(0, 6));

  useEffect(() => {
    // Generate floating images after component mounts
    const updateFloatingImages = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setFloatingImages(generateFloatingImages(width, height));
    };

    // Initial generation
    updateFloatingImages();

    // Update on resize
    window.addEventListener('resize', updateFloatingImages);
    return () => window.removeEventListener('resize', updateFloatingImages);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Floating Images Container - Lower z-index */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ bottom: '4rem' }}>
        {floatingImages.map((image, index) => (
          <div
            key={index}
            className="floating-item absolute"
            style={{
              width: `${image.size}px`,
              height: `${image.size}px`,
              ...image.style,
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${image.style['--float-x']}), calc(-50% + ${image.style['--float-y']}))`
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* Main Content Container - Higher z-index */}
      <div className="relative z-10">
        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
          <h1 className="text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-shop-purple to-shop-lightPurple leading-none">
            SHOP
          </h1>
          <p className="mt-6 text-4xl text-transparent bg-clip-text bg-gradient-to-r from-shop-purple to-shop-lightPurple mb-12">
            Discover Amazing Products
          </p>
          <Link href="/products">
            <Button className="text-xl px-12 py-6 font-playfair">
              Start Shopping
            </Button>
          </Link>
        </div>

        {/* Featured Products Section */}
        <section className="relative bg-white/80 backdrop-blur-md py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 font-playfair">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div className="shop-card group">
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 font-playfair">{product.name}</h3>
                    <p className="text-shop-purple font-medium">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 