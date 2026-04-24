import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'carts', user.uid), (doc) => {
      if (doc.exists()) {
        setItems(doc.data().items || []);
      } else {
        setItems([]);
      }
    });

    return unsubscribe;
  }, [user]);

  const saveCart = async (newItems: CartItem[]) => {
    if (!user) return;
    await setDoc(doc(db, 'carts', user.uid), { userId: user.uid, items: newItems });
  };

  const addToCart = async (productId: string) => {
    const existing = items.find(i => i.productId === productId);
    let newItems;
    if (existing) {
      newItems = items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newItems = [...items, { productId, quantity: 1 }];
    }
    await saveCart(newItems);
  };

  const removeFromCart = async (productId: string) => {
    const newItems = items.filter(i => i.productId !== productId);
    await saveCart(newItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    const newItems = items.map(i => i.productId === productId ? { ...i, quantity } : i);
    await saveCart(newItems);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within CartProvider');
  return context;
}
