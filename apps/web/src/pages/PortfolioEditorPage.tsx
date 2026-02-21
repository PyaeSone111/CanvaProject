import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { EditorShell } from '@/components/editor/EditorShell';
import { PortfolioPageList } from '@/components/portfolio/PortfolioPageList';
import { AddSectionPanel } from '@/components/portfolio/AddSectionPanel';
import { SectionCard } from '@/components/portfolio/SectionCard';
import { SectionPreview } from '@/components/portfolio/SectionPreview';
import { SectionPropertiesPanel } from '@/components/portfolio/SectionPropertiesPanel';
import { PublishDialog } from '@/components/editor/PublishDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, Layers } from 'lucide-react';

export function PortfolioEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = usePortfolioStore();
  const [zoom, setZoom] = useState(100);
  const [publishOpen, setPublishOpen] = useState(false);

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
      navigate('/dashboard?tab=portfolios', { replace: true });
    }
  }, [store.documents, id, doc, navigate]);

  const handleAutoSave = useCallback(() => {
    store.autoSave();
  }, [store]);

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading portfolio...</p>
      </div>
    );
  }

  const activePage = doc.pages.find((p) => p.id === store.activePageId) || doc.pages[0] || null;
  const selectedSection = activePage
    ? activePage.sections.find((s) => s.id === store.selectedSectionId) || null
    : null;

  // Left panel: Pages list + Add sections
  const leftAddPanel = (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="sections" className="flex flex-col h-full">
        <TabsList className="w-full rounded-none border-b h-9 bg-transparent justify-start px-2">
          <TabsTrigger value="sections" className="gap-1 text-xs">
            <Plus className="h-3 w-3" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="layers" className="gap-1 text-xs">
            <Layers className="h-3 w-3" />
            Layers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="flex-1 overflow-auto m-0">
          <ScrollArea className="h-full">
            {activePage ? (
              <AddSectionPanel
                onAdd={(type) => store.addSection(activePage.id, type)}
              />
            ) : (
              <div className="p-3 text-xs text-muted-foreground">
                Create a page first to add sections.
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layers" className="flex-1 overflow-auto m-0">
          <ScrollArea className="h-full">
            <div className="p-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sections ({activePage?.sections.length || 0})
              </p>
              {activePage?.sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isSelected={store.selectedSectionId === section.id}
                  onSelect={() => store.selectSection(section.id)}
                  onRemove={() => store.removeSection(activePage.id, section.id)}
                />
              ))}
              {(!activePage || activePage.sections.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No sections yet. Use the Sections tab to add them.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Left panel: Pages sidebar (rendered as a secondary sidebar)
  const pagesPanel = (
    <PortfolioPageList
      pages={doc.pages}
      activePageId={store.activePageId}
      onSelectPage={(pageId) => store.setActivePageId(pageId)}
      onAddPage={(title) => store.addPage(title)}
      onRemovePage={(pageId) => store.removePage(pageId)}
      onUpdatePageTitle={(pageId, title) => store.updatePage(pageId, { title })}
    />
  );

  // Center content: live preview of all sections on the active page
  const centerContent = (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="flex h-full">
        {/* Secondary page list sidebar */}
        <aside className="w-48 border-r bg-background flex flex-col shrink-0">
          <div className="h-9 border-b flex items-center px-3">
            <FileText className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pages
            </p>
          </div>
          {pagesPanel}
        </aside>

        {/* Section preview canvas */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto py-6 px-4 flex flex-col gap-4">
              {activePage && activePage.sections.length > 0 ? (
                activePage.sections.map((section) => (
                  <SectionPreview
                    key={section.id}
                    section={section}
                    isSelected={store.selectedSectionId === section.id}
                    onSelect={() => store.selectSection(section.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activePage
                      ? 'This page has no sections yet. Add one from the left panel.'
                      : 'Create a page to get started.'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );

  const publicUrl = `${window.location.origin}/portfolio/${doc.id}`;

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
      onPreview={() => navigate(`/preview/portfolio/${doc.id}`)}
      onPublish={() => setPublishOpen(true)}
      addPanel={leftAddPanel}
      layersPanel={
        <ScrollArea className="h-full">
          <div className="p-3 flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sections ({activePage?.sections.length || 0})
            </p>
            {activePage?.sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isSelected={store.selectedSectionId === section.id}
                onSelect={() => store.selectSection(section.id)}
                onRemove={() => store.removeSection(activePage.id, section.id)}
              />
            ))}
          </div>
        </ScrollArea>
      }
      propertiesPanel={
        <SectionPropertiesPanel
          section={selectedSection}
          onUpdate={(updates) => {
            if (activePage && store.selectedSectionId) {
              store.updateSection(activePage.id, store.selectedSectionId, updates);
            }
          }}
        />
      }
    >
      {centerContent}
    </EditorShell>

    <PublishDialog
      open={publishOpen}
      onOpenChange={setPublishOpen}
      docType="portfolio"
      docName={doc.name}
      isPublished={doc.published}
      publicUrl={publicUrl}
      onPublish={() => store.publish(doc.id)}
      onUnpublish={() => store.unpublish(doc.id)}
    />
    </>
  );
}
