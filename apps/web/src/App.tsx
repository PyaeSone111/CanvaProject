import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DesignEditorPage } from '@/pages/DesignEditorPage';
import { PortfolioEditorPage } from '@/pages/PortfolioEditorPage';
import { PageBuilderPage } from '@/pages/PageBuilderPage';
import { PagePreviewPage } from '@/pages/PagePreviewPage';

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
      <Route path="/preview/page/:id" element={<PagePreviewPage />} />
    </Routes>
  );
}

export default App;
