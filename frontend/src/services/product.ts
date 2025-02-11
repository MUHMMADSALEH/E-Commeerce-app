'use client';

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const productApi = axios.create({
  baseURL: `${API_URL}/products`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
productApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductError';
  }
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const response = await productApi.get(`/?${queryParams.toString()}`);
      
      // If response.data is an array, convert it to the expected format
      if (Array.isArray(response.data)) {
        return {
          products: response.data,
          totalPages: 1
        };
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new ProductError(message);
      }
      throw new ProductError('Failed to fetch products');
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await productApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new ProductError(message);
      }
      throw new ProductError('Failed to fetch product');
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await productApi.get('/categories');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new ProductError(message);
      }
      throw new ProductError('Failed to fetch categories');
    }
  },

  // Admin Operations
  async createProduct(productData: Omit<Product, '_id'>): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new ProductError('Authentication required');
      }

      const response = await productApi.post('/', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new ProductError(message);
      }
      throw new ProductError('Failed to create product');
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new ProductError('Authentication required');
      }

      const response = await productApi.put(`/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new ProductError(message);
      }
      throw new ProductError('Failed to update product');
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new ProductError('Authentication required');
      }

      await productApi.delete(`/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new ProductError(message);
      }
      throw new ProductError('Failed to delete product');
    }
  },
}; 