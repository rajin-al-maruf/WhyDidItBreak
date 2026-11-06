import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './api/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectSettingsPage from './pages/ProjectSettingsPage.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import { LogoIcon, Loader2Icon, AlertCircleIcon } from './components/common/Icons';

function App() {
  const { user, loading, sessionError } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-zinc-100 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/30 p-2.5 shadow-xl shadow-purple-500/10 mb-4 animate-pulse">
          <LogoIcon className="h-full w-full" />
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2Icon className="h-4 w-4 text-purple-400" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {sessionError && !user && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300 shadow-xl backdrop-blur-md">
          <AlertCircleIcon className="h-4 w-4 shrink-0 text-amber-400" />
          <span>{sessionError}</span>
        </div>
      )}

      <Routes>
        <Route
          path="/auth"
          element={
            user ? <Navigate to="/projects" replace /> : <AuthPage />
          }
        />

        <Route
          path="/projects"
          element={
            user ? (
              <AppLayout>
                <ProjectsPage />
              </AppLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/projects/:id"
          element={
            user ? (
              <AppLayout>
                <ProjectSettingsPage />
              </AppLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Catch-all fallback route placed at the end */}
        <Route
          path="*"
          element={
            <Navigate to={user ? '/projects' : '/auth'} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
