import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);
const mod = isMac ? 'Cmd' : 'Ctrl';

const sections = [
  {
    title: 'General',
    shortcuts: [
      { keys: [`${mod}`, 'S'], desc: 'Save' },
      { keys: [`${mod}`, 'Z'], desc: 'Undo' },
      { keys: [`${mod}`, 'Shift', 'Z'], desc: 'Redo' },
      { keys: ['?'], desc: 'Show shortcuts' },
    ],
  },
  {
    title: 'Canvas',
    shortcuts: [
      { keys: ['Delete'], desc: 'Delete selected' },
      { keys: ['Escape'], desc: 'Deselect' },
      { keys: [`${mod}`, 'D'], desc: 'Duplicate' },
      { keys: [`${mod}`, '+'], desc: 'Zoom in' },
      { keys: [`${mod}`, '-'], desc: 'Zoom out' },
      { keys: [`${mod}`, '0'], desc: 'Reset zoom' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: [`${mod}`, 'P'], desc: 'Preview' },
      { keys: [`${mod}`, 'Shift', 'P'], desc: 'Publish' },
    ],
  },
];

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2 max-h-[60vh] overflow-auto">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </p>
              <div className="flex flex-col gap-1.5">
                {section.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.desc}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="text-sm">{shortcut.desc}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground mx-0.5 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
