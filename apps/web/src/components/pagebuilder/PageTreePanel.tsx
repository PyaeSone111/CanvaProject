import { Rows3, Columns3, Type, ImageIcon, MousePointerClick, Link2, ArrowUpDown, Minus, Trash2, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
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
import type { RowNode, BlockNode } from '@/types';

const blockIcons: Record<string, React.ElementType> = {
  text: Type,
  image: ImageIcon,
  button: MousePointerClick,
  link: Link2,
  spacer: ArrowUpDown,
  divider: Minus,
};

interface PageTreePanelProps {
  tree: RowNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string, type: 'row' | 'column' | 'block') => void;
  onRemoveRow: (rowId: string) => void;
  onRemoveColumn: (rowId: string, colId: string) => void;
  onRemoveBlock: (rowId: string, colId: string, blockId: string) => void;
  onReorderRows?: (newRows: RowNode[]) => void;
}

function SortableRowItem({
  row,
  rowIdx,
  selectedNodeId,
  onSelectNode,
  onRemoveRow,
  onRemoveColumn,
  onRemoveBlock,
}: {
  row: RowNode;
  rowIdx: number;
  selectedNodeId: string | null;
  onSelectNode: (id: string, type: 'row' | 'column' | 'block') => void;
  onRemoveRow: (rowId: string) => void;
  onRemoveColumn: (rowId: string, colId: string) => void;
  onRemoveBlock: (rowId: string, colId: string, blockId: string) => void;
}) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [expandedCols, setExpandedCols] = useState<Record<string, boolean>>({});

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  const toggleRow = (id: string) => {
    setExpandedRows((p) => ({ ...p, [id]: !p[id] }));
  };
  const toggleCol = (id: string) => {
    setExpandedCols((p) => ({ ...p, [id]: !p[id] }));
  };

  const isRowExpanded = expandedRows[row.id] !== false;
  const isRowSelected = selectedNodeId === row.id;

  return (
    <div ref={setNodeRef} style={style}>
      {/* Row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectNode(row.id, 'row')}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelectNode(row.id, 'row'); }}
        className={cn(
          'flex items-center gap-1 rounded-md px-1.5 py-1 text-xs cursor-pointer transition-colors group',
          isRowSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
        )}
      >
        <button
          type="button"
          className="h-4 w-4 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}
          className="h-4 w-4 flex items-center justify-center shrink-0"
        >
          {isRowExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <Rows3 className="h-3 w-3 text-ar-memorize shrink-0" />
        <span className="truncate flex-1">Row {rowIdx + 1}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); onRemoveRow(row.id); }}
        >
          <Trash2 className="h-2.5 w-2.5" />
        </Button>
      </div>

      {/* Columns */}
      {isRowExpanded && row.columns.map((col, colIdx) => {
        const isColExpanded = expandedCols[col.id] !== false;
        const isColSelected = selectedNodeId === col.id;

        return (
          <div key={col.id} className="ml-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectNode(col.id, 'column')}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectNode(col.id, 'column'); }}
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-1 text-xs cursor-pointer transition-colors group',
                isColSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
              )}
            >
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleCol(col.id); }}
                className="h-4 w-4 flex items-center justify-center shrink-0"
              >
                {isColExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              <Columns3 className="h-3 w-3 text-ar-bay shrink-0" />
              <span className="truncate flex-1">Column {colIdx + 1} ({col.width})</span>
              {row.columns.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onRemoveColumn(row.id, col.id); }}
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>

            {/* Blocks */}
            {isColExpanded && col.children.map((block) => {
              const BlockIcon = blockIcons[block.type] || Type;
              const isBlockSelected = selectedNodeId === block.id;
              return (
                <div
                  key={block.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectNode(block.id, 'block')}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectNode(block.id, 'block'); }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-1.5 py-1 ml-5 text-xs cursor-pointer transition-colors group',
                    isBlockSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                  )}
                >
                  <BlockIcon className="h-3 w-3 text-ar-cloud shrink-0" />
                  <span className="truncate flex-1 capitalize">{block.type}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); onRemoveBlock(row.id, col.id, block.id); }}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function PageTreePanel({
  tree,
  selectedNodeId,
  onSelectNode,
  onRemoveRow,
  onRemoveColumn,
  onRemoveBlock,
  onReorderRows,
}: PageTreePanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorderRows) return;
    const oldIndex = tree.findIndex((r) => r.id === active.id);
    const newIndex = tree.findIndex((r) => r.id === over.id);
    onReorderRows(arrayMove(tree, oldIndex, newIndex));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Page Tree
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 flex flex-col gap-0.5">
          {tree.length === 0 && (
            <p className="text-xs text-muted-foreground p-3 text-center">
              No rows yet. Add a row from the Add panel.
            </p>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tree.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              {tree.map((row, rowIdx) => (
                <SortableRowItem
                  key={row.id}
                  row={row}
                  rowIdx={rowIdx}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={onSelectNode}
                  onRemoveRow={onRemoveRow}
                  onRemoveColumn={onRemoveColumn}
                  onRemoveBlock={onRemoveBlock}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
}
