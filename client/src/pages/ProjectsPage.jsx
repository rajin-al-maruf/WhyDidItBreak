import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../api/AuthContext.jsx';
import { getProjects, createProject } from '../api/projectApi.js';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  const { user, logout } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        const data = await getProjects();

        if (active) {
          setProjects(data.projects);
        }
      } catch (error) {
        if (active) {
          setError(
            error.response?.data?.message || 'Unable to load projects.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (isCreating || loading) return;

    const name = projectName.trim();

    if (!name) {
      setCreateError('Please enter a project name.');
      return;
    }

    setCreateError('');
    setIsCreating(true);

    try {
      const data = await createProject({ name });
      setProjects((prev) => [data.project, ...prev]);
      setProjectName('');
    } catch (error) {
      setCreateError(error.response?.data?.message || 'Unable to create project.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your projects</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <button onClick={logout}>Log out</button>
      </header>

      <form onSubmit={handleCreateProject} className="space-y-3">
        <label htmlFor="project-name">Project name</label>

        <input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          maxLength={100}
          required
          disabled={isCreating || loading}
          className="block w-full rounded border p-2"
        />

        <button type="submit" disabled={isCreating || loading}>
          {isCreating ? 'Creating...' : 'Create project'}
        </button>

        {createError && <p role="alert">{createError}</p>}
      </form>

      {loading && <p>Loading projects...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project._id} className="rounded border p-4">
                <Link to={`/projects/${project._id}`}>
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </main>
  );
};

export default ProjectsPage;