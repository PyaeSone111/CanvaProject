import { useEffect, useRef, useCallback } from 'react';
import { Upload, Search, Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { useAssetStore } from '@/stores/assetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { AssetItem } from '@/types';

interface AssetsPanelProps {
  onInsertAsset?: (asset: AssetItem) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AssetsPanel({ onInsertAsset }: AssetsPanelProps) {
  const store = useAssetStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      for (let i = 0; i < files.length; i++) {
        await store.upload(files[i]);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [store]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          await store.upload(files[i]);
        }
      }
    },
    [store]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const filtered = store.filteredAssets();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Assets
        </p>

        {/* Upload zone */}
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors hover:border-ar-memorize hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fileInputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload files"
        >
          {store.isUploading ? (
            <Loader2 className="h-6 w-6 text-ar-memorize animate-spin" />
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
          <p className="text-xs text-muted-foreground text-center">
            {store.isUploading ? 'Uploading...' : 'Drop images here or click to upload'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={store.searchQuery}
            onChange={(e) => store.setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <Separator />

      {/* Asset grid */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {store.searchQuery ? 'No assets match your search.' : 'No assets yet. Upload images to get started.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onInsert={onInsertAsset ? () => onInsertAsset(asset) : undefined}
                  onRemove={() => store.remove(asset.id)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function AssetCard({
  asset,
  onInsert,
  onRemove,
}: {
  asset: AssetItem;
  onInsert?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group relative rounded-md border overflow-hidden transition-all hover:ring-1 hover:ring-ar-memorize">
      {/* Thumbnail */}
      <div
        className={cn(
          'aspect-square bg-muted flex items-center justify-center overflow-hidden cursor-pointer'
        )}
        onClick={onInsert}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onInsert) onInsert();
        }}
        role={onInsert ? 'button' : undefined}
        tabIndex={onInsert ? 0 : undefined}
        aria-label={onInsert ? `Insert ${asset.name}` : undefined}
      >
        <img
          src={asset.thumbnailUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>

      {/* Info */}
      <div className="p-1.5">
        <p className="text-[10px] font-medium truncate" title={asset.name}>
          {asset.name}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {asset.width}x{asset.height} &middot; {formatFileSize(asset.size)}
        </p>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive hover:bg-background/90"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Remove ${asset.name}`}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
