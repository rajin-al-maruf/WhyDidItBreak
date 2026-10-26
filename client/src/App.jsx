import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './api/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectSettingsPage from './pages/ProjectSettingsPage.jsx';

function App() {
  const { user, loading, sessionError } = useContext(AuthContext);

  if (loading) {
    return <p>Checking your session...</p>;
  }

  return (
    <Router>
      {sessionError && !user && (<p role="alert">{sessionError}</p>)}

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
            user ? <ProjectsPage /> : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={user ? '/projects' : '/auth'} replace />
          }
        />

        <Route
          path="/projects/:id"
          element={
            user
              ? <ProjectSettingsPage />
              : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;