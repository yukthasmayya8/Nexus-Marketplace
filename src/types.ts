export type UserRole = 'buyer' | 'seller';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  specifications?: string[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}
