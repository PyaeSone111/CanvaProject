import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Palette, Briefcase, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const docTypes = [
  { label: 'Designs', icon: Palette, tab: 'designs' },
  { label: 'Portfolios', icon: Briefcase, tab: 'portfolios' },
  { label: 'Pages', icon: FileCode, tab: 'pages' },
];

export function AppNav() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 items-center px-4 gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-ar-iron flex items-center justify-center">
            <span className="text-xs font-bold text-[#ADB3BC]">C</span>
          </div>
          <span className="font-semibold text-lg">Canva</span>
        </Link>
        <div className="flex gap-1">
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
        {isDashboard && (
          <div className="ml-auto flex gap-1">
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
      </nav>
    </header>
  );
}
