import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import type { RowNode, BlockNode } from '@/types';

function renderBlock(block: BlockNode) {
  if (block.type === 'text') {
    return (
      <div key={block.id} style={{ ...block.style }}>
        <p className="whitespace-pre-wrap">{(block.props.content as string) || ''}</p>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div key={block.id} style={{ ...block.style }}>
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
    return (
      <div key={block.id} style={{ ...block.style }}>
        <a
          href={(block.props.url as string) || '#'}
          className="inline-block px-5 py-2 rounded-md bg-ar-iron text-[#ADB3BC] text-sm font-medium no-underline hover:bg-ar-metal transition-colors"
        >
          {(block.props.label as string) || 'Button'}
        </a>
      </div>
    );
  }

  if (block.type === 'link') {
    return (
      <div key={block.id} style={{ ...block.style }}>
        <a href={(block.props.url as string) || '#'} className="text-sm underline text-ar-metal hover:text-ar-bay">
          {(block.props.text as string) || 'Link'}
        </a>
      </div>
    );
  }

  if (block.type === 'spacer') {
    return <div key={block.id} style={{ height: (block.props.height as string) || '40px', ...block.style }} />;
  }

  if (block.type === 'divider') {
    return (
      <div key={block.id} style={{ ...block.style }}>
        <hr style={{ borderTopWidth: (block.props.thickness as string) || '1px', borderColor: (block.props.color as string) || '#E5E7EB' }} />
      </div>
    );
  }

  return null;
}

function renderRow(row: RowNode) {
  return (
    <div key={row.id} style={{ ...row.style }}>
      <div className="flex">
        {row.columns.map((col) => (
          <div key={col.id} style={{ width: col.width, ...col.style }}>
            <div className="flex flex-col gap-2">
              {col.children.map(renderBlock)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PublishedPagePage() {
  const { slug } = useParams<{ slug: string }>();
  const store = usePageBuilderStore();

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = store.documents.find((d) => d.slug === slug);

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
        <p className="text-base">This page is not published.</p>
        <p className="text-sm text-muted-foreground">The author has not made this page publicly available.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        {doc.tree.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground">This page has no content.</p>
          </div>
        ) : (
          doc.tree.map(renderRow)
        )}
      </div>
    </main>
  );
}
