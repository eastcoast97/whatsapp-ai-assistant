/**
 * TypeScript type definitions
 * Auto-generated based on architecture
 */

export interface Store {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type CreateStoreInput = Omit<Store, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStoreInput = Partial<CreateStoreInput>;

export interface WhatsApp {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type CreateWhatsAppInput = Omit<WhatsApp, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWhatsAppInput = Partial<CreateWhatsAppInput>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}