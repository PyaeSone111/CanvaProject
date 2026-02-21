import type {
  DesignDocument,
  PortfolioDocument,
  PageDocument,
  CanvasObject,
} from '@/types';

// ── Helpers ─────────────────────────────────────────────────────────
function uid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// ── Storage Keys ────────────────────────────────────────────────────
const KEYS = {
  designs: 'canva_designs',
  portfolios: 'canva_portfolios',
  pages: 'canva_pages',
} as const;

// ── Seed Data ───────────────────────────────────────────────────────
function seedDesigns(): DesignDocument[] {
  return [
    {
      id: uid(),
      name: 'Welcome Banner',
      width: 1200,
      height: 628,
      objects: [
        {
          id: uid(),
          type: 'rect',
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          fill: '#5B636E',
          stroke: '#383F4C',
          strokeWidth: 2,
          opacity: 1,
          rotation: 0,
          name: 'Background Box',
        },
        {
          id: uid(),
          type: 'text',
          x: 80,
          y: 120,
          width: 240,
          height: 40,
          fill: '#FFFFFF',
          stroke: 'transparent',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0,
          text: 'Hello World',
          fontSize: 32,
          fontFamily: 'sans-serif',
          name: 'Title Text',
        },
        {
          id: uid(),
          type: 'circle',
          x: 500,
          y: 100,
          width: 120,
          height: 120,
          fill: '#ADB3BC',
          stroke: '#777E89',
          strokeWidth: 2,
          opacity: 0.8,
          rotation: 0,
          name: 'Accent Circle',
        },
      ],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    },
    {
      id: uid(),
      name: 'Social Media Post',
      width: 1080,
      height: 1080,
      objects: [
        {
          id: uid(),
          type: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 1080,
          fill: '#1C222D',
          stroke: 'transparent',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0,
          name: 'Background',
        },
      ],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    },
  ];
}

function seedPortfolios(): PortfolioDocument[] {
  return [
    {
      id: uid(),
      name: 'My Creative Portfolio',
      pages: [
        {
          id: uid(),
          title: 'Home',
          sections: [
            {
              id: uid(),
              type: 'hero',
              content: {
                heading: 'Welcome to My Portfolio',
                subheading: 'Designer & Developer',
              },
            },
          ],
        },
      ],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    },
  ];
}

function seedPages(): PageDocument[] {
  return [
    {
      id: uid(),
      name: 'Landing Page',
      slug: 'landing',
      tree: [
        {
          id: uid(),
          type: 'row',
          style: { padding: '40px 20px' },
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
                  props: { content: 'Welcome to our site' },
                  style: { fontSize: '2rem', fontWeight: 'bold' },
                },
              ],
            },
          ],
        },
      ],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    },
  ];
}

// ── CRUD Layer ──────────────────────────────────────────────────────
function getStore<T>(key: string, seed: () => T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as T[];
    } catch {
      // Corrupted data, reseed
    }
  }
  const data = seed();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

function setStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Design CRUD ─────────────────────────────────────────────────────
export const designApi = {
  getAll(): DesignDocument[] {
    return getStore(KEYS.designs, seedDesigns);
  },

  getById(id: string): DesignDocument | undefined {
    return this.getAll().find((d) => d.id === id);
  },

  create(partial: Partial<DesignDocument> = {}): DesignDocument {
    const doc: DesignDocument = {
      id: uid(),
      name: partial.name || 'Untitled Design',
      width: partial.width || 800,
      height: partial.height || 600,
      objects: partial.objects || [],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    };
    const all = this.getAll();
    all.unshift(doc);
    setStore(KEYS.designs, all);
    return doc;
  },

  update(id: string, updates: Partial<DesignDocument>): DesignDocument | undefined {
    const all = this.getAll();
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...updates, updatedAt: now() };
    setStore(KEYS.designs, all);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((d) => d.id !== id);
    if (filtered.length === all.length) return false;
    setStore(KEYS.designs, filtered);
    return true;
  },

  duplicate(id: string): DesignDocument | undefined {
    const doc = this.getById(id);
    if (!doc) return undefined;
    return this.create({
      ...doc,
      name: `${doc.name} (Copy)`,
      objects: doc.objects.map((o: CanvasObject) => ({ ...o, id: uid() })),
    });
  },
};

// ── Portfolio CRUD ──────────────────────────────────────────────────
export const portfolioApi = {
  getAll(): PortfolioDocument[] {
    return getStore(KEYS.portfolios, seedPortfolios);
  },

  getById(id: string): PortfolioDocument | undefined {
    return this.getAll().find((d) => d.id === id);
  },

  create(partial: Partial<PortfolioDocument> = {}): PortfolioDocument {
    const doc: PortfolioDocument = {
      id: uid(),
      name: partial.name || 'Untitled Portfolio',
      pages: partial.pages || [],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    };
    const all = this.getAll();
    all.unshift(doc);
    setStore(KEYS.portfolios, all);
    return doc;
  },

  update(id: string, updates: Partial<PortfolioDocument>): PortfolioDocument | undefined {
    const all = this.getAll();
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...updates, updatedAt: now() };
    setStore(KEYS.portfolios, all);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((d) => d.id !== id);
    if (filtered.length === all.length) return false;
    setStore(KEYS.portfolios, filtered);
    return true;
  },
};

// ── Page CRUD ───────────────────────────────────────────────────────
export const pageApi = {
  getAll(): PageDocument[] {
    return getStore(KEYS.pages, seedPages);
  },

  getById(id: string): PageDocument | undefined {
    return this.getAll().find((d) => d.id === id);
  },

  create(partial: Partial<PageDocument> = {}): PageDocument {
    const doc: PageDocument = {
      id: uid(),
      name: partial.name || 'Untitled Page',
      slug: partial.slug || `page-${Date.now()}`,
      tree: partial.tree || [],
      updatedAt: now(),
      createdAt: now(),
      published: false,
    };
    const all = this.getAll();
    all.unshift(doc);
    setStore(KEYS.pages, all);
    return doc;
  },

  update(id: string, updates: Partial<PageDocument>): PageDocument | undefined {
    const all = this.getAll();
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    all[idx] = { ...all[idx], ...updates, updatedAt: now() };
    setStore(KEYS.pages, all);
    return all[idx];
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((d) => d.id !== id);
    if (filtered.length === all.length) return false;
    setStore(KEYS.pages, filtered);
    return true;
  },
};
