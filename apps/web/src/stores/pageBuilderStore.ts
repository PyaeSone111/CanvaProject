import { create } from 'zustand';
import type { PageDocument, RowNode, ColumnNode, BlockNode, BlockType } from '@/types';
import { pageApi } from '@/lib/mock-data';

function uid(): string {
  return crypto.randomUUID();
}

interface PageBuilderState {
  documents: PageDocument[];
  currentId: string | null;
  selectedNodeId: string | null;
  selectedNodeType: 'row' | 'column' | 'block' | null;

  // Autosave
  lastSaved: Date | null;
  isSaving: boolean;

  // History
  past: PageDocument[][];
  future: PageDocument[][];

  loadAll: () => void;
  create: (partial?: Partial<PageDocument>) => PageDocument;
  update: (id: string, updates: Partial<PageDocument>) => void;
  remove: (id: string) => void;
  setCurrentId: (id: string | null) => void;
  currentDocument: () => PageDocument | undefined;

  // Node selection
  selectNode: (id: string | null, type?: 'row' | 'column' | 'block' | null) => void;

  // Row management
  addRow: () => void;
  updateRow: (rowId: string, updates: Partial<RowNode>) => void;
  removeRow: (rowId: string) => void;
  reorderRows: (newRows: RowNode[]) => void;

  // Column management
  addColumn: (rowId: string) => void;
  updateColumn: (rowId: string, colId: string, updates: Partial<ColumnNode>) => void;
  removeColumn: (rowId: string, colId: string) => void;

  // Block management
  addBlock: (rowId: string, colId: string, type: BlockType) => void;
  updateBlock: (rowId: string, colId: string, blockId: string, updates: Partial<BlockNode>) => void;
  removeBlock: (rowId: string, colId: string, blockId: string) => void;
  reorderBlocks: (rowId: string, colId: string, newBlocks: BlockNode[]) => void;

  // History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Autosave
  autoSave: () => void;
}

function getDefaultBlockProps(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'text':
      return { content: 'Enter text here...' };
    case 'image':
      return { src: '/placeholder.svg?height=200&width=400', alt: 'Placeholder image' };
    case 'button':
      return { label: 'Click Me', url: '#', variant: 'primary' };
    case 'link':
      return { text: 'Link text', url: '#' };
    case 'spacer':
      return { height: '40px' };
    case 'divider':
      return { thickness: '1px', color: '#E5E7EB' };
    default:
      return {};
  }
}

