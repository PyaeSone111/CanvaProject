import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { DocumentType } from '@/types';

interface ProjectCardProps {
  id: string;
  name: string;
  updatedAt: string;
  docType: DocumentType;
  subtitle?: string;
  published?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const typeColorMap: Record<DocumentType, string> = {
  design: 'bg-ar-metal',
  portfolio: 'bg-ar-bay',
  page: 'bg-ar-iron',
};

const editRouteMap: Record<DocumentType, string> = {
  design: '/editor/design/',
  portfolio: '/editor/portfolio/',
  page: '/builder/page/',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ProjectCard({
  id,
  name,
  updatedAt,
  docType,
  subtitle,
  published,
  onDuplicate,
  onDelete,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`${editRouteMap[docType]}${id}`);
  };

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail area */}
      <button
        onClick={handleEdit}
        className="block w-full aspect-[4/3] relative overflow-hidden bg-muted"
        aria-label={`Open ${name}`}
      >
        <div
          className={`absolute inset-0 ${typeColorMap[docType]} opacity-80 flex items-center justify-center`}
        >
          <span className="text-3xl font-bold text-[#ADB3BC] opacity-40 select-none">
            {docType.charAt(0).toUpperCase()}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium text-[#ADB3BC] bg-ar-dark/80 px-3 py-1.5 rounded-md">
            Open
          </span>
        </div>
      </button>

      {/* Info footer */}
      <div className="p-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {subtitle ? subtitle : formatDate(updatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {published && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Live
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Card actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
