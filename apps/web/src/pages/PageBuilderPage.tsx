import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { EditorShell } from '@/components/editor/EditorShell';
import { AddBlockPanel } from '@/components/pagebuilder/AddBlockPanel';
import { PageTreePanel } from '@/components/pagebuilder/PageTreePanel';
import { BlockPropertiesPanel } from '@/components/pagebuilder/BlockPropertiesPanel';
import { PageCanvas } from '@/components/pagebuilder/PageCanvas';
import { PublishDialog } from '@/components/editor/PublishDialog';
import { ExportDialog } from '@/components/editor/ExportDialog';
import { KeyboardShortcutsDialog } from '@/components/editor/KeyboardShortcutsDialog';
import { downloadJson } from '@/lib/export';
import type { RowNode, BlockType } from '@/types';

export function PageBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = usePageBuilderStore();
  const [zoom, setZoom] = useState(100);
  const [publishOpen, setPublishOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    store.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      store.setCurrentId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const doc = store.currentDocument();

  useEffect(() => {
    if (store.documents.length > 0 && id && !doc) {
      navigate('/dashboard?tab=pages', { replace: true });
    }
  }, [store.documents, id, doc, navigate]);

  const handleAutoSave = useCallback(() => {
    store.autoSave();
  }, [store]);

  // Find the selected row/column IDs from the tree for the AddBlockPanel
  const selectedContext = useMemo(() => {
    if (!doc || !store.selectedNodeId) return { rowId: null, colId: null };
    for (const row of doc.tree) {
      if (row.id === store.selectedNodeId) {
        return { rowId: row.id, colId: row.columns[0]?.id || null };
      }
      for (const col of row.columns) {
        if (col.id === store.selectedNodeId) {
          return { rowId: row.id, colId: col.id };
        }
        for (const block of col.children) {
          if (block.id === store.selectedNodeId) {
            return { rowId: row.id, colId: col.id };
          }
        }
      }
    }
    return { rowId: null, colId: null };
  }, [doc, store.selectedNodeId]);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading page...</p>
      </div>
    );
  }

  const handleAddBlock = (type: BlockType) => {
    if (selectedContext.rowId && selectedContext.colId) {
      store.addBlock(selectedContext.rowId, selectedContext.colId, type);
    }
  };

  const publicUrl = `${window.location.origin}/p/${doc.slug}`;

  return (
    <>
    <EditorShell
      title={doc.name}
      onTitleChange={(name) => store.update(doc.id, { name })}
      isSaving={store.isSaving}
      lastSaved={store.lastSaved}
      canUndo={store.past.length > 0}
      canRedo={store.future.length > 0}
      onUndo={store.undo}
      onRedo={store.redo}
      zoom={zoom}
      onZoomChange={setZoom}
      onAutoSave={handleAutoSave}
      onPreview={() => navigate(`/preview/page/${doc.id}`)}
      onPublish={() => setPublishOpen(true)}
      onExport={() => setExportOpen(true)}
      onShowShortcuts={() => setShortcutsOpen(true)}
      addPanel={
        <AddBlockPanel
          onAddRow={store.addRow}
          onAddColumn={
            selectedContext.rowId
              ? () => store.addColumn(selectedContext.rowId!)
              : undefined
          }
          selectedRowId={selectedContext.rowId}
          selectedColId={selectedContext.colId}
          onAddBlock={handleAddBlock}
        />
      }
      layersPanel={
        <PageTreePanel
          tree={doc.tree}
          selectedNodeId={store.selectedNodeId}
          onSelectNode={(nodeId, type) => store.selectNode(nodeId, type)}
          onRemoveRow={store.removeRow}
          onRemoveColumn={(rowId, colId) => store.removeColumn(rowId, colId)}
          onRemoveBlock={(rowId, colId, blockId) => store.removeBlock(rowId, colId, blockId)}
        />
      }
      propertiesPanel={
        <BlockPropertiesPanel
          selectedNodeId={store.selectedNodeId}
          selectedNodeType={store.selectedNodeType}
          tree={doc.tree}
          onUpdateRow={store.updateRow}
          onUpdateColumn={store.updateColumn}
          onUpdateBlock={store.updateBlock}
        />
      }
    >
      <PageCanvas
        tree={doc.tree}
        selectedNodeId={store.selectedNodeId}
        onSelectNode={(nodeId, type) => store.selectNode(nodeId, type)}
        zoom={zoom}
      />
    </EditorShell>

    <PublishDialog
      open={publishOpen}
      onOpenChange={setPublishOpen}
      docType="page"
      docName={doc.name}
      isPublished={doc.published}
      publicUrl={publicUrl}
      onPublish={() => store.publish(doc.id)}
      onUnpublish={() => store.unpublish(doc.id)}
    />
    <ExportDialog
      open={exportOpen}
      onOpenChange={setExportOpen}
      docType="page"
      docName={doc.name}
      onExport={() => downloadJson(doc, `${doc.name.replace(/\s+/g, '-').toLowerCase()}.json`)}
    />
    <KeyboardShortcutsDialog
      open={shortcutsOpen}
      onOpenChange={setShortcutsOpen}
    />
    </>
  );
}
