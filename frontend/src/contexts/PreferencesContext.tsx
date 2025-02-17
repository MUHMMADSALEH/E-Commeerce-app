'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserPreferences } from '@/services/recommendation';

interface PreferencesContextType {
  preferences: Partial<UserPreferences>;
  addRecentView: (productId: string) => void;
  addPurchaseHistory: (productId: string) => void;
  updateInterests: (interests: string[]) => void;
  updateFavoriteCategories: (categories: string[]) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = 'user-preferences';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    recentViews: [],
    purchaseHistory: [],
    interests: [],
    favoriteCategories: []
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedPreferences = localStorage.getItem(`${STORAGE_KEY}-${user._id}`);
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    }
  }, [user]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEY}-${user._id}`, JSON.stringify(preferences));
    }
  }, [preferences, user]);

  const addRecentView = (productId: string) => {
    setPreferences(prev => ({
      ...prev,
      recentViews: [
        productId,
        ...(prev.recentViews || []).filter(id => id !== productId)
      ].slice(0, 10) // Keep only last 10 views
    }));
  };

  const addPurchaseHistory = (productId: string) => {
    setPreferences(prev => ({
      ...prev,
      purchaseHistory: [
        productId,
        ...(prev.purchaseHistory || [])
      ]
    }));
  };

  const updateInterests = (interests: string[]) => {
    setPreferences(prev => ({
      ...prev,
      interests
    }));
  };

  const updateFavoriteCategories = (categories: string[]) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCategories: categories
    }));
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        addRecentView,
        addPurchaseHistory,
        updateInterests,
        updateFavoriteCategories
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 