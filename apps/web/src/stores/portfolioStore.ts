import { create } from 'zustand';
import type { PortfolioDocument, PortfolioPage, SectionBlock } from '@/types';
import { portfolioApi } from '@/lib/mock-data';

function uid(): string {
  return crypto.randomUUID();
}

interface PortfolioState {
  documents: PortfolioDocument[];
  currentId: string | null;
  activePageId: string | null;
  selectedSectionId: string | null;

  // Autosave
  lastSaved: Date | null;
  isSaving: boolean;

  // History
  past: PortfolioDocument[][];
  future: PortfolioDocument[][];

  loadAll: () => void;
  create: (partial?: Partial<PortfolioDocument>) => PortfolioDocument;
  update: (id: string, updates: Partial<PortfolioDocument>) => void;
  remove: (id: string) => void;
  publish: (id: string) => void;
  unpublish: (id: string) => void;
  setCurrentId: (id: string | null) => void;
  currentDocument: () => PortfolioDocument | undefined;

  // Page management
  setActivePageId: (id: string | null) => void;
  addPage: (title?: string) => void;
  updatePage: (pageId: string, updates: Partial<PortfolioPage>) => void;
  removePage: (pageId: string) => void;
  reorderPages: (newPages: PortfolioPage[]) => void;

  // Section management
  selectSection: (id: string | null) => void;
  addSection: (pageId: string, type: SectionBlock['type']) => void;
  updateSection: (pageId: string, sectionId: string, updates: Partial<SectionBlock>) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  reorderSections: (pageId: string, newSections: SectionBlock[]) => void;

  // History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Autosave
  autoSave: () => void;
}

function getDefaultContent(type: SectionBlock['type']): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return { heading: 'Hero Heading', subheading: 'A short description goes here.', backgroundUrl: '' };
    case 'gallery':
      return { images: [], columns: 3 };
    case 'text':
      return { body: 'Enter your text content here. You can describe your work, add details, or tell a story.' };
    case 'cta':
      return { heading: 'Ready to work together?', buttonText: 'Get in Touch', buttonUrl: '#' };
    case 'columns':
      return {
        items: [
          { title: 'Column 1', body: 'Description for column 1.' },
          { title: 'Column 2', body: 'Description for column 2.' },
          { title: 'Column 3', body: 'Description for column 3.' },
        ],
      };
    default:
      return {};
  }
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  documents: [],
  currentId: null,
  activePageId: null,
  selectedSectionId: null,
  lastSaved: null,
  isSaving: false,
  past: [],
  future: [],

  loadAll: () => {
    set({ documents: portfolioApi.getAll() });
  },

  create: (partial) => {
    const doc = portfolioApi.create(partial);
    // If no pages, seed with a default Home page
    if (doc.pages.length === 0) {
      doc.pages = [
        {
          id: uid(),
          title: 'Home',
          sections: [
            {
              id: uid(),
              type: 'hero',
              content: getDefaultContent('hero'),
            },
          ],
        },
      ];
      portfolioApi.update(doc.id, { pages: doc.pages });
    }
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

  publish: (id) => {
    portfolioApi.update(id, { published: true });
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, published: true } : d
      ),
    }));
  },

  unpublish: (id) => {
    portfolioApi.update(id, { published: false });
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, published: false } : d
      ),
    }));
  },

  setCurrentId: (id) => {
    const doc = get().documents.find((d) => d.id === id);
    set({
      currentId: id,
      activePageId: doc?.pages[0]?.id ?? null,
      selectedSectionId: null,
      past: [],
      future: [],
    });
  },

  currentDocument: () => {
    const { currentId, documents } = get();
    if (!currentId) return undefined;
    return documents.find((d) => d.id === currentId);
  },

  // Page management
  setActivePageId: (id) => set({ activePageId: id, selectedSectionId: null }),

  addPage: (title) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    const newPage: PortfolioPage = {
      id: uid(),
      title: title || 'New Page',
      sections: [],
    };
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, pages: [...d.pages, newPage] } : d
      ),
      activePageId: newPage.id,
      future: [],
    }));
  },

  updatePage: (pageId, updates) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              pages: d.pages.map((p) => (p.id === pageId ? { ...p, ...updates } : p)),
            }
          : d
      ),
      future: [],
    }));
  },

  removePage: (pageId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => {
      const doc = s.documents.find((d) => d.id === currentId);
      const remaining = doc?.pages.filter((p) => p.id !== pageId) ?? [];
      return {
        documents: s.documents.map((d) =>
          d.id === currentId ? { ...d, pages: remaining } : d
        ),
        activePageId: s.activePageId === pageId ? (remaining[0]?.id ?? null) : s.activePageId,
        selectedSectionId: null,
        future: [],
      };
    });
  },

  reorderPages: (newPages) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, pages: newPages } : d
      ),
      future: [],
    }));
  },

  // Section management
  selectSection: (id) => set({ selectedSectionId: id }),

  addSection: (pageId, type) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    const newSection: SectionBlock = {
      id: uid(),
      type,
      content: getDefaultContent(type),
    };
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              pages: d.pages.map((p) =>
                p.id === pageId ? { ...p, sections: [...p.sections, newSection] } : p
              ),
            }
          : d
      ),
      selectedSectionId: newSection.id,
      future: [],
    }));
  },

  updateSection: (pageId, sectionId, updates) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              pages: d.pages.map((p) =>
                p.id === pageId
                  ? {
                      ...p,
                      sections: p.sections.map((sec) =>
                        sec.id === sectionId ? { ...sec, ...updates } : sec
                      ),
                    }
                  : p
              ),
            }
          : d
      ),
      future: [],
    }));
  },

  removeSection: (pageId, sectionId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              pages: d.pages.map((p) =>
                p.id === pageId
                  ? { ...p, sections: p.sections.filter((sec) => sec.id !== sectionId) }
                  : p
              ),
            }
          : d
      ),
      selectedSectionId: s.selectedSectionId === sectionId ? null : s.selectedSectionId,
      future: [],
    }));
  },

  reorderSections: (pageId, newSections) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              pages: d.pages.map((p) =>
                p.id === pageId ? { ...p, sections: newSections } : p
              ),
            }
          : d
      ),
      future: [],
    }));
  },

  // History
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
    portfolioApi.update(currentId, doc);
    setTimeout(() => {
      set({ isSaving: false, lastSaved: new Date() });
    }, 300);
  },
}));
