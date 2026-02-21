import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { DocumentType } from '@/types';

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docType: DocumentType;
  onCreate: (name: string, width?: number, height?: number) => void;
}

const presets: Record<DocumentType, { label: string; description: string }> = {
  design: { label: 'New Design', description: 'Create a new canvas design with custom dimensions.' },
  portfolio: { label: 'New Portfolio', description: 'Start a new multi-page portfolio.' },
  page: { label: 'New Page', description: 'Build a new website page.' },
};

export function CreateDialog({ open, onOpenChange, docType, onCreate }: CreateDialogProps) {
  const [name, setName] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || `Untitled ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
    onCreate(finalName, width, height);
    setName('');
    setWidth(800);
    setHeight(600);
    onOpenChange(false);
  };

  const preset = presets[docType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{preset.label}</DialogTitle>
          <DialogDescription>{preset.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="doc-name">Name</Label>
            <Input
              id="doc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`My ${docType}...`}
              autoFocus
            />
          </div>
          {docType === 'design' && (
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="doc-width">Width (px)</Label>
                <Input
                  id="doc-width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={100}
                  max={5000}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="doc-height">Height (px)</Label>
                <Input
                  id="doc-height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={100}
                  max={5000}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
