import { GripVertical, Trash2, Layout, ImageIcon, Type, MousePointerClick, Columns3 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SectionBlock } from '@/types';

const sectionIcons: Record<string, React.ElementType> = {
  hero: Layout,
  gallery: ImageIcon,
  text: Type,
  cta: MousePointerClick,
  columns: Columns3,
};

const sectionLabels: Record<string, string> = {
  hero: 'Hero',
  gallery: 'Gallery',
  text: 'Text Block',
  cta: 'Call to Action',
  columns: 'Columns',
};

interface SectionCardProps {
  section: SectionBlock;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function SectionCard({ section, isSelected, onSelect, onRemove }: SectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  const Icon = sectionIcons[section.type] || Type;
  const label = sectionLabels[section.type] || section.type;

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
        'group relative flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all',
        isSelected
          ? 'border-ar-metal bg-accent ring-1 ring-ar-metal/30'
          : 'border-border hover:border-ar-cloud hover:bg-muted/50'
      )}
    >
      <button
        type="button"
        className="h-5 w-5 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div
        className={cn(
          'h-9 w-9 rounded-md flex items-center justify-center shrink-0',
          isSelected ? 'bg-ar-iron text-[#ADB3BC]' : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        <p className="text-xs text-muted-foreground truncate">
          {section.type === 'hero' && (section.content.heading as string)}
          {section.type === 'text' && (section.content.body as string)?.slice(0, 40)}
          {section.type === 'gallery' && `${(section.content.images as unknown[])?.length || 0} images`}
          {section.type === 'cta' && (section.content.buttonText as string)}
          {section.type === 'columns' && `${(section.content.items as unknown[])?.length || 0} columns`}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
