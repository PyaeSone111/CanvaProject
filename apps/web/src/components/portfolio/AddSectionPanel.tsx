import { Layout, ImageIcon, Type, MousePointerClick, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SectionBlock } from '@/types';

const sectionTypes: { type: SectionBlock['type']; label: string; description: string; icon: React.ElementType }[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Large heading with optional background',
    icon: Layout,
  },
  {
    type: 'text',
    label: 'Text Block',
    description: 'Rich text content section',
    icon: Type,
  },
  {
    type: 'gallery',
    label: 'Gallery',
    description: 'Image grid with configurable columns',
    icon: ImageIcon,
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'Heading with a button link',
    icon: MousePointerClick,
  },
  {
    type: 'columns',
    label: 'Columns',
    description: 'Multi-column content layout',
    icon: Columns3,
  },
];

interface AddSectionPanelProps {
  onAdd: (type: SectionBlock['type']) => void;
}

export function AddSectionPanel({ onAdd }: AddSectionPanelProps) {
  return (
    <div className="p-3 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Add Section
      </p>
      <div className="flex flex-col gap-2">
        {sectionTypes.map(({ type, label, description, icon: Icon }) => (
          <Button
            key={type}
            variant="outline"
            className="h-auto py-3 px-3 flex items-start gap-3 justify-start text-left"
            onClick={() => onAdd(type)}
          >
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-ar-metal" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
