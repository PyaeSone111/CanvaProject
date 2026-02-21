import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { PortfolioPage } from '@/types';

interface PortfolioPageListProps {
  pages: PortfolioPage[];
  activePageId: string | null;
  onSelectPage: (id: string) => void;
  onAddPage: (title: string) => void;
  onRemovePage: (id: string) => void;
  onUpdatePageTitle: (id: string, title: string) => void;
}

export function PortfolioPageList({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onRemovePage,
  onUpdatePageTitle,
}: PortfolioPageListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    const title = newTitle.trim() || 'New Page';
    onAddPage(title);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleRename = (id: string) => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onUpdatePageTitle(id, trimmed);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Pages ({pages.length})
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only">Add page</span>
        </Button>
      </div>

      {isAdding && (
        <div className="px-3 pb-2">
          <div className="flex gap-1">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              placeholder="Page title..."
              className="h-7 text-xs"
              autoFocus
            />
            <Button size="sm" className="h-7 px-2 text-xs" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      )}

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-0.5">
          {pages.map((page, idx) => {
            const isActive = activePageId === page.id;
            const isEditing = editingId === page.id;

            return (
              <div
                key={page.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectPage(page.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectPage(page.id);
                }}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors group',
                  isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                )}
              >
                <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 cursor-grab" />
                <span className="text-xs text-muted-foreground w-4 shrink-0">
                  {idx + 1}
                </span>
                {isEditing ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleRename(page.id)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') handleRename(page.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 text-xs flex-1"
                    autoFocus
                  />
                ) : (
                  <span
                    className="truncate flex-1 text-xs"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(page.id);
                      setEditValue(page.title);
                    }}
                  >
                    {page.title}
                  </span>
                )}
                {pages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePage(page.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
