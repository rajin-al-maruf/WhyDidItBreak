import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProject , updateProject, deleteProject } from '../api/projectApi';

const ProjectSettingsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getProject(id);
        if (active) {
          setProject(data.project);
          setProjectName(data.project.name);
        }
      } catch (error) {
        if (active) {
          setError(error.response?.data?.message || 'Unable to load project')
        }
      } finally {
        if (active) {
            setLoading(false);
        }
      }
    };

    loadProject();

    return () => {active = false}
  }, [id]);

  const handleUpdateProject = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    const name = projectName.trim();

    setSaveError('');
    setSaveMessage('');

    if (!name || name.length > 100) {
      setSaveError('Project name must contain 1 to 100 characters.');
      return;
    }

    setIsSaving(true);

    try {
      const data = await updateProject(id, { name });

      setProject(data.project);
      setProjectName(data.project.name);
      setSaveMessage('Project updated successfully.');
    } catch (error) {
      setSaveError(
        error.response?.data?.message || 'Unable to update project.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (isDeleting || isSaving) return;

    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeleteError('');
    setIsDeleting(true);

    try {
      await deleteProject(id);

      navigate('/projects', { replace: true });
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || 'Unable to delete project.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <Link to="/projects">← Back to projects</Link>

      {loading && <p>Loading project...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && project && (
        <section>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p>Project settings</p>
          <form onSubmit={handleUpdateProject} className="mt-4 space-y-3">
            <label htmlFor="project-name">Project name</label>

            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              maxLength={100}
              required
              disabled={isSaving}
              className="block w-full rounded border p-2"
            />

            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>

            {saveError && <p role="alert">{saveError}</p>}
            {saveMessage && <p role="status">{saveMessage}</p>}
          </form>

          <div className="mt-8 space-y-3">
            <h2 className="font-semibold">Delete project</h2>

            <button
              type="button"
              onClick={handleDeleteProject}
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? 'Deleting...' : 'Delete project'}
            </button>

            {deleteError && <p role="alert">{deleteError}</p>}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProjectSettingsPage;