import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { Button } from '@/components/ui/button';
import type { RowNode, BlockNode } from '@/types';

function renderBlock(block: BlockNode) {
  if (block.type === 'text') {
    return (
      <div key={block.id} style={{ ...block.style }}>
        <p className="whitespace-pre-wrap">
          {(block.props.content as string) || ''}
        </p>
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
          className="inline-block px-5 py-2 rounded-md bg-ar-iron text-[#ADB3BC] text-sm font-medium no-underline"
        >
          {(block.props.label as string) || 'Button'}
        </a>
      </div>
    );
  }

  if (block.type === 'link') {
    return (
      <div key={block.id} style={{ ...block.style }}>
        <a
          href={(block.props.url as string) || '#'}
          className="text-sm underline text-ar-metal"
        >
          {(block.props.text as string) || 'Link'}
        </a>
      </div>
    );
  }

  if (block.type === 'spacer') {
    return (
      <div
        key={block.id}
        style={{ height: (block.props.height as string) || '40px', ...block.style }}
      />
    );
  }

  if (block.type === 'divider') {
    return (
      <div key={block.id} style={{ ...block.style }}>
        <hr
          style={{
            borderTopWidth: (block.props.thickness as string) || '1px',
            borderColor: (block.props.color as string) || '#E5E7EB',
          }}
        />
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

export function PagePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = usePageBuilderStore();

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = store.documents.find((d) => d.id === id);

  useEffect(() => {
    if (store.documents.length > 0 && id && !doc) {
      navigate('/dashboard?tab=pages', { replace: true });
    }
  }, [store.documents, id, doc, navigate]);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview toolbar */}
      <div className="sticky top-0 z-50 h-10 border-b bg-background/95 backdrop-blur flex items-center px-4 gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => navigate(`/builder/page/${doc.id}`)}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Editor
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">
          Preview: {doc.name}
        </span>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => navigate(`/builder/page/${doc.id}`)}
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </div>

      {/* Rendered page */}
      <main className="max-w-5xl mx-auto">
        {doc.tree.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground">
              This page has no content yet.
            </p>
          </div>
        ) : (
          doc.tree.map(renderRow)
        )}
      </main>
    </div>
  );
}
