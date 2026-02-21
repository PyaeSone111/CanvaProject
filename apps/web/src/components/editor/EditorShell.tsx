import { useEffect, useCallback, type ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EditorTopBar } from './EditorTopBar';
import { ZoomControls } from './ZoomControls';
import { Plus, Layers, FolderOpen } from 'lucide-react';

interface EditorShellProps {
  // Top bar
  title: string;
  onTitleChange: (title: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onExport?: () => void;
  onShowShortcuts?: () => void;

  // Zoom
  zoom: number;
  onZoomChange: (zoom: number) => void;

  // Panels
  addPanel: ReactNode;
  layersPanel: ReactNode;
  assetsPanel?: ReactNode;
  propertiesPanel: ReactNode;

  // Delete selected element
  onDelete?: () => void;

  // Canvas
  children: ReactNode;

  // Autosave
  onAutoSave: () => void;
}

export function EditorShell({
  title,
  onTitleChange,
  isSaving,
  lastSaved,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onPreview,
  onPublish,
  onExport,
  onShowShortcuts,
  zoom,
  onZoomChange,
  addPanel,
  layersPanel,
  assetsPanel,
  propertiesPanel,
  onDelete,
  children,
  onAutoSave,
}: EditorShellProps) {
  // Autosave every 10 seconds
  useEffect(() => {
    const interval = setInterval(onAutoSave, 10000);
    return () => clearInterval(interval);
  }, [onAutoSave]);

  // Save on window blur
  useEffect(() => {
    const handleBlur = () => onAutoSave();
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [onAutoSave]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }
      if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        onRedo();
      }
      if (mod && e.key === 's') {
        e.preventDefault();
        onAutoSave();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && onDelete) {
        // Don't delete if user is typing in an input/textarea
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !(e.target as HTMLElement).isContentEditable) {
          e.preventDefault();
          onDelete();
        }
      }
      if (e.key === '?' && onShowShortcuts) {
        e.preventDefault();
        onShowShortcuts();
      }
    },
    [onUndo, onRedo, onAutoSave, onShowShortcuts, onDelete]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Top bar */}
        <EditorTopBar
          title={title}
          onTitleChange={onTitleChange}
          isSaving={isSaving}
          lastSaved={lastSaved}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onPreview={onPreview}
          onPublish={onPublish}
          onExport={onExport}
          onShowShortcuts={onShowShortcuts}
        />

        {/* Main area: left panel + canvas + right panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel */}
          <aside className="w-64 border-r bg-background flex flex-col shrink-0">
            <Tabs defaultValue="add" className="flex flex-col h-full">
              <TabsList className="w-full rounded-none border-b h-10 bg-transparent justify-start px-2">
                <TabsTrigger value="add" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </TabsTrigger>
                <TabsTrigger value="layers" className="gap-1 text-xs">
                  <Layers className="h-3.5 w-3.5" />
                  Layers
                </TabsTrigger>
                <TabsTrigger value="assets" className="gap-1 text-xs">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Assets
                </TabsTrigger>
              </TabsList>
              <TabsContent value="add" className="flex-1 overflow-auto m-0">
                <ScrollArea className="h-full">{addPanel}</ScrollArea>
              </TabsContent>
              <TabsContent value="layers" className="flex-1 overflow-hidden m-0">
                {layersPanel}
              </TabsContent>
              <TabsContent value="assets" className="flex-1 overflow-hidden m-0">
                {assetsPanel || (
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">
                      Asset uploads coming soon. Use the Add panel to insert placeholder elements.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </aside>

          {/* Center canvas area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}

            <Separator />

            {/* Zoom controls */}
            <ZoomControls zoom={zoom} onZoomChange={onZoomChange} />
          </div>

          {/* Right panel */}
          <aside className="w-72 border-l bg-background flex flex-col shrink-0">
            <div className="h-10 border-b flex items-center px-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Properties
              </p>
            </div>
            <div className="flex-1 overflow-hidden">{propertiesPanel}</div>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}
