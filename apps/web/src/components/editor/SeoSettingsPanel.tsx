import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, FileText, Image } from 'lucide-react';
import type { SeoSettings } from '@/types';

interface SeoSettingsPanelProps {
  seo: SeoSettings;
  onChange: (updates: Partial<SeoSettings>) => void;
}

export function SeoSettingsPanel({ seo, onChange }: SeoSettingsPanelProps) {
  return (
    <div className="space-y-5 px-1">
      {/* SEO fields */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Search Engine Optimization
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="seo-title" className="text-xs flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Page Title
          </Label>
          <Input
            id="seo-title"
            value={seo.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="My awesome project"
            className="h-8 text-xs"
            maxLength={60}
          />
          <p className="text-[10px] text-muted-foreground">
            {seo.title.length}/60 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo-desc" className="text-xs flex items-center gap-1.5">
            <Search className="h-3 w-3" />
            Meta Description
          </Label>
          <textarea
            id="seo-desc"
            value={seo.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="A brief description for search engines..."
            className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            maxLength={160}
          />
          <p className="text-[10px] text-muted-foreground">
            {seo.description.length}/160 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seo-og" className="text-xs flex items-center gap-1.5">
            <Image className="h-3 w-3" />
            OG Image URL
          </Label>
          <Input
            id="seo-og"
            value={seo.ogImage}
            onChange={(e) => onChange({ ogImage: e.target.value })}
            placeholder="https://example.com/og-image.png"
            className="h-8 text-xs"
          />
          <p className="text-[10px] text-muted-foreground">
            Used when sharing on social media. Recommended: 1200x630px
          </p>
        </div>
      </section>

      {/* Google preview */}
      <section className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Search Preview
        </p>
        <div className="rounded-lg border p-3 bg-background space-y-1">
          <p className="text-sm font-medium text-[#1a0dab] truncate">
            {seo.title || 'Page Title'}
          </p>
          <p className="text-[11px] text-[#006621] truncate">
            example.com/p/{seo.title ? seo.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30) : 'slug'}
          </p>
          <p className="text-xs text-[#545454] line-clamp-2">
            {seo.description || 'No description set. Add a meta description to improve search visibility.'}
          </p>
        </div>
      </section>

      {/* Social preview */}
      <section className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Social Preview
        </p>
        <div className="rounded-lg border overflow-hidden bg-background">
          <div className="h-32 bg-muted flex items-center justify-center">
            {seo.ogImage ? (
              <img
                src={seo.ogImage}
                alt="OG preview"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No OG image set</span>
            )}
          </div>
          <div className="p-3 space-y-1">
            <p className="text-xs font-medium truncate">
              {seo.title || 'Page Title'}
            </p>
            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {seo.description || 'No description.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
