import { create } from 'zustand';
import type { PortfolioDocument } from '@/types';
import { portfolioApi } from '@/lib/mock-data';

interface PortfolioState {
  documents: PortfolioDocument[];
  currentId: string | null;

  loadAll: () => void;
  create: (partial?: Partial<PortfolioDocument>) => PortfolioDocument;
  update: (id: string, updates: Partial<PortfolioDocument>) => void;
  remove: (id: string) => void;
  setCurrentId: (id: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  documents: [],
  currentId: null,

  loadAll: () => {
    set({ documents: portfolioApi.getAll() });
  },

  create: (partial) => {
    const doc = portfolioApi.create(partial);
    set((s) => ({ documents: [doc, ...s.documents] }));
    return doc;
  },

  update: (id, updates) => {
    portfolioApi.update(id, updates);
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  remove: (id) => {
    portfolioApi.delete(id);
    set((s) => ({
      documents: s.documents.filter((d) => d.id !== id),
      currentId: s.currentId === id ? null : s.currentId,
    }));
  },

  setCurrentId: (id) => {
    set({ currentId: id });
  },
}));
