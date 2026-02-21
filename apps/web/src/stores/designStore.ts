import { create } from 'zustand';
import type { DesignDocument, CanvasObject } from '@/types';
import { designApi } from '@/lib/mock-data';

interface DesignState {
  documents: DesignDocument[];
  currentId: string | null;
  selectedObjectId: string | null;

  // History for undo/redo
  past: DesignDocument[][];
  future: DesignDocument[][];

  // Autosave
  lastSaved: Date | null;
  isSaving: boolean;

  // Actions
  loadAll: () => void;
  create: (partial?: Partial<DesignDocument>) => DesignDocument;
  update: (id: string, updates: Partial<DesignDocument>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => DesignDocument | undefined;
  publish: (id: string) => void;
  unpublish: (id: string) => void;
  setCurrentId: (id: string | null) => void;
  selectObject: (id: string | null) => void;

  // Object mutations (on current document)
  addObject: (obj: CanvasObject) => void;
  updateObject: (objId: string, updates: Partial<CanvasObject>) => void;
  removeObject: (objId: string) => void;
  reorderObjects: (newOrder: CanvasObject[]) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Save
  autoSave: () => void;

  // Current doc helper
  currentDocument: () => DesignDocument | undefined;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  documents: [],
  currentId: null,
  selectedObjectId: null,
  past: [],
  future: [],
  lastSaved: null,
  isSaving: false,

  loadAll: () => {
    const docs = designApi.getAll();
    set({ documents: docs });
  },

  create: (partial) => {
    const doc = designApi.create(partial);
    set((s) => ({ documents: [doc, ...s.documents] }));
    return doc;
  },

  update: (id, updates) => {
    designApi.update(id, updates);
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));
  },

  remove: (id) => {
    designApi.delete(id);
    set((s) => ({
      documents: s.documents.filter((d) => d.id !== id),
      currentId: s.currentId === id ? null : s.currentId,
    }));
  },

  duplicate: (id) => {
    const doc = designApi.duplicate(id);
    if (doc) {
      set((s) => ({ documents: [doc, ...s.documents] }));
    }
    return doc;
  },

  publish: (id) => {
    designApi.update(id, { published: true });
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, published: true } : d
      ),
    }));
  },

  unpublish: (id) => {
    designApi.update(id, { published: false });
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, published: false } : d
      ),
    }));
  },

  setCurrentId: (id) => {
    set({ currentId: id, selectedObjectId: null, past: [], future: [] });
  },

  selectObject: (id) => {
    set({ selectedObjectId: id });
  },

  // Object mutations
  addObject: (obj) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, objects: [...d.objects, obj] } : d
      ),
      selectedObjectId: obj.id,
      future: [],
    }));
  },

  updateObject: (objId, updates) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              objects: d.objects.map((o) => (o.id === objId ? { ...o, ...updates } : o)),
            }
          : d
      ),
      future: [],
    }));
  },

  removeObject: (objId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? { ...d, objects: d.objects.filter((o) => o.id !== objId) }
          : d
      ),
      selectedObjectId: s.selectedObjectId === objId ? null : s.selectedObjectId,
      future: [],
    }));
  },

  reorderObjects: (newOrder) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, objects: newOrder } : d
      ),
      future: [],
    }));
  },

  pushHistory: () => {
    set((s) => ({
      past: [...s.past.slice(-49), s.documents],
    }));
  },

  undo: () => {
    const { past, documents } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [documents, ...get().future],
      documents: previous,
    });
  },

  redo: () => {
    const { future, documents } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      future: future.slice(1),
      past: [...get().past, documents],
      documents: next,
    });
  },

  autoSave: () => {
    const { currentId, documents } = get();
    if (!currentId) return;
    const doc = documents.find((d) => d.id === currentId);
    if (!doc) return;
    set({ isSaving: true });
    designApi.update(currentId, doc);
    // Simulate brief async
    setTimeout(() => {
      set({ isSaving: false, lastSaved: new Date() });
    }, 300);
  },

  currentDocument: () => {
    const { currentId, documents } = get();
    if (!currentId) return undefined;
    return documents.find((d) => d.id === currentId);
  },
}));
