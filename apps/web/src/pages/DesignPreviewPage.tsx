import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Download } from 'lucide-react';
import { useDesignStore } from '@/stores/designStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CanvasObject } from '@/types';

function renderPreviewObject(obj: CanvasObject) {
  if (obj.visible === false) return null;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: obj.x,
    top: obj.y,
    width: obj.width,
    height: obj.height,
    opacity: obj.opacity,
    transform: `rotate(${obj.rotation}deg)`,
  };

  if (obj.type === 'rect') {
    return (
      <div
        key={obj.id}
        className="rounded-sm"
        style={{
          ...baseStyle,
          backgroundColor: obj.fill,
          border: obj.strokeWidth ? `${obj.strokeWidth}px solid ${obj.stroke}` : undefined,
        }}
      />
    );
  }

  if (obj.type === 'circle') {
    return (
      <div
        key={obj.id}
        className="rounded-full"
        style={{
          ...baseStyle,
          backgroundColor: obj.fill,
          border: obj.strokeWidth ? `${obj.strokeWidth}px solid ${obj.stroke}` : undefined,
        }}
      />
    );
  }

  if (obj.type === 'text') {
    return (
      <div
        key={obj.id}
        className="flex items-center justify-center"
        style={{
          ...baseStyle,
          color: obj.fill,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
        }}
      >
        {obj.text}
      </div>
    );
  }

  if (obj.type === 'image') {
    return (
      <div
        key={obj.id}
        className="overflow-hidden bg-muted flex items-center justify-center"
        style={{
          ...baseStyle,
          border: obj.strokeWidth ? `${obj.strokeWidth}px solid ${obj.stroke}` : undefined,
        }}
      >
        {obj.src ? (
          <img
            src={obj.src}
            alt={obj.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <span className="text-xs text-muted-foreground">Image</span>
        )}
      </div>
    );
  }

  return null;
}

export function DesignPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useDesignStore();

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = store.documents.find((d) => d.id === id);

  useEffect(() => {
    if (store.documents.length > 0 && id && !doc) {
      navigate('/dashboard', { replace: true });
    }
  }, [store.documents, id, doc, navigate]);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-ar-dark">
        <p className="text-[#9199A4]">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ar-dark">
      {/* Preview toolbar */}
      <div className="sticky top-0 z-50 h-11 border-b border-ar-iron bg-ar-dark/95 backdrop-blur flex items-center px-4 gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-[#ADB3BC] hover:text-[#ADB3BC] hover:bg-ar-iron"
          onClick={() => navigate(`/editor/design/${doc.id}`)}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Editor
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-[#777E89]">
          Preview: {doc.name} ({doc.width} x {doc.height})
        </span>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-[#ADB3BC] hover:text-[#ADB3BC] hover:bg-ar-iron"
          onClick={() => navigate(`/editor/design/${doc.id}`)}
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </div>

      {/* Canvas centered */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <div
          className="relative shadow-2xl bg-background rounded-sm"
          style={{ width: doc.width, height: doc.height }}
        >
          <div className="relative w-full h-full">
            {doc.objects.map(renderPreviewObject)}
          </div>
        </div>
      </div>
    </div>
  );
}
