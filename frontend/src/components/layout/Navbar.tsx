'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { CartDropdown } from '@/components/cart/CartDropdown';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
              E-Commerce
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CartDropdown />
            {user ? (
              <>
                <span className="text-gray-600">Hello, {user.name}</span>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard">
                    <Button variant="secondary">Admin</Button>
                  </Link>
                )}
                <Button onClick={signOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 