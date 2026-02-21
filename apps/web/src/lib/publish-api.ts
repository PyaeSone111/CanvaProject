import type { PublishedRecord, ThemeSettings, SeoSettings, PageView } from '@/types';

// ── Storage keys ────────────────────────────────────────────────────
const KEYS = {
  published: 'canva_published',
  analytics: 'canva_analytics',
} as const;

function uid(): string {
  return crypto.randomUUID();
}
function now(): string {
  return new Date().toISOString();
}
function today(): string {
  return new Date().toISOString().split('T')[0];
}

export const defaultTheme: ThemeSettings = {
  fontFamily: 'system-ui, sans-serif',
  baseFontSize: 16,
  bgColor: '#ffffff',
  textColor: '#1C222D',
  accentColor: '#5B636E',
  buttonRadius: 6,
  buttonStyle: 'solid',
  sectionPadding: 'normal',
};

export const defaultSeo: SeoSettings = {
  title: '',
  description: '',
  ogImage: '',
};

// ── Helpers ─────────────────────────────────────────────────────────
function getRecords(): PublishedRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.published) || '[]');
  } catch {
    return [];
  }
}
function saveRecords(records: PublishedRecord[]): void {
  localStorage.setItem(KEYS.published, JSON.stringify(records));
}

function getAnalytics(): PageView[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.analytics) || '[]');
  } catch {
    return [];
  }
}
function saveAnalytics(data: PageView[]): void {
  localStorage.setItem(KEYS.analytics, JSON.stringify(data));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function ensureUniqueSlug(base: string, excludeId?: string): string {
  const records = getRecords();
  let slug = base;
  let counter = 1;
  while (records.some((r) => r.slug === slug && r.id !== excludeId)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

// ── Publish API ─────────────────────────────────────────────────────
export const publishApi = {
  /** Publish or re-publish a portfolio */
  publishPortfolio(
    sourceId: string,
    title: string,
    slug?: string,
    seo?: Partial<SeoSettings>,
    theme?: Partial<ThemeSettings>
  ): PublishedRecord {
    const records = getRecords();
    const existing = records.find((r) => r.sourceId === sourceId && r.type === 'portfolio');

    if (existing) {
      existing.isPublished = true;
      existing.updatedAt = now();
      existing.title = title;
      if (slug) existing.slug = ensureUniqueSlug(slug, existing.id);
      if (seo) existing.seo = { ...existing.seo, ...seo };
      if (theme) existing.theme = { ...existing.theme, ...theme };
      saveRecords(records);
      return existing;
    }

    const record: PublishedRecord = {
      id: uid(),
      type: 'portfolio',
      sourceId,
      slug: ensureUniqueSlug(slug || slugify(title)),
      title,
      description: seo?.description || '',
      ogImage: seo?.ogImage || '',
      publishedAt: now(),
      updatedAt: now(),
      isPublished: true,
      theme: { ...defaultTheme, ...theme },
      seo: { ...defaultSeo, title, ...seo },
    };
    records.push(record);
    saveRecords(records);
    return record;
  },

  /** Publish or re-publish a page */
  publishPage(
    sourceId: string,
    title: string,
    slug?: string,
    seo?: Partial<SeoSettings>,
    theme?: Partial<ThemeSettings>
  ): PublishedRecord {
    const records = getRecords();
    const existing = records.find((r) => r.sourceId === sourceId && r.type === 'page');

    if (existing) {
      existing.isPublished = true;
      existing.updatedAt = now();
      existing.title = title;
      if (slug) existing.slug = ensureUniqueSlug(slug, existing.id);
      if (seo) existing.seo = { ...existing.seo, ...seo };
      if (theme) existing.theme = { ...existing.theme, ...theme };
      saveRecords(records);
      return existing;
    }

    const record: PublishedRecord = {
      id: uid(),
      type: 'page',
      sourceId,
      slug: ensureUniqueSlug(slug || slugify(title)),
      title,
      description: seo?.description || '',
      ogImage: seo?.ogImage || '',
      publishedAt: now(),
      updatedAt: now(),
      isPublished: true,
      theme: { ...defaultTheme, ...theme },
      seo: { ...defaultSeo, title, ...seo },
    };
    records.push(record);
    saveRecords(records);
    return record;
  },

  unpublish(sourceId: string): boolean {
    const records = getRecords();
    const record = records.find((r) => r.sourceId === sourceId);
    if (!record) return false;
    record.isPublished = false;
    record.updatedAt = now();
    saveRecords(records);
    return true;
  },

  getPublishedBySlug(slug: string): PublishedRecord | undefined {
    return getRecords().find((r) => r.slug === slug && r.isPublished);
  },

  getBySourceId(sourceId: string): PublishedRecord | undefined {
    return getRecords().find((r) => r.sourceId === sourceId);
  },

  listPublished(): PublishedRecord[] {
    return getRecords().filter((r) => r.isPublished);
  },

  listAll(): PublishedRecord[] {
    return getRecords();
  },

  updateSeo(sourceId: string, seo: Partial<SeoSettings>): PublishedRecord | undefined {
    const records = getRecords();
    const record = records.find((r) => r.sourceId === sourceId);
    if (!record) return undefined;
    record.seo = { ...record.seo, ...seo };
    record.updatedAt = now();
    saveRecords(records);
    return record;
  },

  updateTheme(sourceId: string, theme: Partial<ThemeSettings>): PublishedRecord | undefined {
    const records = getRecords();
    const record = records.find((r) => r.sourceId === sourceId);
    if (!record) return undefined;
    record.theme = { ...record.theme, ...theme };
    record.updatedAt = now();
    saveRecords(records);
    return record;
  },

  updateSlug(sourceId: string, newSlug: string): PublishedRecord | undefined {
    const records = getRecords();
    const record = records.find((r) => r.sourceId === sourceId);
    if (!record) return undefined;
    record.slug = ensureUniqueSlug(slugify(newSlug), record.id);
    record.updatedAt = now();
    saveRecords(records);
    return record;
  },

  isSlugAvailable(slug: string, excludeSourceId?: string): boolean {
    const records = getRecords();
    return !records.some((r) => r.slug === slugify(slug) && r.sourceId !== excludeSourceId);
  },

  deleteRecord(sourceId: string): boolean {
    const records = getRecords();
    const filtered = records.filter((r) => r.sourceId !== sourceId);
    if (filtered.length === records.length) return false;
    saveRecords(filtered);
    return true;
  },
};

// ── Analytics API ───────────────────────────────────────────────────
export const analyticsApi = {
  trackView(slug: string): void {
    const data = getAnalytics();
    const d = today();
    const existing = data.find((v) => v.slug === slug && v.date === d);
    if (existing) {
      existing.views += 1;
    } else {
      data.push({ slug, date: d, views: 1 });
    }
    saveAnalytics(data);
  },

  getViewsForSlug(slug: string, days = 7): PageView[] {
    const data = getAnalytics();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return data.filter((v) => v.slug === slug && v.date >= cutoffStr);
  },

  getTotalViews(days = 7): number {
    const data = getAnalytics();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return data
      .filter((v) => v.date >= cutoffStr)
      .reduce((sum, v) => sum + v.views, 0);
  },

  getTopPages(days = 7, limit = 10): { slug: string; views: number }[] {
    const data = getAnalytics();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    const map = new Map<string, number>();
    for (const v of data) {
      if (v.date >= cutoffStr) {
        map.set(v.slug, (map.get(v.slug) || 0) + v.views);
      }
    }
    return Array.from(map.entries())
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  getDailyViews(days = 7): { date: string; views: number }[] {
    const data = getAnalytics();
    const result: { date: string; views: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const total = data
        .filter((v) => v.date === dateStr)
        .reduce((sum, v) => sum + v.views, 0);
      result.push({ date: dateStr, views: total });
    }
    return result;
  },

  /** Seed some fake analytics data for demo purposes */
  seedDemoData(): void {
    const existing = getAnalytics();
    if (existing.length > 0) return;

    const demoSlugs = ['my-portfolio', 'landing-page', 'about-me'];
    const data: PageView[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      for (const slug of demoSlugs) {
        data.push({ slug, date: dateStr, views: Math.floor(Math.random() * 50) + 5 });
      }
    }
    saveAnalytics(data);
  },
};
