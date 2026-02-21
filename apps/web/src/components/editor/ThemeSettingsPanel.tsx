import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ThemeSettings } from '@/types';

interface ThemeSettingsPanelProps {
  theme: ThemeSettings;
  onChange: (updates: Partial<ThemeSettings>) => void;
}

const fontOptions = [
  { value: 'system-ui, sans-serif', label: 'System (Sans)' },
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
  { value: 'Menlo, monospace', label: 'Menlo (Mono)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
];

const paddingOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' },
];

export function ThemeSettingsPanel({ theme, onChange }: ThemeSettingsPanelProps) {
  return (
    <div className="space-y-5 px-1">
      {/* Typography */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Typography</p>

        <div className="space-y-1.5">
          <Label className="text-xs">Font Family</Label>
          <Select value={theme.fontFamily} onValueChange={(v) => onChange({ fontFamily: v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((f) => (
                <SelectItem key={f.value} value={f.value} className="text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Base Font Size: {theme.baseFontSize}px</Label>
          <Slider
            value={[theme.baseFontSize]}
            onValueChange={([v]) => onChange({ baseFontSize: v })}
            min={12}
            max={24}
            step={1}
            className="w-full"
          />
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colors</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Background</Label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={theme.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="h-7 w-7 rounded border cursor-pointer bg-transparent p-0"
              />
              <Input
                value={theme.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="h-7 text-[10px] font-mono flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Text</Label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="h-7 w-7 rounded border cursor-pointer bg-transparent p-0"
              />
              <Input
                value={theme.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="h-7 text-[10px] font-mono flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Accent</Label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="h-7 w-7 rounded border cursor-pointer bg-transparent p-0"
              />
              <Input
                value={theme.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="h-7 text-[10px] font-mono flex-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buttons</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Border Radius: {theme.buttonRadius}px</Label>
            <Slider
              value={[theme.buttonRadius]}
              onValueChange={([v]) => onChange({ buttonRadius: v })}
              min={0}
              max={999}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Style</Label>
            <Select value={theme.buttonStyle} onValueChange={(v) => onChange({ buttonStyle: v as 'solid' | 'outline' })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid" className="text-xs">Solid</SelectItem>
                <SelectItem value="outline" className="text-xs">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Spacing</p>
        <div className="space-y-1.5">
          <Label className="text-xs">Section Padding</Label>
          <Select value={theme.sectionPadding} onValueChange={(v) => onChange({ sectionPadding: v as ThemeSettings['sectionPadding'] })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paddingOptions.map((p) => (
                <SelectItem key={p.value} value={p.value} className="text-xs">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Preview */}
      <section className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
        <div
          className="rounded-lg border p-4 space-y-2"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
            fontFamily: theme.fontFamily,
            fontSize: `${theme.baseFontSize}px`,
          }}
        >
          <p className="font-bold" style={{ fontSize: `${theme.baseFontSize * 1.5}px` }}>
            Heading Text
          </p>
          <p>Body text preview with your selected theme settings.</p>
          <button
            style={{
              backgroundColor: theme.buttonStyle === 'solid' ? theme.accentColor : 'transparent',
              color: theme.buttonStyle === 'solid' ? '#fff' : theme.accentColor,
              border: theme.buttonStyle === 'outline' ? `2px solid ${theme.accentColor}` : 'none',
              borderRadius: `${theme.buttonRadius}px`,
              padding: '6px 16px',
              fontSize: `${theme.baseFontSize * 0.875}px`,
              fontWeight: 500,
              cursor: 'default',
            }}
          >
            Button
          </button>
        </div>
      </section>
    </div>
  );
}
