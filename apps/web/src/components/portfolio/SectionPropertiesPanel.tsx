import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SectionBlock } from '@/types';

interface SectionPropertiesPanelProps {
  section: SectionBlock | null;
  onUpdate: (updates: Partial<SectionBlock>) => void;
}

export function SectionPropertiesPanel({ section, onUpdate }: SectionPropertiesPanelProps) {
  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select a section to edit its properties.
        </p>
      </div>
    );
  }

  const updateContent = (key: string, value: unknown) => {
    onUpdate({ content: { ...section.content, [key]: value } });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Section Type
          </p>
          <p className="text-sm font-medium capitalize">{section.type}</p>
        </div>

        <Separator />

        {/* Hero properties */}
        {section.type === 'hero' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Content
            </p>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Heading</Label>
              <Input
                value={(section.content.heading as string) || ''}
                onChange={(e) => updateContent('heading', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Subheading</Label>
              <Input
                value={(section.content.subheading as string) || ''}
                onChange={(e) => updateContent('subheading', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Background URL</Label>
              <Input
                value={(section.content.backgroundUrl as string) || ''}
                onChange={(e) => updateContent('backgroundUrl', e.target.value)}
                className="h-8 text-xs"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {/* Text properties */}
        {section.type === 'text' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Content
            </p>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Body Text</Label>
              <textarea
                value={(section.content.body as string) || ''}
                onChange={(e) => updateContent('body', e.target.value)}
                className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-xs resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={6}
              />
            </div>
          </div>
        )}

        {/* Gallery properties */}
        {section.type === 'gallery' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gallery Settings
            </p>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Columns</Label>
              <Input
                type="number"
                value={(section.content.columns as number) || 3}
                onChange={(e) => updateContent('columns', Number(e.target.value))}
                className="h-8 text-xs"
                min={1}
                max={6}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Image upload coming soon. Gallery currently displays placeholders.
            </p>
          </div>
        )}

        {/* CTA properties */}
        {section.type === 'cta' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Content
            </p>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Heading</Label>
              <Input
                value={(section.content.heading as string) || ''}
                onChange={(e) => updateContent('heading', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Button Text</Label>
              <Input
                value={(section.content.buttonText as string) || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Button URL</Label>
              <Input
                value={(section.content.buttonUrl as string) || ''}
                onChange={(e) => updateContent('buttonUrl', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}

        {/* Columns properties */}
        {section.type === 'columns' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Column Items
            </p>
            {((section.content.items as { title: string; body: string }[]) || []).map(
              (item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 rounded-md border p-2">
                  <Label className="text-xs">Column {idx + 1} Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const items = [
                        ...((section.content.items as { title: string; body: string }[]) || []),
                      ];
                      items[idx] = { ...items[idx], title: e.target.value };
                      updateContent('items', items);
                    }}
                    className="h-7 text-xs"
                  />
                  <Label className="text-xs">Body</Label>
                  <Input
                    value={item.body}
                    onChange={(e) => {
                      const items = [
                        ...((section.content.items as { title: string; body: string }[]) || []),
                      ];
                      items[idx] = { ...items[idx], body: e.target.value };
                      updateContent('items', items);
                    }}
                    className="h-7 text-xs"
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
