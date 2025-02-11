'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin?redirect=/admin/dashboard');
      return;
    }

    loadDashboardStats();
  }, [user, router]);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/auth/signin?redirect=/admin/dashboard');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch orders
      const ordersResponse = await fetch('http://localhost:5000/api/orders', {
        headers,
        credentials: 'include'
      });
      if (!ordersResponse.ok) {
        if (ordersResponse.status === 401) {
          router.push('/auth/signin?redirect=/admin/dashboard');
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      const ordersData = await ordersResponse.json();

      // Fetch products
      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers,
        credentials: 'include'
      });
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData = await productsResponse.json();

      // Fetch users
      const usersResponse = await fetch('http://localhost:5000/api/users', {
        headers,
        credentials: 'include'
      });
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();

      setStats({
        totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
        totalProducts: Array.isArray(productsData) ? productsData.length : 
                      (productsData.products ? productsData.products.length : 0),
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        recentOrders: Array.isArray(ordersData) ? ordersData.slice(0, 5) : [],
      });
    } catch (error: any) {
      console.error('Failed to load dashboard stats:', error);
      setError(error.message || 'Failed to load dashboard statistics');
      
      if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        router.push('/auth/signin?redirect=/admin/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={loadDashboardStats}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {stats.recentOrders.map((order) => (
            <li key={order._id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order._id.slice(-8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.shippingAddress?.fullName || 'N/A'} - ${(order.totalPrice || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      order.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 