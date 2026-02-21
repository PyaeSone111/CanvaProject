import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutTemplate, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { portfolioTemplates, pageTemplates } from '@/lib/templates';
import type { TemplateDefinition, PortfolioDocument, PageDocument } from '@/types';

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'portfolio' | 'page';
}

export function TemplatePicker({ open, onOpenChange, type }: TemplatePickerProps) {
  const navigate = useNavigate();
  const portfolioStore = usePortfolioStore();
  const pageStore = usePageBuilderStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const templates = type === 'portfolio' ? portfolioTemplates : pageTemplates;
  const selected = templates.find((t) => t.id === selectedId);

  const handleCreate = () => {
    if (!selected) return;

    if (type === 'portfolio') {
      const tplData = selected.data as PortfolioDocument;
      // Create with fresh IDs
      const doc = portfolioStore.create({
        name: tplData.name,
        pages: tplData.pages.map((p) => ({
          ...p,
          id: crypto.randomUUID(),
          sections: p.sections.map((s) => ({
            ...s,
            id: crypto.randomUUID(),
          })),
        })),
      });
      onOpenChange(false);
      navigate(`/editor/portfolio/${doc.id}`);
    } else {
      const tplData = selected.data as PageDocument;
      const doc = pageStore.create({
        name: tplData.name,
        slug: tplData.slug + '-' + Date.now(),
        tree: tplData.tree.map((r) => ({
          ...r,
          id: crypto.randomUUID(),
          columns: r.columns.map((c) => ({
            ...c,
            id: crypto.randomUUID(),
            children: c.children.map((b) => ({
              ...b,
              id: crypto.randomUUID(),
            })),
          })),
        })),
      });
      onOpenChange(false);
      navigate(`/builder/page/${doc.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-ar-metal" />
            Choose a Template
          </DialogTitle>
          <DialogDescription>
            Start with a pre-designed {type === 'portfolio' ? 'portfolio' : 'page'} template. You can customize everything after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-2">
          {templates.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`relative rounded-lg border text-left transition-all overflow-hidden ${
                  isSelected
                    ? 'border-foreground/40 ring-2 ring-foreground/10'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] bg-muted flex items-center justify-center overflow-hidden">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: tpl.theme.bgColor }}
                  >
                    <div className="text-center px-3" style={{ color: tpl.theme.textColor, fontFamily: tpl.theme.fontFamily }}>
                      <p className="text-sm font-bold truncate">{tpl.name}</p>
                      <p className="text-[10px] opacity-60 mt-0.5">{tpl.variant}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-medium truncate">{tpl.name}</p>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-background" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {tpl.description}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                      {tpl.theme.buttonStyle}
                    </Badge>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                      {tpl.theme.sectionPadding}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={!selected} onClick={handleCreate} className="gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Create from Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
