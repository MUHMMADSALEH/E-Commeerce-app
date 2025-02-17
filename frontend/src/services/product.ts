'use client';

import axios, { AxiosError } from 'axios';
import { mockProducts } from '@/data/mockProducts';

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

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);

    return {
      products: paginatedProducts,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  }

  async getProduct(id: string): Promise<Product> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const product = mockProducts.find(p => p._id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async getCategories(): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const categories = [...new Set(mockProducts.map(p => p.category))];
    return categories;
  }
}

export const productService = new ProductService(); 