import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publishApi, analyticsApi } from '@/lib/publish-api';
import { pageApi } from '@/lib/mock-data';
import type { PublishedRecord, PageDocument, RowNode, BlockNode, ThemeSettings } from '@/types';

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

// ── Block renderer ──────────────────────────────────────────────────
function renderBlock(block: BlockNode, theme: ThemeSettings) {
  const mergedStyle = { ...block.style };

  if (block.type === 'text') {
    return (
      <div key={block.id} style={mergedStyle}>
        <p className="whitespace-pre-wrap" style={{ color: theme.textColor }}>
          {(block.props.content as string) || ''}
        </p>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div key={block.id} style={mergedStyle}>
        <img
          src={(block.props.src as string) || '/placeholder.svg?height=200&width=400'}
          alt={(block.props.alt as string) || 'Image'}
          className="w-full h-auto block"
          crossOrigin="anonymous"
        />
      </div>
    );
  }

  if (block.type === 'button') {
    const variant = (block.props.variant as string) || theme.buttonStyle;
    return (
      <div key={block.id} style={mergedStyle}>
        <a
          href={(block.props.url as string) || '#'}
          className="inline-block px-5 py-2 text-sm font-medium no-underline transition-opacity hover:opacity-80"
          style={{
            backgroundColor: variant === 'outline' ? 'transparent' : theme.accentColor,
            color: variant === 'outline' ? theme.accentColor : '#fff',
            border: variant === 'outline' ? `2px solid ${theme.accentColor}` : 'none',
            borderRadius: `${theme.buttonRadius}px`,
          }}
        >
          {(block.props.label as string) || 'Button'}
        </a>
      </div>
    );
  }

  if (block.type === 'link') {
    return (
      <div key={block.id} style={mergedStyle}>
        <a
          href={(block.props.url as string) || '#'}
          className="text-sm underline transition-opacity hover:opacity-70"
          style={{ color: theme.accentColor }}
        >
          {(block.props.text as string) || 'Link'}
        </a>
      </div>
    );
  }

  if (block.type === 'spacer') {
    return <div key={block.id} style={{ height: (block.props.height as string) || '40px', ...mergedStyle }} />;
  }

  if (block.type === 'divider') {
    return (
      <div key={block.id} style={mergedStyle}>
        <hr style={{ borderTopWidth: (block.props.thickness as string) || '1px', borderColor: (block.props.color as string) || theme.textColor + '20' }} />
      </div>
    );
  }

  return null;
}

function renderRow(row: RowNode, theme: ThemeSettings) {
  return (
    <div key={row.id} style={{ ...row.style }}>
      <div className="flex flex-wrap">
        {row.columns.map((col) => (
          <div key={col.id} style={{ width: col.width, ...col.style }} className="min-w-0">
            <div className="flex flex-col gap-2">
              {col.children.map((b) => renderBlock(b, theme))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────
export function SitePublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [record, setRecord] = useState<PublishedRecord | null>(null);
  const [doc, setDoc] = useState<PageDocument | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const rec = publishApi.getPublishedBySlug(slug);
    if (!rec || rec.type !== 'page') {
      setNotFound(true);
      return;
    }
    setRecord(rec);
    setDocMeta(rec);
    analyticsApi.trackView(slug);

    const page = pageApi.getById(rec.sourceId);
    if (page) setDoc(page);
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#fafafa', color: '#1a1a1a' }}>
        <p className="text-7xl font-bold opacity-10">404</p>
        <p className="text-base mt-2">This page is not published or does not exist.</p>
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bgColor, color: theme.textColor, fontFamily: theme.fontFamily, fontSize: `${theme.baseFontSize}px` }}
    >
      <main className="max-w-5xl mx-auto">
        {doc.tree.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p style={{ color: theme.textColor, opacity: 0.5, fontSize: '14px' }}>This page has no content.</p>
          </div>
        ) : (
          doc.tree.map((r) => renderRow(r, theme))
        )}
      </main>
    </div>
  );
}
