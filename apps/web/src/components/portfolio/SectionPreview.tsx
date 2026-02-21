import { cn } from '@/lib/utils';
import type { SectionBlock } from '@/types';

interface SectionPreviewProps {
  section: SectionBlock;
  isSelected: boolean;
  onSelect: () => void;
}

export function SectionPreview({ section, isSelected, onSelect }: SectionPreviewProps) {
  const wrapperClass = cn(
    'transition-all cursor-pointer border-2 border-transparent rounded-lg',
    isSelected ? 'border-ar-metal ring-2 ring-ar-metal/20' : 'hover:border-ar-cloud/50'
  );

  if (section.type === 'hero') {
    const bg = (section.content.backgroundUrl as string) || '';
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={wrapperClass}
      >
        <div
          className="relative flex flex-col items-center justify-center text-center py-20 px-8 rounded-md"
          style={{
            backgroundColor: bg ? undefined : '#1C222D',
            backgroundImage: bg ? `url(${bg})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {bg && <div className="absolute inset-0 bg-black/40 rounded-md" />}
          <h2 className="relative text-3xl font-bold text-[#ADB3BC]">
            {(section.content.heading as string) || 'Hero Heading'}
          </h2>
          <p className="relative mt-2 text-sm text-[#9199A4]">
            {(section.content.subheading as string) || 'Subheading text'}
          </p>
        </div>
      </div>
    );
  }

  if (section.type === 'text') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={wrapperClass}
      >
        <div className="py-8 px-8 rounded-md bg-background">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {(section.content.body as string) || 'Text content goes here.'}
          </p>
        </div>
      </div>
    );
  }

  if (section.type === 'gallery') {
    const cols = (section.content.columns as number) || 3;
    const images = (section.content.images as string[]) || [];
    const placeholderCount = Math.max(images.length, cols);
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={wrapperClass}
      >
        <div className="py-8 px-8 rounded-md bg-background">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-muted flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground">
                  {images[i] ? 'Image' : 'Placeholder'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section.type === 'cta') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={wrapperClass}
      >
        <div className="py-12 px-8 rounded-md bg-ar-iron text-center">
          <h3 className="text-xl font-semibold text-[#ADB3BC]">
            {(section.content.heading as string) || 'Call to Action'}
          </h3>
          <div className="mt-4">
            <span className="inline-block px-6 py-2 rounded-md bg-ar-metal text-[#ADB3BC] text-sm font-medium">
              {(section.content.buttonText as string) || 'Click Me'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === 'columns') {
    const items = (section.content.items as { title: string; body: string }[]) || [];
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={wrapperClass}
      >
        <div className="py-8 px-8 rounded-md bg-background">
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
          >
            {items.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
      className={wrapperClass}
    >
      <div className="py-8 px-8 rounded-md bg-muted text-center">
        <p className="text-sm text-muted-foreground">Unknown section type: {section.type}</p>
      </div>
    </div>
  );
}
