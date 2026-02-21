import { Square, Circle, Type, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CanvasObject } from '@/types';

interface AddPanelProps {
  onAddObject: (obj: CanvasObject) => void;
}

function uid(): string {
  return crypto.randomUUID();
}

const shapeButtons = [
  {
    label: 'Rectangle',
    icon: Square,
    factory: (): CanvasObject => ({
      id: uid(),
      type: 'rect',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 200,
      height: 150,
      fill: '#5B636E',
      stroke: '#383F4C',
      strokeWidth: 2,
      opacity: 1,
      rotation: 0,
      name: 'Rectangle',
    }),
  },
  {
    label: 'Circle',
    icon: Circle,
    factory: (): CanvasObject => ({
      id: uid(),
      type: 'circle',
      x: 150 + Math.random() * 200,
      y: 150 + Math.random() * 200,
      width: 120,
      height: 120,
      fill: '#ADB3BC',
      stroke: '#777E89',
      strokeWidth: 2,
      opacity: 1,
      rotation: 0,
      name: 'Circle',
    }),
  },
  {
    label: 'Text',
    icon: Type,
    factory: (): CanvasObject => ({
      id: uid(),
      type: 'text',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 200,
      height: 40,
      fill: '#1C222D',
      stroke: 'transparent',
      strokeWidth: 0,
      opacity: 1,
      rotation: 0,
      text: 'Text block',
      fontSize: 24,
      fontFamily: 'sans-serif',
      name: 'Text',
    }),
  },
  {
    label: 'Image',
    icon: ImageIcon,
    factory: (): CanvasObject => ({
      id: uid(),
      type: 'image',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 200,
      height: 200,
      fill: '#9199A4',
      stroke: '#777E89',
      strokeWidth: 1,
      opacity: 1,
      rotation: 0,
      src: '/placeholder.svg?height=200&width=200',
      name: 'Image',
    }),
  },
];

export function AddPanel({ onAddObject }: AddPanelProps) {
  return (
    <div className="p-3 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Add Elements
      </p>
      <div className="grid grid-cols-2 gap-2">
        {shapeButtons.map(({ label, icon: Icon, factory }) => (
          <Button
            key={label}
            variant="outline"
            className="h-20 flex-col gap-2 text-xs"
            onClick={() => onAddObject(factory())}
          >
            <Icon className="h-6 w-6 text-ar-metal" />
            {label}
          </Button>
        ))}
      </div>
      <Separator />
      <p className="text-xs text-muted-foreground">
        Click an element to add it to the canvas. You can then select and modify it in the properties panel.
      </p>
    </div>
  );
}
