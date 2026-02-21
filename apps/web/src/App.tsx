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

function App() {
  return (
    <Routes>
      {/* Dashboard uses the shared Layout with AppNav */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Editor routes render their own full-screen layout */}
      <Route path="/editor/design/:id" element={<DesignEditorPage />} />
      <Route path="/editor/portfolio/:id" element={<PortfolioEditorPage />} />
      <Route path="/builder/page/:id" element={<PageBuilderPage />} />

      {/* Preview routes (authenticated, full render without editor chrome) */}
      <Route path="/preview/design/:id" element={<DesignPreviewPage />} />
      <Route path="/preview/portfolio/:id" element={<PortfolioPreviewPage />} />
      <Route path="/preview/page/:id" element={<PagePreviewPage />} />

      {/* Public published routes */}
      <Route path="/d/:id" element={<PublishedDesignPage />} />
      <Route path="/portfolio/:id" element={<PublishedPortfolioPage />} />
      <Route path="/p/:slug" element={<PublishedPagePage />} />
    </Routes>
  );
}

export default App;
