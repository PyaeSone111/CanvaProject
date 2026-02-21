import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SectionBlock, PortfolioPage } from '@/types';

function renderSection(section: SectionBlock) {
  if (section.type === 'hero') {
    const bg = (section.content.backgroundUrl as string) || '';
    return (
      <section
        key={section.id}
        className="relative flex flex-col items-center justify-center text-center py-24 px-8"
        style={{
          backgroundColor: bg ? undefined : '#1C222D',
          backgroundImage: bg ? `url(${bg})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...section.style,
        }}
      >
        {bg && <div className="absolute inset-0 bg-black/40" />}
        <h1 className="relative text-4xl font-bold text-[#ADB3BC]">
          {(section.content.heading as string) || 'Hero Heading'}
        </h1>
        <p className="relative mt-3 text-base text-[#9199A4] max-w-xl">
          {(section.content.subheading as string) || 'Subheading text'}
        </p>
      </section>
    );
  }

  if (section.type === 'text') {
    return (
      <section key={section.id} className="py-12 px-8 max-w-3xl mx-auto" style={section.style}>
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {(section.content.body as string) || 'Text content goes here.'}
        </p>
      </section>
    );
  }

  if (section.type === 'gallery') {
    const cols = (section.content.columns as number) || 3;
    const images = (section.content.images as string[]) || [];
    const count = Math.max(images.length, cols);
    return (
      <section key={section.id} className="py-12 px-8 max-w-5xl mx-auto" style={section.style}>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {images[i] ? (
                <img src={images[i]} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-xs text-muted-foreground">Placeholder</span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === 'cta') {
    return (
      <section key={section.id} className="py-16 px-8 bg-ar-iron text-center" style={section.style}>
        <h2 className="text-2xl font-semibold text-[#ADB3BC]">
          {(section.content.heading as string) || 'Call to Action'}
        </h2>
        <div className="mt-5">
          <a
            href={(section.content.buttonUrl as string) || '#'}
            className="inline-block px-8 py-3 rounded-md bg-ar-metal text-[#ADB3BC] text-sm font-medium no-underline hover:bg-ar-bay transition-colors"
          >
            {(section.content.buttonText as string) || 'Click Me'}
          </a>
        </div>
      </section>
    );
  }

  if (section.type === 'columns') {
    const items = (section.content.items as { title: string; body: string }[]) || [];
    return (
      <section key={section.id} className="py-12 px-8 max-w-5xl mx-auto" style={section.style}>
        <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

export function PortfolioPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = usePortfolioStore();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = store.documents.find((d) => d.id === id);

  useEffect(() => {
    if (store.documents.length > 0 && id && !doc) {
      navigate('/dashboard?tab=portfolios', { replace: true });
    }
  }, [store.documents, id, doc, navigate]);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    );
  }

  const activePage = doc.pages[activeIdx] || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Preview toolbar */}
      <div className="sticky top-0 z-50 h-11 border-b bg-background/95 backdrop-blur flex items-center px-4 gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => navigate(`/editor/portfolio/${doc.id}`)}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Editor
        </Button>
        <div className="flex-1" />

        {/* Page nav tabs */}
        {doc.pages.length > 1 && (
          <nav className="flex gap-1" aria-label="Portfolio pages">
            {doc.pages.map((page, i) => (
              <button
                key={page.id}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                  i === activeIdx
                    ? 'bg-ar-iron text-[#ADB3BC]'
                    : 'text-muted-foreground hover:bg-accent'
                )}
              >
                {page.title}
              </button>
            ))}
          </nav>
        )}

        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">Preview: {doc.name}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => navigate(`/editor/portfolio/${doc.id}`)}
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </div>

      {/* Rendered page */}
      <main>
        {activePage ? (
          activePage.sections.length > 0 ? (
            activePage.sections.map(renderSection)
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-sm text-muted-foreground">This page has no sections.</p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground">No pages in this portfolio.</p>
          </div>
        )}
      </main>
    </div>
  );
}
