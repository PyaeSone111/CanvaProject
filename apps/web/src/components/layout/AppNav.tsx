import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Image, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/editor', label: 'Editor', icon: PenSquare },
  { to: '/portfolio/demo', label: 'Portfolio', icon: Image },
  { to: '/login', label: 'Login', icon: LogIn },
];

export function AppNav() {
  const location = useLocation();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 items-center px-4 gap-6">
        <Link to="/" className="font-semibold text-lg">
          Canva
        </Link>
        <div className="flex gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                location.pathname === to || (to !== '/login' && location.pathname.startsWith(to))
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
