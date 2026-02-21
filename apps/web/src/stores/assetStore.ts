import { create } from 'zustand';
import type { AssetItem } from '@/types';

const STORAGE_KEY = 'canva_assets';

function uid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// Seed with some placeholder assets
function seedAssets(): AssetItem[] {
  return [
    {
      id: uid(),
      name: 'placeholder-landscape.svg',
      type: 'image',
      url: '/placeholder.svg?height=400&width=600',
      thumbnailUrl: '/placeholder.svg?height=120&width=180',
      width: 600,
      height: 400,
      size: 2400,
      uploadedAt: now(),
    },
    {
      id: uid(),
      name: 'placeholder-square.svg',
      type: 'image',
      url: '/placeholder.svg?height=400&width=400',
      thumbnailUrl: '/placeholder.svg?height=120&width=120',
      width: 400,
      height: 400,
      size: 1800,
      uploadedAt: now(),
    },
    {
      id: uid(),
      name: 'placeholder-portrait.svg',
      type: 'image',
      url: '/placeholder.svg?height=600&width=400',
      thumbnailUrl: '/placeholder.svg?height=180&width=120',
      width: 400,
      height: 600,
      size: 3200,
      uploadedAt: now(),
    },
  ];
}

function getStore(): AssetItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AssetItem[];
    } catch {
      // corrupted
    }
  }
  const data = seedAssets();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function persist(items: AssetItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface AssetState {
  assets: AssetItem[];
  searchQuery: string;
  isUploading: boolean;

  loadAll: () => void;
  setSearchQuery: (q: string) => void;
  upload: (file: File) => Promise<AssetItem>;
  remove: (id: string) => void;
  filteredAssets: () => AssetItem[];
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  searchQuery: '',
  isUploading: false,

  loadAll: () => {
    set({ assets: getStore() });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  upload: async (file: File) => {
    set({ isUploading: true });

    // Create a local object URL to simulate upload
    const objectUrl = URL.createObjectURL(file);

    // Get image dimensions if it's an image
    let width = 400;
    let height = 300;
    if (file.type.startsWith('image/')) {
      try {
        const dims = await getImageDimensions(objectUrl);
        width = dims.width;
        height = dims.height;
      } catch {
        // use defaults
      }
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const asset: AssetItem = {
      id: uid(),
      name: file.name,
      type: 'image',
      url: objectUrl,
      thumbnailUrl: objectUrl,
      width,
      height,
      size: file.size,
      uploadedAt: now(),
    };

    set((s) => {
      const updated = [asset, ...s.assets];
      persist(updated);
      return { assets: updated, isUploading: false };
    });

    return asset;
  },

  remove: (id) => {
    set((s) => {
      const updated = s.assets.filter((a) => a.id !== id);
      persist(updated);
      return { assets: updated };
    });
  },

  filteredAssets: () => {
    const { assets, searchQuery } = get();
    if (!searchQuery.trim()) return assets;
    const q = searchQuery.toLowerCase();
    return assets.filter((a) => a.name.toLowerCase().includes(q));
  },
}));

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}
