'use client';

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const orderApi = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface OrderProduct {
  _id: string;
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'Credit Card' | 'PayPal';
  totalPrice: number;
}

export interface Order extends Omit<CreateOrderData, 'items'> {
  _id: string;
  user: string;
  items: {
    product: {
      _id: string;
      name: string;
      image: string;
      price: number;
    };
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderError';
  }
}

export const orderService = {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new OrderError('Authentication required');
      }

      const response = await orderApi.post('/', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new OrderError(message);
      }
      throw new OrderError('Failed to create order');
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new OrderError('Authentication required');
      }

      const response = await orderApi.get('/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new OrderError(message);
      }
      throw new OrderError('Failed to fetch orders');
    }
  },

  async getMyOrders(): Promise<Order[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new OrderError('Authentication required');
      }

      const response = await orderApi.get('/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new OrderError(message);
      }
      throw new OrderError('Failed to fetch your orders');
    }
  },

  async getOrder(orderId: string): Promise<Order> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new OrderError('Authentication required');
      }

      const response = await orderApi.get(`/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new OrderError(message);
      }
      throw new OrderError('Failed to fetch order');
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new OrderError('Authentication required');
      }

      const response = await orderApi.put(
        `/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new OrderError(message);
      }
      throw new OrderError('Failed to update order status');
    }
  },
}; 