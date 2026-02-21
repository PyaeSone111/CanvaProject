import { Outlet } from 'react-router-dom';
import { AppNav } from './AppNav';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
