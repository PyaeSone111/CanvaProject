import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { RowNode, BlockNode } from '@/types';

interface PageCanvasProps {
  tree: RowNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string, type: 'row' | 'column' | 'block') => void;
  zoom: number;
}

function renderBlock(block: BlockNode, isSelected: boolean, onSelect: () => void) {
  const selectionClass = cn(
    'transition-all cursor-pointer rounded',
    isSelected
      ? 'ring-2 ring-blue-500 ring-offset-1'
      : 'hover:ring-1 hover:ring-blue-300'
  );

  if (block.type === 'text') {
    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={selectionClass}
        style={{ ...block.style }}
      >
        <p className="whitespace-pre-wrap">
          {(block.props.content as string) || 'Text block'}
        </p>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={cn(selectionClass, 'overflow-hidden')}
        style={{ ...block.style }}
      >
        <img
          src={(block.props.src as string) || '/placeholder.svg?height=200&width=400'}
          alt={(block.props.alt as string) || 'Image'}
          className="w-full h-auto block"
          crossOrigin="anonymous"
        />
      </div>
    );
  }

  if (block.type === 'button') {
    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={selectionClass}
        style={{ ...block.style }}
      >
        <span className="inline-block px-5 py-2 rounded-md bg-ar-iron text-[#ADB3BC] text-sm font-medium cursor-pointer">
          {(block.props.label as string) || 'Button'}
        </span>
      </div>
    );
  }

  if (block.type === 'link') {
    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={selectionClass}
        style={{ ...block.style }}
      >
        <span className="text-sm underline text-ar-metal cursor-pointer">
          {(block.props.text as string) || 'Link'}
        </span>
      </div>
    );
  }

  if (block.type === 'spacer') {
    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={cn(selectionClass, 'bg-muted/30 border border-dashed border-ar-cloud/30')}
        style={{ height: (block.props.height as string) || '40px', ...block.style }}
      >
        <span className="sr-only">Spacer</span>
      </div>
    );
  }

  if (block.type === 'divider') {
    return (
      <div
        key={block.id}
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        className={selectionClass}
        style={{ ...block.style }}
      >
        <hr
          style={{
            borderTopWidth: (block.props.thickness as string) || '1px',
            borderColor: (block.props.color as string) || '#E5E7EB',
          }}
        />
      </div>
    );
  }

  return null;
}

export function PageCanvas({ tree, selectedNodeId, onSelectNode, zoom }: PageCanvasProps) {
  const scale = zoom / 100;

  return (
    <div className="flex-1 overflow-auto bg-muted/30 flex justify-center p-6">
      <div
        className="w-full max-w-4xl bg-background shadow-lg rounded-lg overflow-hidden"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        <ScrollArea className="h-full">
          <div className="min-h-[400px]">
            {tree.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-sm text-muted-foreground">
                  Add a row to start building your page.
                </p>
              </div>
            )}
            {tree.map((row) => {
              const isRowSelected = selectedNodeId === row.id;
              return (
                <div
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectNode(row.id, 'row')}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelectNode(row.id, 'row'); }}
                  className={cn(
                    'transition-all cursor-pointer border-2 border-transparent',
                    isRowSelected
                      ? 'border-ar-memorize bg-ar-cloud/5'
                      : 'hover:border-ar-cloud/30'
                  )}
                  style={{ ...row.style }}
                >
                  <div className="flex gap-0">
                    {row.columns.map((col) => {
                      const isColSelected = selectedNodeId === col.id;
                      return (
                        <div
                          key={col.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNode(col.id, 'column');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onSelectNode(col.id, 'column');
                          }}
                          className={cn(
                            'min-h-[60px] transition-all border border-transparent',
                            isColSelected
                              ? 'border-ar-bay bg-ar-cloud/5'
                              : 'hover:border-ar-cloud/20'
                          )}
                          style={{ width: col.width, ...col.style }}
                        >
                          {col.children.length === 0 && (
                            <div className="flex items-center justify-center h-full min-h-[60px]">
                              <p className="text-xs text-muted-foreground">
                                Drop blocks here
                              </p>
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            {col.children.map((block) =>
                              renderBlock(
                                block,
                                selectedNodeId === block.id,
                                () => onSelectNode(block.id, 'block')
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
