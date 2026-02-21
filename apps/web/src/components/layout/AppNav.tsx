import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Palette, Briefcase, FileCode, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const docTypes = [
  { label: 'Designs', icon: Palette, tab: 'designs' },
  { label: 'Portfolios', icon: Briefcase, tab: 'portfolios' },
  { label: 'Pages', icon: FileCode, tab: 'pages' },
];

export function AppNav() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-40">
      <nav className="container mx-auto flex h-14 items-center px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md bg-ar-iron flex items-center justify-center">
            <span className="text-xs font-bold text-[#ADB3BC]">C</span>
          </div>
          <span className="font-semibold text-lg">Canva</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                location.pathname === to
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop doc-type tabs (dashboard only) */}
        {isDashboard && (
          <div className="ml-auto hidden md:flex gap-1">
            {docTypes.map(({ label, icon: Icon, tab }) => (
              <Link
                key={tab}
                to={`/dashboard?tab=${tab}`}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile hamburger */}
        <div className="ml-auto md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background absolute left-0 right-0 top-14 shadow-lg z-50">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  location.pathname === to
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {isDashboard && (
              <>
                <div className="h-px bg-border my-1" />
                <p className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Jump to
                </p>
                {docTypes.map(({ label, icon: Icon, tab }) => (
                  <Link
                    key={tab}
                    to={`/dashboard?tab=${tab}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
