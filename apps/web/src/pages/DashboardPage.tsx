import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Palette, Briefcase, FileCode } from 'lucide-react';
import { useDesignStore } from '@/stores/designStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreateDialog } from '@/components/dashboard/CreateDialog';
import type { DocumentType } from '@/types';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'designs';
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<DocumentType>('design');

  // Stores
  const designStore = useDesignStore();
  const portfolioStore = usePortfolioStore();
  const pageStore = usePageBuilderStore();

  useEffect(() => {
    designStore.loadAll();
    portfolioStore.loadAll();
    pageStore.loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Filtered lists
  const filteredDesigns = useMemo(
    () =>
      designStore.documents.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      ),
    [designStore.documents, search]
  );

  const filteredPortfolios = useMemo(
    () =>
      portfolioStore.documents.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      ),
    [portfolioStore.documents, search]
  );

  const filteredPages = useMemo(
    () =>
      pageStore.documents.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      ),
    [pageStore.documents, search]
  );

  const handleCreate = (name: string, width?: number, height?: number) => {
    if (createType === 'design') {
      designStore.create({ name, width: width || 800, height: height || 600 });
    } else if (createType === 'portfolio') {
      portfolioStore.create({ name });
    } else {
      pageStore.create({ name });
    }
  };

  const openCreate = (type: DocumentType) => {
    setCreateType(type);
    setCreateOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-balance">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your designs, portfolios, and pages.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => openCreate('design')}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Design
          </Button>
          <Button size="sm" variant="outline" onClick={() => openCreate('portfolio')}>
            <Plus className="mr-1.5 h-4 w-4" />
            Portfolio
          </Button>
          <Button size="sm" variant="outline" onClick={() => openCreate('page')}>
            <Plus className="mr-1.5 h-4 w-4" />
            Page
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="designs" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Designs
            <span className="ml-1 text-xs text-muted-foreground">
              ({filteredDesigns.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="portfolios" className="gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Portfolios
            <span className="ml-1 text-xs text-muted-foreground">
              ({filteredPortfolios.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-1.5">
            <FileCode className="h-3.5 w-3.5" />
            Pages
            <span className="ml-1 text-xs text-muted-foreground">
              ({filteredPages.length})
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Designs Tab */}
        <TabsContent value="designs">
          {filteredDesigns.length === 0 ? (
            <EmptyState
              icon={Palette}
              title="No designs yet"
              description="Create your first design to get started with the canvas editor."
              actionLabel="Create Design"
              onAction={() => openCreate('design')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredDesigns.map((doc) => (
                <ProjectCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  updatedAt={doc.updatedAt}
                  docType="design"
                  subtitle={`${doc.width} x ${doc.height}`}
                  published={doc.published}
                  onDuplicate={() => designStore.duplicate(doc.id)}
                  onDelete={() => designStore.remove(doc.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Portfolios Tab */}
        <TabsContent value="portfolios">
          {filteredPortfolios.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No portfolios yet"
              description="Create a portfolio to showcase your work across multiple pages."
              actionLabel="Create Portfolio"
              onAction={() => openCreate('portfolio')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredPortfolios.map((doc) => (
                <ProjectCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  updatedAt={doc.updatedAt}
                  docType="portfolio"
                  subtitle={`${doc.pages.length} page(s)`}
                  published={doc.published}
                  onDelete={() => portfolioStore.remove(doc.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          {filteredPages.length === 0 ? (
            <EmptyState
              icon={FileCode}
              title="No pages yet"
              description="Build a website page using the drag-and-drop page builder."
              actionLabel="Create Page"
              onAction={() => openCreate('page')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredPages.map((doc) => (
                <ProjectCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  updatedAt={doc.updatedAt}
                  docType="page"
                  subtitle={`/${doc.slug}`}
                  published={doc.published}
                  onDelete={() => pageStore.remove(doc.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      <CreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        docType={createType}
        onCreate={handleCreate}
      />
    </div>
  );
}
