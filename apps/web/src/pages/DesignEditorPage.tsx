import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDesignStore } from '@/stores/designStore';
import { EditorShell } from '@/components/editor/EditorShell';
import { AddPanel } from '@/components/editor/AddPanel';
import { LayersPanel } from '@/components/editor/LayersPanel';
import { AssetsPanel } from '@/components/editor/AssetsPanel';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { MockCanvas } from '@/components/editor/MockCanvas';
import { PublishDialog } from '@/components/editor/PublishDialog';
import { ExportDialog } from '@/components/editor/ExportDialog';
import { KeyboardShortcutsDialog } from '@/components/editor/KeyboardShortcutsDialog';
import { downloadJson } from '@/lib/export';
import type { AssetItem } from '@/types';

export function DesignEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useDesignStore();
  const [zoom, setZoom] = useState(80);
  const [publishOpen, setPublishOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Load data and set current doc
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

  // Redirect if document not found after loading
  useEffect(() => {
    if (store.documents.length > 0 && id && !doc) {
      navigate('/dashboard', { replace: true });
    }
  }, [store.documents, id, doc, navigate]);

  const handleAutoSave = useCallback(() => {
    store.autoSave();
  }, [store]);

  const handleDeleteSelected = useCallback(() => {
    if (store.selectedObjectId) {
      store.removeObject(store.selectedObjectId);
    }
  }, [store]);

  const handleInsertAsset = useCallback(
    (asset: AssetItem) => {
      store.addObject({
        id: crypto.randomUUID(),
        type: 'image',
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        width: Math.min(asset.width, 300),
        height: Math.min(asset.height, 300),
        fill: 'transparent',
        stroke: '#777E89',
        strokeWidth: 1,
        opacity: 1,
        rotation: 0,
        src: asset.url,
        name: asset.name,
      });
    },
    [store]
  );

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading design...</p>
      </div>
    );
  }

  const selectedObject = doc.objects.find((o) => o.id === store.selectedObjectId) || null;

  const publicUrl = `${window.location.origin}/d/${doc.id}`;

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
      onPreview={() => navigate(`/preview/design/${doc.id}`)}
      onPublish={() => setPublishOpen(true)}
      onExport={() => setExportOpen(true)}
      onShowShortcuts={() => setShortcutsOpen(true)}
      onDelete={handleDeleteSelected}
      addPanel={<AddPanel onAddObject={store.addObject} />}
      assetsPanel={<AssetsPanel onInsertAsset={handleInsertAsset} />}
      layersPanel={
        <LayersPanel
          objects={doc.objects}
          selectedId={store.selectedObjectId}
          onSelect={store.selectObject}
          onToggleVisibility={(objId) => {
            const obj = doc.objects.find((o) => o.id === objId);
            if (obj) store.updateObject(objId, { visible: obj.visible === false ? true : false });
          }}
          onToggleLock={(objId) => {
            const obj = doc.objects.find((o) => o.id === objId);
            if (obj) store.updateObject(objId, { locked: !obj.locked });
          }}
          onRemove={store.removeObject}
          onReorder={store.reorderObjects}
        />
      }
      propertiesPanel={
        <PropertiesPanel
          object={selectedObject}
          onUpdate={(updates) => {
            if (store.selectedObjectId) {
              store.updateObject(store.selectedObjectId, updates);
            }
          }}
        />
      }
    >
      <MockCanvas
        width={doc.width}
        height={doc.height}
        objects={doc.objects}
        selectedId={store.selectedObjectId}
        onSelect={store.selectObject}
        zoom={zoom}
      />
    </EditorShell>

    <PublishDialog
      open={publishOpen}
      onOpenChange={setPublishOpen}
      docType="design"
      docName={doc.name}
      isPublished={doc.published}
      publicUrl={publicUrl}
      onPublish={() => store.publish(doc.id)}
      onUnpublish={() => store.unpublish(doc.id)}
    />
    <ExportDialog
      open={exportOpen}
      onOpenChange={setExportOpen}
      docType="design"
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
