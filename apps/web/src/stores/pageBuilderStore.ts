import { create } from 'zustand';
import type { PageDocument } from '@/types';
import { pageApi } from '@/lib/mock-data';

interface PageBuilderState {
  documents: PageDocument[];
  currentId: string | null;

  loadAll: () => void;
  create: (partial?: Partial<PageDocument>) => PageDocument;
  update: (id: string, updates: Partial<PageDocument>) => void;
  remove: (id: string) => void;
  setCurrentId: (id: string | null) => void;
}

export const usePageBuilderStore = create<PageBuilderState>((set) => ({
  documents: [],
  currentId: null,

  loadAll: () => {
    set({ documents: pageApi.getAll() });
  },

  create: (partial) => {
    const doc = pageApi.create(partial);
    set((s) => ({ documents: [doc, ...s.documents] }));
    return doc;
  },

  update: (id, updates) => {
    pageApi.update(id, updates);
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  remove: (id) => {
    pageApi.delete(id);
    set((s) => ({
      documents: s.documents.filter((d) => d.id !== id),
      currentId: s.currentId === id ? null : s.currentId,
    }));
  },

  setCurrentId: (id) => {
    set({ currentId: id });
  },
}));
