import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publishApi, analyticsApi } from '@/lib/publish-api';
import { portfolioApi } from '@/lib/mock-data';
import type { PublishedRecord, PortfolioDocument, SectionBlock, ThemeSettings } from '@/types';

// ── SEO helper ──────────────────────────────────────────────────────
function setDocMeta(record: PublishedRecord) {
  document.title = record.seo.title || record.title;

  const setMeta = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      if (name.startsWith('og:')) {
        el.setAttribute('property', name);
      } else {
        el.setAttribute('name', name);
      }
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', record.seo.description || record.description);
  setMeta('og:title', record.seo.title || record.title);
  setMeta('og:description', record.seo.description || record.description);
  if (record.seo.ogImage) setMeta('og:image', record.seo.ogImage);
  setMeta('og:type', 'website');
}

// ── Theme helpers ───────────────────────────────────────────────────
function getPadding(theme: ThemeSettings): string {
  switch (theme.sectionPadding) {
    case 'compact': return '32px 16px';
    case 'spacious': return '80px 24px';
    default: return '48px 24px';
  }
}

function ThemedButton({ theme, label, url }: { theme: ThemeSettings; label: string; url: string }) {
  return (
    <a
      href={url || '#'}
      className="inline-block px-8 py-3 text-sm font-medium no-underline transition-opacity hover:opacity-80"
      style={{
        backgroundColor: theme.buttonStyle === 'solid' ? theme.accentColor : 'transparent',
        color: theme.buttonStyle === 'solid' ? '#fff' : theme.accentColor,
        border: theme.buttonStyle === 'outline' ? `2px solid ${theme.accentColor}` : 'none',
        borderRadius: `${theme.buttonRadius}px`,
      }}
    >
      {label}
    </a>
  );
}

// ── Section renderers ───────────────────────────────────────────────
function renderSection(section: SectionBlock, theme: ThemeSettings) {
  const sectionPad = getPadding(theme);

  if (section.type === 'hero') {
    const bg = (section.content.backgroundUrl as string) || '';
    return (
      <section
        key={section.id}
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          padding: `${theme.sectionPadding === 'spacious' ? '120px' : '80px'} 24px`,
          backgroundColor: bg ? undefined : theme.accentColor + '11',
          backgroundImage: bg ? `url(${bg})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {bg && <div className="absolute inset-0 bg-black/40" />}
        <h1
          className="relative font-bold"
          style={{ fontSize: `${theme.baseFontSize * 2.5}px`, color: theme.textColor }}
        >
          {(section.content.heading as string) || 'Hero Heading'}
        </h1>
        <p
          className="relative mt-3 max-w-xl"
          style={{ fontSize: `${theme.baseFontSize}px`, color: theme.textColor, opacity: 0.7 }}
        >
          {(section.content.subheading as string) || ''}
        </p>
      </section>
    );
  }

  if (section.type === 'text') {
    return (
      <section key={section.id} className="max-w-3xl mx-auto" style={{ padding: sectionPad }}>
        <p
          className="whitespace-pre-wrap leading-relaxed"
          style={{ fontSize: `${theme.baseFontSize}px`, color: theme.textColor }}
        >
          {(section.content.body as string) || ''}
        </p>
      </section>
    );
  }

  if (section.type === 'gallery') {
    const cols = (section.content.columns as number) || 3;
    const images = (section.content.images as string[]) || [];
    const count = Math.max(images.length, cols);
    return (
      <section key={section.id} className="max-w-5xl mx-auto" style={{ padding: sectionPad }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: theme.textColor + '0a' }}>
              {images[i] ? (
                <img src={images[i]} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ fontSize: '12px', color: theme.textColor, opacity: 0.3 }}>No image</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === 'cta') {
    return (
      <section key={section.id} className="text-center" style={{ padding: sectionPad, backgroundColor: theme.accentColor + '0a' }}>
        <h2 className="font-semibold" style={{ fontSize: `${theme.baseFontSize * 1.5}px`, color: theme.textColor }}>
          {(section.content.heading as string) || 'Call to Action'}
        </h2>
        <div className="mt-5">
          <ThemedButton
            theme={theme}
            label={(section.content.buttonText as string) || 'Click Me'}
            url={(section.content.buttonUrl as string) || '#'}
          />
        </div>
      </section>
    );
  }

  if (section.type === 'columns') {
    const items = (section.content.items as { title: string; body: string }[]) || [];
    return (
      <section key={section.id} className="max-w-5xl mx-auto" style={{ padding: sectionPad }}>
        <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="font-semibold" style={{ fontSize: `${theme.baseFontSize}px`, color: theme.textColor }}>
                {item.title}
              </h3>
              <p style={{ fontSize: `${theme.baseFontSize * 0.875}px`, color: theme.textColor, opacity: 0.7 }} className="leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

// ── Main component ──────────────────────────────────────────────────
export function PortfolioPublicPage() {
  const { slug, pageSlug } = useParams<{ slug: string; pageSlug?: string }>();
  const [record, setRecord] = useState<PublishedRecord | null>(null);
  const [doc, setDoc] = useState<PortfolioDocument | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const rec = publishApi.getPublishedBySlug(slug);
    if (!rec || rec.type !== 'portfolio') {
      setNotFound(true);
      return;
    }
    setRecord(rec);
    setDocMeta(rec);
    analyticsApi.trackView(slug);

    const portfolio = portfolioApi.getById(rec.sourceId);
    if (portfolio) {
      setDoc(portfolio);
      if (pageSlug) {
        const idx = portfolio.pages.findIndex(
          (p) => p.title.toLowerCase().replace(/\s+/g, '-') === pageSlug
        );
        if (idx >= 0) setActiveIdx(idx);
      }
    }
  }, [slug, pageSlug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#fafafa', color: '#1a1a1a' }}>
        <p className="text-7xl font-bold opacity-10">404</p>
        <p className="text-base mt-2">This portfolio is not published or does not exist.</p>
      </div>
    );
  }

  if (!record || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const theme = record.theme;
  const activePage = doc.pages[activeIdx] || null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bgColor, color: theme.textColor, fontFamily: theme.fontFamily, fontSize: `${theme.baseFontSize}px` }}
    >
      {/* Nav bar (if multiple pages) */}
      {doc.pages.length > 1 && (
        <nav
          className="sticky top-0 z-50 flex items-center justify-center gap-1 px-4"
          style={{
            height: '44px',
            backgroundColor: theme.bgColor,
            borderBottom: `1px solid ${theme.textColor}15`,
            backdropFilter: 'blur(8px)',
          }}
          aria-label="Portfolio navigation"
        >
          {doc.pages.map((page, i) => (
            <button
              key={page.id}
              onClick={() => setActiveIdx(i)}
              className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={{
                backgroundColor: i === activeIdx ? theme.accentColor + '15' : 'transparent',
                color: i === activeIdx ? theme.textColor : theme.textColor + '80',
              }}
            >
              {page.title}
            </button>
          ))}
        </nav>
      )}

      <main>
        {activePage ? (
          activePage.sections.map((s) => renderSection(s, theme))
        ) : (
          <div className="flex items-center justify-center h-64">
            <p style={{ color: theme.textColor, opacity: 0.5, fontSize: '14px' }}>No content.</p>
          </div>
        )}
      </main>
    </div>
  );
}
