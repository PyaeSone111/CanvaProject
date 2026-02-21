import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDesignStore } from '@/stores/designStore';
import type { CanvasObject } from '@/types';

function renderObject(obj: CanvasObject) {
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
        style={baseStyle}
      >
        {obj.src ? (
          <img src={obj.src} alt={obj.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
        ) : (
          <span className="text-xs text-muted-foreground">Image</span>
        )}
      </div>
    );
  }
  return null;
}

export function PublishedDesignPage() {
  const { id } = useParams<{ id: string }>();
  const store = useDesignStore();

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doc = store.documents.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-ar-dark">
        <p className="text-[#777E89]">Loading...</p>
      </div>
    );
  }

  if (!doc.published) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-ar-dark gap-3">
        <p className="text-base text-[#ADB3BC]">This design is not published.</p>
        <p className="text-sm text-[#777E89]">The author has not made this design publicly available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ar-dark flex flex-col items-center justify-center p-8">
      <div
        className="relative shadow-2xl bg-background"
        style={{ width: doc.width, height: doc.height, maxWidth: '100%' }}
      >
        <div className="relative w-full h-full" style={{ width: doc.width, height: doc.height }}>
          {doc.objects.map(renderObject)}
        </div>
      </div>
      <p className="mt-4 text-xs text-[#5B636E]">{doc.name}</p>
    </div>
  );
}
