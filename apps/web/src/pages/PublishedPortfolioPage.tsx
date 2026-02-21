import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { cn } from '@/lib/utils';
import type { SectionBlock } from '@/types';

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
          {(section.content.subheading as string) || ''}
        </p>
      </section>
    );
  }

  if (section.type === 'text') {
    return (
      <section key={section.id} className="py-12 px-8 max-w-3xl mx-auto" style={section.style}>
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
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

export function PublishedPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const store = usePortfolioStore();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = store.documents.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!doc.published) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-3">
        <p className="text-base">This portfolio is not published.</p>
        <p className="text-sm text-muted-foreground">The author has not made this portfolio publicly available.</p>
      </div>
    );
  }

  const activePage = doc.pages[activeIdx] || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Portfolio nav */}
      {doc.pages.length > 1 && (
        <nav className="sticky top-0 z-50 h-11 border-b bg-background/95 backdrop-blur flex items-center justify-center gap-1 px-4" aria-label="Portfolio navigation">
          {doc.pages.map((page, i) => (
            <button
              key={page.id}
              onClick={() => setActiveIdx(i)}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
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

      <main>
        {activePage ? (
          activePage.sections.map(renderSection)
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground">No content.</p>
          </div>
        )}
      </main>
    </div>
  );
}
