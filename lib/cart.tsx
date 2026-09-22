"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "./api";
import { useAuth } from "./auth";

interface CartItem {
  product: {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image?: string;
    images?: { url: string }[];
    category?: { name: string };
  };
  quantity: number;
  priceAtAddition: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/cart");
      setItems(data.data?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    const { data } = await api.post("/api/cart/add", { productId, quantity });
    setItems(data.data?.items ?? []);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const { data } = await api.put("/api/cart/update-quantity", { productId, quantity });
    setItems(data.data?.items ?? []);
  };

  const removeItem = async (productId: string) => {
    const { data } = await api.delete(`/api/cart/item/${productId}`);
    setItems(data.data?.items ?? []);
  };

  const clearCart = async () => {
    await api.delete("/api/cart/clear");
    setItems([]);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, isLoading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
