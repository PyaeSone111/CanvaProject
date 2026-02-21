import { Eye, EyeOff, Lock, Unlock, Trash2, Square, Circle, Type, ImageIcon, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { CanvasObject } from '@/types';

interface LayersPanelProps {
  objects: CanvasObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder?: (newObjects: CanvasObject[]) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  rect: Square,
  circle: Circle,
  text: Type,
  image: ImageIcon,
};

function SortableLayerItem({
  obj,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onRemove,
}: {
  obj: CanvasObject;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: obj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  const Icon = typeIcons[obj.type] || Square;
  const isHidden = obj.visible === false;
  const isLocked = obj.locked === true;

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-sm cursor-pointer transition-colors group',
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
        isHidden && 'opacity-50'
      )}
    >
      <button
        type="button"
        className="h-5 w-5 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <Icon className="h-3.5 w-3.5 text-ar-memorize shrink-0" />
      <span className="truncate flex-1 text-xs">{obj.name}</span>
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          aria-label={isHidden ? 'Show layer' : 'Hide layer'}
        >
          {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          aria-label={isLocked ? 'Unlock layer' : 'Lock layer'}
        >
          {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Delete layer"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function LayersPanel({
  objects,
  selectedId,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onRemove,
  onReorder,
}: LayersPanelProps) {
  // Render in reverse so top-most layer appears first
  const reversed = [...objects].reverse();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = reversed.findIndex((o) => o.id === active.id);
    const newIndex = reversed.findIndex((o) => o.id === over.id);
    const newReversed = arrayMove(reversed, oldIndex, newIndex);
    // Convert back from reversed to normal order
    onReorder([...newReversed].reverse());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Layers ({objects.length})
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 flex flex-col gap-0.5">
          {reversed.length === 0 && (
            <p className="text-xs text-muted-foreground p-3 text-center">
              No layers. Add elements from the Add panel.
            </p>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={reversed.map((o) => o.id)} strategy={verticalListSortingStrategy}>
              {reversed.map((obj) => (
                <SortableLayerItem
                  key={obj.id}
                  obj={obj}
                  isSelected={selectedId === obj.id}
                  onSelect={() => onSelect(selectedId === obj.id ? null : obj.id)}
                  onToggleVisibility={() => onToggleVisibility(obj.id)}
                  onToggleLock={() => onToggleLock(obj.id)}
                  onRemove={() => onRemove(obj.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
}
