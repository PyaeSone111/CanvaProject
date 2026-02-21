import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CanvasObject } from '@/types';

interface PropertiesPanelProps {
  object: CanvasObject | null;
  onUpdate: (updates: Partial<CanvasObject>) => void;
}

export function PropertiesPanel({ object, onUpdate }: PropertiesPanelProps) {
  if (!object) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select an element on the canvas to view its properties.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 flex flex-col gap-4">
        {/* Object name */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Element
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prop-name" className="text-xs">Name</Label>
            <Input
              id="prop-name"
              value={object.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <Separator />

        {/* Position */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Position
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="prop-x" className="text-xs">X</Label>
              <Input
                id="prop-x"
                type="number"
                value={Math.round(object.x)}
                onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="prop-y" className="text-xs">Y</Label>
              <Input
                id="prop-y"
                type="number"
                value={Math.round(object.y)}
                onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Size
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="prop-w" className="text-xs">Width</Label>
              <Input
                id="prop-w"
                type="number"
                value={Math.round(object.width)}
                onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="prop-h" className="text-xs">Height</Label>
              <Input
                id="prop-h"
                type="number"
                value={Math.round(object.height)}
                onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Appearance */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Appearance
          </p>
          <div className="flex flex-col gap-3">
            {/* Fill */}
            <div className="flex items-center gap-2">
              <Label className="text-xs w-14 shrink-0">Fill</Label>
              <div className="relative flex-1">
                <input
                  type="color"
                  value={object.fill}
                  onChange={(e) => onUpdate({ fill: e.target.value })}
                  className="absolute inset-0 w-full h-8 cursor-pointer opacity-0"
                />
                <div
                  className="h-8 rounded-md border flex items-center px-2 gap-2 text-xs"
                >
                  <div
                    className="h-4 w-4 rounded-sm border shrink-0"
                    style={{ backgroundColor: object.fill }}
                  />
                  {object.fill}
                </div>
              </div>
            </div>

            {/* Stroke */}
            <div className="flex items-center gap-2">
              <Label className="text-xs w-14 shrink-0">Stroke</Label>
              <div className="relative flex-1">
                <input
                  type="color"
                  value={object.stroke === 'transparent' ? '#000000' : object.stroke}
                  onChange={(e) => onUpdate({ stroke: e.target.value })}
                  className="absolute inset-0 w-full h-8 cursor-pointer opacity-0"
                />
                <div
                  className="h-8 rounded-md border flex items-center px-2 gap-2 text-xs"
                >
                  <div
                    className="h-4 w-4 rounded-sm border shrink-0"
                    style={{ backgroundColor: object.stroke }}
                  />
                  {object.stroke}
                </div>
              </div>
            </div>

            {/* Stroke width */}
            <div className="flex items-center gap-2">
              <Label className="text-xs w-14 shrink-0">Border</Label>
              <Input
                type="number"
                value={object.strokeWidth}
                onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
                className="h-8 text-xs flex-1"
                min={0}
                max={50}
              />
            </div>

            {/* Opacity */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Opacity</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(object.opacity * 100)}%
                </span>
              </div>
              <Slider
                value={[object.opacity * 100]}
                onValueChange={([v]) => onUpdate({ opacity: v / 100 })}
                min={0}
                max={100}
                step={1}
              />
            </div>

            {/* Rotation */}
            <div className="flex items-center gap-2">
              <Label className="text-xs w-14 shrink-0">Rotate</Label>
              <Input
                type="number"
                value={object.rotation}
                onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
                className="h-8 text-xs flex-1"
                min={0}
                max={360}
              />
            </div>
          </div>
        </div>

        {/* Text properties */}
        {object.type === 'text' && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Text
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="prop-text" className="text-xs">Content</Label>
                  <Input
                    id="prop-text"
                    value={object.text || ''}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="prop-fontsize" className="text-xs">Font Size</Label>
                  <Input
                    id="prop-fontsize"
                    type="number"
                    value={object.fontSize || 16}
                    onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                    className="h-8 text-xs"
                    min={8}
                    max={200}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
