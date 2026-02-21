import { useState } from 'react';
import { Globe, GlobeIcon, Check, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { DocumentType } from '@/types';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docType: DocumentType;
  docName: string;
  isPublished: boolean;
  publicUrl: string;
  onPublish: () => void;
  onUnpublish: () => void;
}

export function PublishDialog({
  open,
  onOpenChange,
  docType,
  docName,
  isPublished,
  publicUrl,
  onPublish,
  onUnpublish,
}: PublishDialogProps) {
  const [justPublished, setJustPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePublish = () => {
    onPublish();
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: no clipboard API
    }
  };

  const typeLabel = docType === 'design' ? 'design' : docType === 'portfolio' ? 'portfolio' : 'page';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-ar-metal" />
            Publish {typeLabel}
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? `"${docName}" is currently live. You can unpublish it or copy the public link.`
              : `Make "${docName}" publicly accessible. Anyone with the link will be able to view it.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Status */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
            <div
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                isPublished ? 'bg-emerald-500' : 'bg-ar-memorize'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {isPublished ? 'Published' : 'Draft'}
              </p>
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

          {/* Public URL (shown when published) */}
          {isPublished && publicUrl && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background">
              <GlobeIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <code className="flex-1 text-xs truncate text-muted-foreground">
                {publicUrl}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span className="sr-only">Copy link</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                asChild
              >
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="sr-only">Open in new tab</span>
                </a>
              </Button>
            </div>
          )}

          {/* Just published confirmation */}
          {justPublished && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-600 font-medium">
                Successfully published! Your {typeLabel} is now live.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          {isPublished ? (
            <>
              <Button variant="outline" size="sm" onClick={onUnpublish}>
                Unpublish
              </Button>
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" className="gap-1.5" onClick={handlePublish}>
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
