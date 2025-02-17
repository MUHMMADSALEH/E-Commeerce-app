'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin?redirect=/admin/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="fixed top-20 left-0 right-0 bg-white shadow-md z-20">
        <div className="flex items-center px-6 py-4 bg-gradient-to-r from-shop-purple to-shop-lightPurple">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-white/80 ml-4">Welcome, {user.name}</p>
        </div>
        <nav className="flex items-center px-6 bg-white">
          <Link 
            href="/admin/dashboard"
            className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-shop-purple transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products"
            className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-shop-purple transition-colors"
          >
            Manage Products
          </Link>
          <Link 
            href="/admin/users"
            className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-shop-purple transition-colors"
          >
            Manage Users
          </Link>
          <Link 
            href="/admin/orders"
            className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-shop-purple transition-colors"
          >
            View Orders
          </Link>
          <Link 
            href="/"
            className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-shop-purple transition-colors"
          >
            View Store
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 mt-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 