import { Type, ImageIcon, MousePointerClick, Link2, ArrowUpDown, Minus, Plus, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { BlockType } from '@/types';

const blockTypes: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'button', label: 'Button', icon: MousePointerClick },
  { type: 'link', label: 'Link', icon: Link2 },
  { type: 'spacer', label: 'Spacer', icon: ArrowUpDown },
  { type: 'divider', label: 'Divider', icon: Minus },
];

interface AddBlockPanelProps {
  /** Callback to add a new row */
  onAddRow: () => void;
  /** Callback to add a column to the selected row */
  onAddColumn?: () => void;
  /** Callback to add a block. We need the user to pick target row/col, so this is optional */
  selectedRowId: string | null;
  selectedColId: string | null;
  onAddBlock: (type: BlockType) => void;
}

export function AddBlockPanel({
  onAddRow,
  onAddColumn,
  selectedRowId,
  selectedColId,
  onAddBlock,
}: AddBlockPanelProps) {
  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Structure */}
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Structure
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={onAddRow}>
          <Plus className="h-3.5 w-3.5" />
          Row
        </Button>
        {onAddColumn && selectedRowId && (
          <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={onAddColumn}>
            <Columns3 className="h-3.5 w-3.5" />
            Column
          </Button>
        )}
      </div>

      <Separator />

      {/* Blocks */}
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Blocks
      </p>
      {!selectedRowId || !selectedColId ? (
        <p className="text-xs text-muted-foreground">
          Select a column on the canvas to add blocks into it.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {blockTypes.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant="outline"
              className="h-16 flex-col gap-1.5 text-xs"
              onClick={() => onAddBlock(type)}
            >
              <Icon className="h-5 w-5 text-ar-metal" />
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
