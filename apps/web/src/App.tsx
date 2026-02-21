import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DesignEditorPage } from '@/pages/DesignEditorPage';
import { PortfolioEditorPage } from '@/pages/PortfolioEditorPage';
import { PageBuilderPage } from '@/pages/PageBuilderPage';
import { PagePreviewPage } from '@/pages/PagePreviewPage';
import { DesignPreviewPage } from '@/pages/DesignPreviewPage';
import { PortfolioPreviewPage } from '@/pages/PortfolioPreviewPage';
import { PublishedDesignPage } from '@/pages/PublishedDesignPage';
import { PublishedPortfolioPage } from '@/pages/PublishedPortfolioPage';
import { PublishedPagePage } from '@/pages/PublishedPagePage';
import { PortfolioPublicPage } from '@/pages/PortfolioPublicPage';
import { SitePublicPage } from '@/pages/SitePublicPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Dashboard uses the shared Layout with AppNav */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Editor routes render their own full-screen layout */}
      <Route path="/editor/design/:id" element={<DesignEditorPage />} />
      <Route path="/editor/portfolio/:id" element={<PortfolioEditorPage />} />
      <Route path="/builder/page/:id" element={<PageBuilderPage />} />

      {/* Preview routes (authenticated, full render without editor chrome) */}
      <Route path="/preview/design/:id" element={<DesignPreviewPage />} />
      <Route path="/preview/portfolio/:id" element={<PortfolioPreviewPage />} />
      <Route path="/preview/page/:id" element={<PagePreviewPage />} />

      {/* Public published routes (legacy ID-based) */}
      <Route path="/d/:id" element={<PublishedDesignPage />} />
      <Route path="/portfolio/:id" element={<PublishedPortfolioPage />} />

      {/* New slug-based public routes */}
      <Route path="/p/:slug" element={<PortfolioPublicPage />} />
      <Route path="/p/:slug/:pageSlug" element={<PortfolioPublicPage />} />
      <Route path="/site/:slug" element={<SitePublicPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
