import { useState } from 'react';
import { Download, FileJson, FileImage, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { DocumentType } from '@/types';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docType: DocumentType;
  docName: string;
  onExport: (format: string) => void;
}

const formatOptions: Record<DocumentType, { id: string; label: string; desc: string; icon: React.ElementType }[]> = {
  design: [
    { id: 'json', label: 'JSON', desc: 'Raw design data (objects, styles, positions)', icon: FileJson },
    { id: 'png', label: 'PNG', desc: 'Rasterized image export (coming soon)', icon: FileImage },
    { id: 'svg', label: 'SVG', desc: 'Vector export (coming soon)', icon: FileImage },
  ],
  portfolio: [
    { id: 'json', label: 'JSON', desc: 'Full portfolio structure and content', icon: FileJson },
    { id: 'html', label: 'HTML', desc: 'Static HTML files (coming soon)', icon: FileText },
  ],
  page: [
    { id: 'json', label: 'JSON', desc: 'Page tree structure and block data', icon: FileJson },
    { id: 'html', label: 'HTML', desc: 'Static HTML page (coming soon)', icon: FileText },
  ],
};

export function ExportDialog({ open, onOpenChange, docType, docName, onExport }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const formats = formatOptions[docType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-ar-metal" />
            Export
          </DialogTitle>
          <DialogDescription>
            Export "{docName}" in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = selectedFormat === fmt.id;
            const isDisabled = fmt.desc.includes('coming soon');

            return (
              <button
                key={fmt.id}
                onClick={() => !isDisabled && setSelectedFormat(fmt.id)}
                disabled={isDisabled}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? 'border-foreground/30 bg-accent'
                    : isDisabled
                      ? 'border-border opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{fmt.label}</p>
                  <p className="text-xs text-muted-foreground">{fmt.desc}</p>
                </div>
                {isSelected && (
                  <div className="h-4 w-4 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-background" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              onExport(selectedFormat);
              onOpenChange(false);
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export {selectedFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
