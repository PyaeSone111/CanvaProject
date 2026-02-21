import { useState, useEffect } from 'react';
import {
  Globe,
  Check,
  ExternalLink,
  Copy,
  AlertCircle,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePublishStore } from '@/stores/publishStore';
import { ThemeSettingsPanel } from './ThemeSettingsPanel';
import { SeoSettingsPanel } from './SeoSettingsPanel';
import type { ThemeSettings, SeoSettings } from '@/types';
import { defaultTheme, defaultSeo } from '@/lib/publish-api';

interface PublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceId: string;
  sourceType: 'portfolio' | 'page';
  sourceName: string;
  /** Also call the original store publish to set `published: true` on the doc */
  onSourcePublish: () => void;
  onSourceUnpublish: () => void;
}

export function PublishModal({
  open,
  onOpenChange,
  sourceId,
  sourceType,
  sourceName,
  onSourcePublish,
  onSourceUnpublish,
}: PublishModalProps) {
  const store = usePublishStore();
  const record = store.getBySourceId(sourceId);

  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [justPublished, setJustPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [seo, setSeo] = useState<SeoSettings>({ ...defaultSeo, title: sourceName });

  useEffect(() => {
    store.loadAll();
  }, []);

  useEffect(() => {
    if (record) {
      setSlug(record.slug);
      setTheme(record.theme);
      setSeo(record.seo);
    } else {
      const autoSlug = sourceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60);
      setSlug(autoSlug);
      setSeo({ ...defaultSeo, title: sourceName });
      setTheme(defaultTheme);
    }
  }, [record, sourceName]);

  const isPublished = record?.isPublished ?? false;
  const baseUrl = sourceType === 'portfolio' ? '/p/' : '/site/';
  const publicUrl = `${window.location.origin}${baseUrl}${slug}`;

  const validateSlug = (s: string) => {
    const clean = s
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 60);
    setSlug(clean);
    if (!clean) {
      setSlugError('Slug cannot be empty.');
    } else if (!store.isSlugAvailable(clean, sourceId)) {
      setSlugError('This slug is already taken.');
    } else {
      setSlugError('');
    }
  };

  const handlePublish = () => {
    if (slugError || !slug) return;
    if (sourceType === 'portfolio') {
      store.publishPortfolio(sourceId, sourceName, slug, seo, theme);
    } else {
      store.publishPage(sourceId, sourceName, slug, seo, theme);
    }
    onSourcePublish();
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2500);
  };

  const handleUnpublish = () => {
    store.unpublish(sourceId);
    onSourceUnpublish();
  };

  const handleRepublish = () => {
    if (slugError || !slug) return;
    if (sourceType === 'portfolio') {
      store.publishPortfolio(sourceId, sourceName, slug, seo, theme);
    } else {
      store.publishPage(sourceId, sourceName, slug, seo, theme);
    }
    onSourcePublish();
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSeoChange = (updates: Partial<SeoSettings>) => {
    const next = { ...seo, ...updates };
    setSeo(next);
    if (record) store.updateSeo(sourceId, updates);
  };

  const handleThemeChange = (updates: Partial<ThemeSettings>) => {
    const next = { ...theme, ...updates };
    setTheme(next);
    if (record) store.updateTheme(sourceId, updates);
  };

  const typeLabel = sourceType === 'portfolio' ? 'portfolio' : 'page';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-ar-metal" />
            Publish {typeLabel}
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? `"${sourceName}" is live. Manage settings or unpublish.`
              : `Configure and publish "${sourceName}" to a public URL.`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-9 px-0">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            <TabsTrigger value="seo" className="text-xs">SEO</TabsTrigger>
            <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
          </TabsList>

          {/* General tab */}
          <TabsContent value="general" className="flex-1 overflow-auto py-3 space-y-4 m-0">
            {/* Status */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
              <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${isPublished ? 'bg-emerald-500' : 'bg-ar-memorize'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{isPublished ? 'Published' : 'Draft'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {isPublished ? 'Visible to anyone with the link' : 'Only visible to you'}
                </p>
              </div>
              {isPublished && (
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Live
                </Badge>
              )}
            </div>

            {/* Slug editor */}
            <div className="space-y-1.5">
              <Label htmlFor="pub-slug" className="text-xs flex items-center gap-1.5">
                <Link2 className="h-3 w-3" />
                Public URL slug
              </Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground shrink-0">{baseUrl}</span>
                <Input
                  id="pub-slug"
                  value={slug}
                  onChange={(e) => validateSlug(e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="my-project"
                />
              </div>
              {slugError && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {slugError}
                </p>
              )}
            </div>

            {/* Public URL display */}
            {isPublished && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background">
                <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <code className="flex-1 text-xs truncate text-muted-foreground">{publicUrl}</code>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="sr-only">Copy link</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">Open</span>
                  </a>
                </Button>
              </div>
            )}

            {/* Just published */}
            {justPublished && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-600 font-medium">
                  Successfully published! Your {typeLabel} is now live.
                </p>
              </div>
            )}
          </TabsContent>

          {/* SEO tab */}
          <TabsContent value="seo" className="flex-1 overflow-auto py-3 m-0">
            <SeoSettingsPanel seo={seo} onChange={handleSeoChange} />
          </TabsContent>

          {/* Theme tab */}
          <TabsContent value="theme" className="flex-1 overflow-auto py-3 m-0">
            <ThemeSettingsPanel theme={theme} onChange={handleThemeChange} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2 sm:gap-2 pt-2 border-t">
          {isPublished ? (
            <>
              <Button variant="outline" size="sm" onClick={handleUnpublish}>
                Unpublish
              </Button>
              <Button size="sm" onClick={handleRepublish} disabled={!!slugError}>
                Republish
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" className="gap-1.5" onClick={handlePublish} disabled={!!slugError || !slug}>
                <Globe className="h-3.5 w-3.5" />
                Publish Now
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
