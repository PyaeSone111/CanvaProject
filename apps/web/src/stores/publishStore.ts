import { create } from 'zustand';
import type { PublishedRecord, ThemeSettings, SeoSettings } from '@/types';
import { publishApi, analyticsApi } from '@/lib/publish-api';

interface PublishState {
  records: PublishedRecord[];
  loading: boolean;

  loadAll: () => void;

  publishPortfolio: (
    sourceId: string,
    title: string,
    slug?: string,
    seo?: Partial<SeoSettings>,
    theme?: Partial<ThemeSettings>
  ) => PublishedRecord;

  publishPage: (
    sourceId: string,
    title: string,
    slug?: string,
    seo?: Partial<SeoSettings>,
    theme?: Partial<ThemeSettings>
  ) => PublishedRecord;

  unpublish: (sourceId: string) => void;
  updateSeo: (sourceId: string, seo: Partial<SeoSettings>) => void;
  updateTheme: (sourceId: string, theme: Partial<ThemeSettings>) => void;
  updateSlug: (sourceId: string, slug: string) => void;
  deleteRecord: (sourceId: string) => void;

  getBySourceId: (sourceId: string) => PublishedRecord | undefined;
  getBySlug: (slug: string) => PublishedRecord | undefined;
  isSlugAvailable: (slug: string, excludeSourceId?: string) => boolean;

  // Analytics helpers
  totalViews7d: () => number;
  topPages7d: () => { slug: string; views: number }[];
  dailyViews7d: () => { date: string; views: number }[];
}

export const usePublishStore = create<PublishState>((set, get) => ({
  records: [],
  loading: false,

  loadAll: () => {
    set({ loading: true });
    const records = publishApi.listAll();
    analyticsApi.seedDemoData();
    set({ records, loading: false });
  },

  publishPortfolio: (sourceId, title, slug, seo, theme) => {
    const record = publishApi.publishPortfolio(sourceId, title, slug, seo, theme);
    set({ records: publishApi.listAll() });
    return record;
  },

  publishPage: (sourceId, title, slug, seo, theme) => {
    const record = publishApi.publishPage(sourceId, title, slug, seo, theme);
    set({ records: publishApi.listAll() });
    return record;
  },

  unpublish: (sourceId) => {
    publishApi.unpublish(sourceId);
    set({ records: publishApi.listAll() });
  },

  updateSeo: (sourceId, seo) => {
    publishApi.updateSeo(sourceId, seo);
    set({ records: publishApi.listAll() });
  },

  updateTheme: (sourceId, theme) => {
    publishApi.updateTheme(sourceId, theme);
    set({ records: publishApi.listAll() });
  },

  updateSlug: (sourceId, slug) => {
    publishApi.updateSlug(sourceId, slug);
    set({ records: publishApi.listAll() });
  },

  deleteRecord: (sourceId) => {
    publishApi.deleteRecord(sourceId);
    set({ records: publishApi.listAll() });
  },

  getBySourceId: (sourceId) => {
    return get().records.find((r) => r.sourceId === sourceId);
  },

  getBySlug: (slug) => {
    return get().records.find((r) => r.slug === slug && r.isPublished);
  },

  isSlugAvailable: (slug, excludeSourceId) => {
    return publishApi.isSlugAvailable(slug, excludeSourceId);
  },

  totalViews7d: () => analyticsApi.getTotalViews(7),
  topPages7d: () => analyticsApi.getTopPages(7),
  dailyViews7d: () => analyticsApi.getDailyViews(7),
}));
