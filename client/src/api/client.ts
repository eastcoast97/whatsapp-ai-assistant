/**
 * API Client
 * Axios-based API client with typed methods
 */

import axios from 'axios';
import { Store, CreateStoreInput, UpdateStoreInput, WhatsApp, CreateWhatsAppInput, UpdateWhatsAppInput, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Store API
  stores: {
    getAll: async (params?: { page?: number; limit?: number }) => {
      const response = await api.get<PaginatedResponse<Store>>('/stores', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get<ApiResponse<Store>>(`/stores/${id}`);
      return response.data;
    },
    create: async (data: CreateStoreInput) => {
      const response = await api.post<ApiResponse<Store>>('/stores', data);
      return response.data;
    },
    update: async (id: string, data: UpdateStoreInput) => {
      const response = await api.put<ApiResponse<Store>>(`/stores/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      await api.delete(`/stores/${id}`);
    },
  },
  // WhatsApp API
  whatsApps: {
    getAll: async (params?: { page?: number; limit?: number }) => {
      const response = await api.get<PaginatedResponse<WhatsApp>>('/whats-apps', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get<ApiResponse<WhatsApp>>(`/whats-apps/${id}`);
      return response.data;
    },
    create: async (data: CreateWhatsAppInput) => {
      const response = await api.post<ApiResponse<WhatsApp>>('/whats-apps', data);
      return response.data;
    },
    update: async (id: string, data: UpdateWhatsAppInput) => {
      const response = await api.put<ApiResponse<WhatsApp>>(`/whats-apps/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      await api.delete(`/whats-apps/${id}`);
    },
  },
};

export default apiClient;