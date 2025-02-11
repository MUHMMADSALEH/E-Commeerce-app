'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService, SignInData, SignUpData } from '@/services/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<{ user: User; token: string }>;
  signUp: (data: SignUpData) => Promise<{ user: User; token: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthProvider: Restored user from storage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (data: SignInData) => {
    try {
      const response = await authService.signIn(data);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update state
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Sign in error in context:', error);
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const response = await authService.signUp(data);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      console.log('AuthProvider: Sign up successful:', {
        ...response,
        token: '[REDACTED]'
      });

      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update state
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Sign up error in context:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Clear user data regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/signin');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 