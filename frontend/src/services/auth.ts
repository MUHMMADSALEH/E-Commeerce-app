import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
authApi.interceptors.request.use(
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

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  adminCode?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      console.log('Attempting signup with:', { ...data, password: '[REDACTED]' });
      const response = await authApi.post<AuthResponse>('/users/register', {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        adminCode: data.adminCode
      });

      console.log('Signup response:', { 
        ...response.data, 
        token: '[REDACTED]',
        user: response.data.user 
      });

      if (!response.data || !response.data.token || !response.data.user) {
        console.error('Invalid signup response:', response.data);
        throw new AuthError('Invalid response from server');
      }

      // Store the token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof AxiosError && error.response) {
        throw new AuthError(error.response.data.message || 'Failed to sign up');
      }
      throw new AuthError('An unexpected error occurred during sign up');
    }
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email: data.email, password: '[REDACTED]' });
      const response = await authApi.post<AuthResponse>('/users/login', {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      console.log('Login response:', { 
        ...response.data, 
        token: '[REDACTED]',
        user: response.data.user 
      });

      if (!response.data || !response.data.token || !response.data.user) {
        console.error('Invalid login response:', response.data);
        throw new AuthError('Invalid response from server');
      }

      // Store the token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AxiosError && error.response) {
        throw new AuthError(error.response.data.message || 'Invalid credentials');
      }
      throw new AuthError('An unexpected error occurred during sign in');
    }
  },

  async signOut(): Promise<void> {
    try {
      await authApi.post('/users/logout');
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authApi.get<User>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error instanceof AxiosError && error.response) {
        throw new AuthError(error.response.data.message || 'Failed to get user data');
      }
      throw new AuthError('An unexpected error occurred while fetching user data');
    }
  }
}; 