export const usePageBuilderStore = create<PageBuilderState>((set, get) => ({
  documents: [],
  currentId: null,
  selectedNodeId: null,
  selectedNodeType: null,
  lastSaved: null,
  isSaving: false,
  past: [],
  future: [],

  loadAll: () => {
    set({ documents: pageApi.getAll() });
  },

  create: (partial) => {
    const doc = pageApi.create(partial);
    // Seed with a default row if empty
    if (doc.tree.length === 0) {
      doc.tree = [
        {
          id: uid(),
          type: 'row',
          style: { padding: '24px 16px' },
          columns: [
            {
              id: uid(),
              type: 'column',
              width: '100%',
              style: {},
              children: [
                {
                  id: uid(),
                  type: 'text',
                  props: { content: 'Start building your page here...' },
                  style: { fontSize: '1.5rem', fontWeight: 'bold' },
                },
              ],
            },
          ],
        },
      ];
      pageApi.update(doc.id, { tree: doc.tree });
    }
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
    set({ currentId: id, selectedNodeId: null, selectedNodeType: null, past: [], future: [] });
  },

  currentDocument: () => {
    const { currentId, documents } = get();
    if (!currentId) return undefined;
    return documents.find((d) => d.id === currentId);
  },

  selectNode: (id, type = null) => set({ selectedNodeId: id, selectedNodeType: type }),

  // Helpers to map over current doc tree
  _mapTree(fn: (tree: RowNode[]) => RowNode[]) {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, tree: fn(d.tree) } : d
      ),
      future: [],
    }));
  },

  // Row management
  addRow: () => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    const newRow: RowNode = {
      id: uid(),
      type: 'row',
      style: { padding: '24px 16px' },
      columns: [
        {
          id: uid(),
          type: 'column',
          width: '100%',
          style: {},
          children: [],
        },
      ],
    };
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, tree: [...d.tree, newRow] } : d
      ),
      selectedNodeId: newRow.id,
      selectedNodeType: 'row',
      future: [],
    }));
  },

  updateRow: (rowId, updates) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? { ...d, tree: d.tree.map((r) => (r.id === rowId ? { ...r, ...updates } : r)) }
          : d
      ),
      future: [],
    }));
  },

  removeRow: (rowId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, tree: d.tree.filter((r) => r.id !== rowId) } : d
      ),
      selectedNodeId: s.selectedNodeId === rowId ? null : s.selectedNodeId,
      selectedNodeType: s.selectedNodeId === rowId ? null : s.selectedNodeType,
      future: [],
    }));
  },

  reorderRows: (newRows) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId ? { ...d, tree: newRows } : d
      ),
      future: [],
    }));
  },

  // Column management
  addColumn: (rowId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    const newCol: ColumnNode = {
      id: uid(),
      type: 'column',
      width: '50%',
      style: {},
      children: [],
    };
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: [...r.columns, newCol].map((c, _, arr) => ({
                        ...c,
                        width: `${Math.floor(100 / arr.length)}%`,
                      })),
                    }
                  : r
              ),
            }
          : d
      ),
      future: [],
    }));
  },

  updateColumn: (rowId, colId, updates) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((c) => (c.id === colId ? { ...c, ...updates } : c)),
                    }
                  : r
              ),
            }
          : d
      ),
      future: [],
    }));
  },

  removeColumn: (rowId, colId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns
                        .filter((c) => c.id !== colId)
                        .map((c, _, arr) => ({
                          ...c,
                          width: `${Math.floor(100 / arr.length)}%`,
                        })),
                    }
                  : r
              ),
            }
          : d
      ),
      future: [],
    }));
  },

  // Block management
  addBlock: (rowId, colId, type) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    const newBlock: BlockNode = {
      id: uid(),
      type,
      props: getDefaultBlockProps(type),
      style: {},
    };
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((c) =>
                        c.id === colId ? { ...c, children: [...c.children, newBlock] } : c
                      ),
                    }
                  : r
              ),
            }
          : d
      ),
      selectedNodeId: newBlock.id,
      selectedNodeType: 'block',
      future: [],
    }));
  },

  updateBlock: (rowId, colId, blockId, updates) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((c) =>
                        c.id === colId
                          ? {
                              ...c,
                              children: c.children.map((b) =>
                                b.id === blockId ? { ...b, ...updates } : b
                              ),
                            }
                          : c
                      ),
                    }
                  : r
              ),
            }
          : d
      ),
      future: [],
    }));
  },

  removeBlock: (rowId, colId, blockId) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((c) =>
                        c.id === colId
                          ? { ...c, children: c.children.filter((b) => b.id !== blockId) }
                          : c
                      ),
                    }
                  : r
              ),
            }
          : d
      ),
      selectedNodeId: s.selectedNodeId === blockId ? null : s.selectedNodeId,
      selectedNodeType: s.selectedNodeId === blockId ? null : s.selectedNodeType,
      future: [],
    }));
  },

  reorderBlocks: (rowId, colId, newBlocks) => {
    const { currentId, pushHistory } = get();
    if (!currentId) return;
    pushHistory();
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === currentId
          ? {
              ...d,
              tree: d.tree.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      columns: r.columns.map((c) =>
                        c.id === colId ? { ...c, children: newBlocks } : c
                      ),
                    }
                  : r
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
    pageApi.update(currentId, doc);
    setTimeout(() => {
      set({ isSaving: false, lastSaved: new Date() });
    }, 300);
  },
}));
