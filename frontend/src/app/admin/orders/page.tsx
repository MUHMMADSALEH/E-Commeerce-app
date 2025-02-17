'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/services/order';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin?redirect=/admin/orders');
      return;
    }

    loadOrders();
  }, [user, router]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus as any);
      await loadOrders(); // Reload orders after update
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      setError(error.message || 'Failed to update order status');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="mt-2 text-gray-600">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 p-6 rounded-lg">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
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
          <h2 className="text-2xl font-bold text-red-600">Error Loading Orders</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button className="mt-4" onClick={loadOrders}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order._id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Customer: {order.shippingAddress.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Button
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium">Items:</h4>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 