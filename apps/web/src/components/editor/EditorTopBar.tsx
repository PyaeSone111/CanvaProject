import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Eye,
  Globe,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface EditorTopBarProps {
  title: string;
  onTitleChange: (title: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
}

export function EditorTopBar({
  title,
  onTitleChange,
  isSaving,
  lastSaved,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onPreview,
  onPublish,
}: EditorTopBarProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title) {
      onTitleChange(trimmed);
    }
    setIsEditing(false);
  };

  const savedAgo = lastSaved
    ? `Saved ${Math.round((Date.now() - lastSaved.getTime()) / 1000)}s ago`
    : 'Not saved yet';

  return (
    <div className="h-12 border-b bg-background flex items-center px-3 gap-2 shrink-0">
      {/* Back button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Back to Dashboard</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Title */}
      <div className="flex items-center gap-2 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            className="text-sm font-medium bg-transparent border-b border-foreground/30 outline-none px-1 py-0.5 min-w-0"
          />
        ) : (
          <button
            onClick={() => {
              setEditValue(title);
              setIsEditing(true);
            }}
            className="text-sm font-medium truncate hover:bg-accent rounded px-1 py-0.5 max-w-[200px]"
          >
            {title}
          </button>
        )}

        {/* Save indicator */}
        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              {savedAgo}
            </>
          )}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Undo / Redo */}
      <div className="flex gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canUndo}
              onClick={onUndo}
            >
              <Undo2 className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canRedo}
              onClick={onRedo}
            >
              <Redo2 className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Preview */}
      {onPreview && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onPreview}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview design</TooltipContent>
        </Tooltip>
      )}

      {/* Publish */}
      {onPublish && (
        <Button size="sm" className="h-8 gap-1.5" onClick={onPublish}>
          <Globe className="h-4 w-4" />
          Publish
        </Button>
      )}
    </div>
  );
}
