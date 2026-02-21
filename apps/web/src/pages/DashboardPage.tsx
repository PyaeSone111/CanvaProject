import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Palette,
  Briefcase,
  FileCode,
  LayoutGrid,
  List,
  ArrowUpDown,
  Globe,
} from 'lucide-react';
import { useDesignStore } from '@/stores/designStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreateDialog } from '@/components/dashboard/CreateDialog';
import type { DocumentType } from '@/types';

type SortKey = 'updated' | 'name' | 'created';
type ViewMode = 'grid' | 'list';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'designs';
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<DocumentType>('design');
  const [sortBy, setSortBy] = useState<SortKey>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

  // Sort helper
  const sortFn = (a: { name: string; updatedAt: string; createdAt: string }, b: { name: string; updatedAt: string; createdAt: string }) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  };

  // Filtered + sorted lists
  const filteredDesigns = useMemo(
    () =>
      designStore.documents
        .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
        .sort(sortFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [designStore.documents, search, sortBy]
  );

  const filteredPortfolios = useMemo(
    () =>
      portfolioStore.documents
        .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
        .sort(sortFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [portfolioStore.documents, search, sortBy]
  );

  const filteredPages = useMemo(
    () =>
      pageStore.documents
        .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
        .sort(sortFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageStore.documents, search, sortBy]
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

  // Stats
  const totalDesigns = designStore.documents.length;
  const totalPortfolios = portfolioStore.documents.length;
  const totalPages = pageStore.documents.length;
  const publishedCount =
    designStore.documents.filter((d) => d.published).length +
    portfolioStore.documents.filter((d) => d.published).length +
    pageStore.documents.filter((d) => d.published).length;

  const sortLabel: Record<SortKey, string> = {
    updated: 'Last modified',
    name: 'Name',
    created: 'Date created',
  };

  // List view render
  const renderListItem = (item: { id: string; name: string; updatedAt: string; docType: DocumentType; subtitle: string; published: boolean }) => (
    <button
      key={item.id}
      onClick={() => {
        const routes: Record<DocumentType, string> = { design: '/editor/design/', portfolio: '/editor/portfolio/', page: '/builder/page/' };
        window.location.href = `${routes[item.docType]}${item.id}`;
      }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg border hover:bg-accent/50 transition-colors text-left w-full"
    >
      <div className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${
        item.docType === 'design' ? 'bg-ar-metal' : item.docType === 'portfolio' ? 'bg-ar-bay' : 'bg-ar-iron'
      }`}>
        <span className="text-sm font-bold text-[#ADB3BC]">
          {item.docType.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.published && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Live
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span>
      </div>
    </button>
  );

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Designs', value: totalDesigns, icon: Palette, color: 'bg-ar-metal' },
          { label: 'Portfolios', value: totalPortfolios, icon: Briefcase, color: 'bg-ar-bay' },
          { label: 'Pages', value: totalPages, icon: FileCode, color: 'bg-ar-iron' },
          { label: 'Published', value: publishedCount, icon: Globe, color: 'bg-emerald-500/20' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <div className={`h-9 w-9 rounded-md ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className={`h-4 w-4 ${stat.label === 'Published' ? 'text-emerald-600' : 'text-[#ADB3BC]'}`} />
            </div>
            <div>
              <p className="text-xl font-semibold leading-none">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-balance">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
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

      {/* Toolbar: search + sort + view */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 h-9"
          />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sortLabel[sortBy]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setSortBy('updated')}>Last modified</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('created')}>Date created</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View toggle */}
        <div className="flex rounded-md border overflow-hidden shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`h-9 w-9 flex items-center justify-center transition-colors ${
              viewMode === 'grid'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`h-9 w-9 flex items-center justify-center border-l transition-colors ${
              viewMode === 'list'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
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
          ) : viewMode === 'grid' ? (
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
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              {filteredDesigns.map((doc) =>
                renderListItem({ id: doc.id, name: doc.name, updatedAt: doc.updatedAt, docType: 'design', subtitle: `${doc.width} x ${doc.height}`, published: doc.published })
              )}
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
          ) : viewMode === 'grid' ? (
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
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              {filteredPortfolios.map((doc) =>
                renderListItem({ id: doc.id, name: doc.name, updatedAt: doc.updatedAt, docType: 'portfolio', subtitle: `${doc.pages.length} page(s)`, published: doc.published })
              )}
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
          ) : viewMode === 'grid' ? (
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
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              {filteredPages.map((doc) =>
                renderListItem({ id: doc.id, name: doc.name, updatedAt: doc.updatedAt, docType: 'page', subtitle: `/${doc.slug}`, published: doc.published })
              )}
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
