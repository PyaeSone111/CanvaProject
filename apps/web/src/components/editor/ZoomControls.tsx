import { Minus, Plus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const handleZoomIn = () => onZoomChange(Math.min(zoom + 10, 300));
  const handleZoomOut = () => onZoomChange(Math.max(zoom - 10, 10));
  const handleFit = () => onZoomChange(100);

  return (
    <div className="h-10 border-t bg-background flex items-center px-4 gap-3 shrink-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
            <Minus className="h-3.5 w-3.5" />
            <span className="sr-only">Zoom Out</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom Out</TooltipContent>
      </Tooltip>

      <Slider
        value={[zoom]}
        onValueChange={([v]) => onZoomChange(v)}
        min={10}
        max={300}
        step={5}
        className="w-32"
      />

      <span className="text-xs text-muted-foreground w-10 text-center tabular-nums">
        {zoom}%
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only">Zoom In</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom In</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleFit}>
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="sr-only">Fit to Screen</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fit to Screen (100%)</TooltipContent>
      </Tooltip>
    </div>
  );
}
