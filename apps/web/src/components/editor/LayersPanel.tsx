import { Eye, EyeOff, Lock, Unlock, Trash2, Square, Circle, Type, ImageIcon } from 'lucide-react';
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
}

const typeIcons: Record<string, React.ElementType> = {
  rect: Square,
  circle: Circle,
  text: Type,
  image: ImageIcon,
};

export function LayersPanel({
  objects,
  selectedId,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onRemove,
}: LayersPanelProps) {
  // Render in reverse so top-most layer appears first
  const reversed = [...objects].reverse();

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
          {reversed.map((obj) => {
            const Icon = typeIcons[obj.type] || Square;
            const isSelected = selectedId === obj.id;
            const isHidden = obj.visible === false;
            const isLocked = obj.locked === true;

            return (
              <div
                key={obj.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(isSelected ? null : obj.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(isSelected ? null : obj.id);
                  }
                }}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted',
                  isHidden && 'opacity-50'
                )}
              >
                <Icon className="h-3.5 w-3.5 text-ar-memorize shrink-0" />
                <span className="truncate flex-1 text-xs">{obj.name}</span>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(obj.id);
                    }}
                    aria-label={isHidden ? 'Show layer' : 'Hide layer'}
                  >
                    {isHidden ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(obj.id);
                    }}
                    aria-label={isLocked ? 'Unlock layer' : 'Lock layer'}
                  >
                    {isLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(obj.id);
                    }}
                    aria-label="Delete layer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
