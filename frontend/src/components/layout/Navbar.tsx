'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { CartDropdown } from '@/components/cart/CartDropdown';
import { mockProducts } from '@/data/mockProducts';

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  // Get unique categories from products
  const categories = [...new Set(mockProducts.map(product => product.category))];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-playfair font-bold bg-gradient-to-r from-shop-purple to-shop-lightPurple bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              SHOP
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-12">
              <Link 
                href="/products" 
                className={`font-playfair ${
                  pathname === '/products' && !currentCategory
                    ? 'text-shop-purple'
                    : 'text-gray-600 hover:text-shop-purple'
                } transition-colors`}
              >
                All Products
              </Link>
              {categories.map(category => (
                <Link
                  key={category}
                  href={`/products?category=${category}`}
                  className={`font-playfair capitalize ${
                    currentCategory?.toLowerCase() === category.toLowerCase()
                      ? 'text-shop-purple'
                      : 'text-gray-600 hover:text-shop-purple'
                  } transition-colors`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <CartDropdown />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="font-playfair text-gray-600">Hello, {user.name}</span>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard">
                    <Button variant="secondary" className="font-playfair">Admin</Button>
                  </Link>
                )}
                <Button onClick={signOut} className="font-playfair bg-gradient-to-r from-shop-purple to-shop-lightPurple hover:opacity-90">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="secondary" className="font-playfair">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="font-playfair bg-gradient-to-r from-shop-purple to-shop-lightPurple hover:opacity-90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 