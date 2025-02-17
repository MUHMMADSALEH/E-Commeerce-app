'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface CartProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export interface CartItem {
  quantity: number;
  product: CartProduct;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (product: CartProduct) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.product._id === product._id
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + 1, item.product.stock)
              }
            : item
        );
      }
      
      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.product._id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.product._id === productId) {
          const newQuantity = Math.min(quantity, item.product.stock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  const itemsCount = items.reduce(
    (total, item) => total + item.quantity, 
    0
  );

  const total = items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemsCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
