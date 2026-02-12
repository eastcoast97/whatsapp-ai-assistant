/**
 * Zustand Store
 * Global state management for whatsapp-ai-assistant
 */

import { create } from 'zustand';
import { Store, WhatsApp } from '../types';

interface AppState {
  // Store state
  stores: Store[];
  selectedStore: Store | null;
  storeLoading: boolean;

  // Store actions
  setStores: (stores: Store[]) => void;
  setSelectedStore: (store: Store | null) => void;
  setStoreLoading: (loading: boolean) => void;
  addStore: (store: Store) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  removeStore: (id: string) => void;

  // WhatsApp state
  whatsApps: WhatsApp[];
  selectedWhatsApp: WhatsApp | null;
  whatsAppLoading: boolean;

  // WhatsApp actions
  setWhatsApps: (whatsApps: WhatsApp[]) => void;
  setSelectedWhatsApp: (whatsApp: WhatsApp | null) => void;
  setWhatsAppLoading: (loading: boolean) => void;
  addWhatsApp: (whatsApp: WhatsApp) => void;
  updateWhatsApp: (id: string, updates: Partial<WhatsApp>) => void;
  removeWhatsApp: (id: string) => void;

}

export const useStore = create<AppState>((set) => ({
  // Store state
  stores: [],
  selectedStore: null,
  storeLoading: false,

  // Store actions
  setStores: (stores) => set({ stores }),
  setSelectedStore: (store) => set({ selectedStore: store }),
  setStoreLoading: (loading) => set({ storeLoading: loading }),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  updateStore: (id, updates) => set((state) => ({
    stores: state.stores.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  removeStore: (id) => set((state) => ({
    stores: state.stores.filter(item => item.id !== id)
  })),

  // WhatsApp state
  whatsApps: [],
  selectedWhatsApp: null,
  whatsAppLoading: false,

  // WhatsApp actions
  setWhatsApps: (whatsApps) => set({ whatsApps }),
  setSelectedWhatsApp: (whatsApp) => set({ selectedWhatsApp: whatsApp }),
  setWhatsAppLoading: (loading) => set({ whatsAppLoading: loading }),
  addWhatsApp: (whatsApp) => set((state) => ({ whatsApps: [...state.whatsApps, whatsApp] })),
  updateWhatsApp: (id, updates) => set((state) => ({
    whatsApps: state.whatsApps.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  removeWhatsApp: (id) => set((state) => ({
    whatsApps: state.whatsApps.filter(item => item.id !== id)
  })),

}));