import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { RowNode, ColumnNode, BlockNode } from '@/types';

interface BlockPropertiesPanelProps {
  selectedNodeId: string | null;
  selectedNodeType: 'row' | 'column' | 'block' | null;
  // Helper to find the node
  tree: RowNode[];
  onUpdateRow: (rowId: string, updates: Partial<RowNode>) => void;
  onUpdateColumn: (rowId: string, colId: string, updates: Partial<ColumnNode>) => void;
  onUpdateBlock: (rowId: string, colId: string, blockId: string, updates: Partial<BlockNode>) => void;
}

function findNodeContext(tree: RowNode[], nodeId: string): {
  row?: RowNode;
  col?: ColumnNode;
  block?: BlockNode;
  rowId?: string;
  colId?: string;
} {
  for (const row of tree) {
    if (row.id === nodeId) return { row, rowId: row.id };
    for (const col of row.columns) {
      if (col.id === nodeId) return { col, rowId: row.id, colId: col.id };
      for (const block of col.children) {
        if (block.id === nodeId) return { block, rowId: row.id, colId: col.id };
      }
    }
  }
  return {};
}

export function BlockPropertiesPanel({
  selectedNodeId,
  selectedNodeType,
  tree,
  onUpdateRow,
  onUpdateColumn,
  onUpdateBlock,
}: BlockPropertiesPanelProps) {
  if (!selectedNodeId || !selectedNodeType) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select a row, column, or block to edit its properties.
        </p>
      </div>
    );
  }

  const ctx = findNodeContext(tree, selectedNodeId);

  // Row properties
  if (selectedNodeType === 'row' && ctx.row && ctx.rowId) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 flex flex-col gap-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Row Settings
          </p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Padding</Label>
            <Input
              value={ctx.row.style.padding || ''}
              onChange={(e) =>
                onUpdateRow(ctx.rowId!, { style: { ...ctx.row!.style, padding: e.target.value } })
              }
              className="h-8 text-xs"
              placeholder="e.g. 24px 16px"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={ctx.row.style.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  onUpdateRow(ctx.rowId!, {
                    style: { ...ctx.row!.style, backgroundColor: e.target.value },
                  })
                }
                className="h-8 w-8 rounded cursor-pointer border"
              />
              <Input
                value={ctx.row.style.backgroundColor || ''}
                onChange={(e) =>
                  onUpdateRow(ctx.rowId!, {
                    style: { ...ctx.row!.style, backgroundColor: e.target.value },
                  })
                }
                className="h-8 text-xs flex-1"
                placeholder="#ffffff"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {ctx.row.columns.length} column(s) in this row.
          </p>
        </div>
      </ScrollArea>
    );
  }

  // Column properties
  if (selectedNodeType === 'column' && ctx.col && ctx.rowId && ctx.colId) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 flex flex-col gap-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Column Settings
          </p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Width</Label>
            <Input
              value={ctx.col.width}
              onChange={(e) =>
                onUpdateColumn(ctx.rowId!, ctx.colId!, { width: e.target.value })
              }
              className="h-8 text-xs"
              placeholder="e.g. 50% or 300px"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Padding</Label>
            <Input
              value={ctx.col.style.padding || ''}
              onChange={(e) =>
                onUpdateColumn(ctx.rowId!, ctx.colId!, {
                  style: { ...ctx.col!.style, padding: e.target.value },
                })
              }
              className="h-8 text-xs"
              placeholder="e.g. 8px"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {ctx.col.children.length} block(s) in this column.
          </p>
        </div>
      </ScrollArea>
    );
  }

  // Block properties
  if (selectedNodeType === 'block' && ctx.block && ctx.rowId && ctx.colId) {
    const block = ctx.block;
    const updateProps = (key: string, value: unknown) => {
      onUpdateBlock(ctx.rowId!, ctx.colId!, block.id, {
        props: { ...block.props, [key]: value },
      });
    };
    const updateStyle = (key: string, value: string) => {
      onUpdateBlock(ctx.rowId!, ctx.colId!, block.id, {
        style: { ...block.style, [key]: value },
      });
    };

    return (
      <ScrollArea className="h-full">
        <div className="p-4 flex flex-col gap-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {block.type} Block
          </p>

          {/* Text block */}
          {block.type === 'text' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Content</Label>
                <textarea
                  value={(block.props.content as string) || ''}
                  onChange={(e) => updateProps('content', e.target.value)}
                  className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-xs resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={5}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Font Size</Label>
                <Input
                  value={block.style.fontSize || ''}
                  onChange={(e) => updateStyle('fontSize', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g. 1rem"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Font Weight</Label>
                <Input
                  value={block.style.fontWeight || ''}
                  onChange={(e) => updateStyle('fontWeight', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g. bold, 600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={block.style.color || '#000000'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border"
                  />
                  <Input
                    value={block.style.color || ''}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image block */}
          {block.type === 'image' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Image URL</Label>
                <Input
                  value={(block.props.src as string) || ''}
                  onChange={(e) => updateProps('src', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="https://..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Alt Text</Label>
                <Input
                  value={(block.props.alt as string) || ''}
                  onChange={(e) => updateProps('alt', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}

          {/* Button block */}
          {block.type === 'button' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Label</Label>
                <Input
                  value={(block.props.label as string) || ''}
                  onChange={(e) => updateProps('label', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">URL</Label>
                <Input
                  value={(block.props.url as string) || ''}
                  onChange={(e) => updateProps('url', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}

          {/* Link block */}
          {block.type === 'link' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Text</Label>
                <Input
                  value={(block.props.text as string) || ''}
                  onChange={(e) => updateProps('text', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">URL</Label>
                <Input
                  value={(block.props.url as string) || ''}
                  onChange={(e) => updateProps('url', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}

          {/* Spacer block */}
          {block.type === 'spacer' && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Height</Label>
              <Input
                value={(block.props.height as string) || ''}
                onChange={(e) => updateProps('height', e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g. 40px"
              />
            </div>
          )}

          {/* Divider block */}
          {block.type === 'divider' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Thickness</Label>
                <Input
                  value={(block.props.thickness as string) || ''}
                  onChange={(e) => updateProps('thickness', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g. 1px"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(block.props.color as string) || '#E5E7EB'}
                    onChange={(e) => updateProps('color', e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border"
                  />
                  <Input
                    value={(block.props.color as string) || ''}
                    onChange={(e) => updateProps('color', e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Common style overrides */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Style Overrides
            </p>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Margin</Label>
              <Input
                value={block.style.margin || ''}
                onChange={(e) => updateStyle('margin', e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g. 0 0 16px 0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Padding</Label>
              <Input
                value={block.style.padding || ''}
                onChange={(e) => updateStyle('padding', e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g. 8px 16px"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return null;
}
