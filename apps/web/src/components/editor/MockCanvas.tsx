import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CanvasObject } from '@/types';

interface MockCanvasProps {
  width: number;
  height: number;
  objects: CanvasObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  zoom: number;
}

export function MockCanvas({
  width,
  height,
  objects,
  selectedId,
  onSelect,
  zoom,
}: MockCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; objX: number; objY: number } | null>(null);

  const scale = zoom / 100;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelect(null);
    }
  };

  const renderObject = (obj: CanvasObject) => {
    if (obj.visible === false) return null;
    const isSelected = selectedId === obj.id;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: obj.x,
      top: obj.y,
      width: obj.width,
      height: obj.height,
      opacity: obj.opacity,
      transform: `rotate(${obj.rotation}deg)`,
      cursor: obj.locked ? 'not-allowed' : 'move',
    };

    const selectionClass = isSelected
      ? 'ring-2 ring-blue-500 ring-offset-1'
      : 'hover:ring-1 hover:ring-blue-300';

    if (obj.type === 'rect') {
      return (
        <div
          key={obj.id}
          role="button"
          tabIndex={0}
          className={cn('rounded-sm', selectionClass)}
          style={{
            ...baseStyle,
            backgroundColor: obj.fill,
            border: `${obj.strokeWidth}px solid ${obj.stroke}`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(obj.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelect(obj.id);
          }}
          onMouseDown={(e) => {
            if (obj.locked) return;
            e.stopPropagation();
            setDragging({ id: obj.id, startX: e.clientX, startY: e.clientY, objX: obj.x, objY: obj.y });
          }}
        />
      );
    }

    if (obj.type === 'circle') {
      return (
        <div
          key={obj.id}
          role="button"
          tabIndex={0}
          className={cn('rounded-full', selectionClass)}
          style={{
            ...baseStyle,
            backgroundColor: obj.fill,
            border: `${obj.strokeWidth}px solid ${obj.stroke}`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(obj.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelect(obj.id);
          }}
          onMouseDown={(e) => {
            if (obj.locked) return;
            e.stopPropagation();
            setDragging({ id: obj.id, startX: e.clientX, startY: e.clientY, objX: obj.x, objY: obj.y });
          }}
        />
      );
    }

    if (obj.type === 'text') {
      return (
        <div
          key={obj.id}
          role="button"
          tabIndex={0}
          className={cn(selectionClass, 'flex items-center justify-center')}
          style={{
            ...baseStyle,
            color: obj.fill,
            fontSize: obj.fontSize,
            fontFamily: obj.fontFamily,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(obj.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelect(obj.id);
          }}
          onMouseDown={(e) => {
            if (obj.locked) return;
            e.stopPropagation();
            setDragging({ id: obj.id, startX: e.clientX, startY: e.clientY, objX: obj.x, objY: obj.y });
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
          role="button"
          tabIndex={0}
          className={cn(selectionClass, 'overflow-hidden bg-muted flex items-center justify-center')}
          style={{
            ...baseStyle,
            border: `${obj.strokeWidth}px solid ${obj.stroke}`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(obj.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSelect(obj.id);
          }}
          onMouseDown={(e) => {
            if (obj.locked) return;
            e.stopPropagation();
            setDragging({ id: obj.id, startX: e.clientX, startY: e.clientY, objX: obj.x, objY: obj.y });
          }}
        >
          <span className="text-xs text-muted-foreground">Image</span>
        </div>
      );
    }

    return null;
  };

  // Global mouse handlers for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    // We'll just visually update but don't persist here - this is the mock
    const el = canvasRef.current?.querySelector(`[data-obj-id="${dragging.id}"]`);
    if (el) {
      const dx = (e.clientX - dragging.startX) / scale;
      const dy = (e.clientY - dragging.startY) / scale;
      (el as HTMLElement).style.left = `${dragging.objX + dx}px`;
      (el as HTMLElement).style.top = `${dragging.objY + dy}px`;
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div
      className="flex-1 overflow-auto bg-muted/50 flex items-center justify-center p-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="relative shadow-lg bg-background"
        style={{
          width: width * scale,
          height: height * scale,
          backgroundImage:
            'linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          transform: `scale(1)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Scale wrapper for objects */}
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="relative"
        >
          {objects.map(renderObject)}
        </div>

        {/* Dimensions label */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
          {width} x {height} px
        </div>
      </div>
    </div>
  );
}
