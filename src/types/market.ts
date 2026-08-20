export interface MarketProduct {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  sellerId: string;
  price: number;
  currency: string;
  categoryId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketOrder {
  id: string;
  buyerId: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  total: number;
  currency: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  workspaceId: string;
}
