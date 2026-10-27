import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProject , updateProject, deleteProject, getIngestionKey, rotateIngestionKey} from '../api/projectApi';
import SdkSetup from '../components/SdkSetup.jsx';

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
  const [ingestionKey, setIngestionKey] = useState('');
  const [isLoadingKey, setIsLoadingKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const [keyMessage, setKeyMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      setLoading(true);
      setError('');
      setIngestionKey('');
      setKeyError('');

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

  const handleShowKey = async () => {
    if (isLoadingKey || isDeleting) return;

    setKeyError('');

    if (ingestionKey) {
      setIngestionKey('');
      return;
    }

    setIsLoadingKey(true);

    try {
      const data = await getIngestionKey(id);
      setIngestionKey(data.ingestionKey);
    } catch (error) {
      setKeyError(
        error.response?.data?.message || 'Unable to retrieve key.'
      );
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleRotateKey = async () => {
    if (isRotating || isLoadingKey || isDeleting) return;

    const confirmed = window.confirm(
      'Replace this project’s ingestion key? Applications using it will need the new key.'
    );

    if (!confirmed) return;

    setKeyError('');
    setKeyMessage('');
    setIngestionKey('');
    setIsRotating(true);

    try {
      const data = await rotateIngestionKey(id);

      setIngestionKey(data.ingestionKey);
      setKeyMessage('Key rotated. Update your SDK configuration.');
    } catch (error) {
      setKeyError(
        error.response?.data?.message || 'Unable to rotate key.'
      );
    } finally {
      setIsRotating(false);
    }
  }

  const handleCopyKey = async () => {
    if (!ingestionKey || isRotating || isLoadingKey || isDeleting) return;

    setKeyError('');
    setKeyMessage('');

    try {
      await navigator.clipboard.writeText(ingestionKey);
      setKeyMessage('Key copied.');
    } catch {
      setKeyError('Unable to copy. Please select and copy the key manually.');
    }
  }

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

          <section className="mt-8 space-y-3">
            <h2 className="font-semibold">SDK ingestion key</h2>

            <p>Use this key when configuring the SDK in your application.</p>

            <button
              type="button"
              onClick={handleShowKey}
              disabled={isLoadingKey || isDeleting}
            >
              {isLoadingKey
                ? 'Loading...'
                : ingestionKey
                  ? 'Hide key'
                  : 'Show key'}
            </button>

            <SdkSetup ingestionKey={ingestionKey} />

            {ingestionKey && (
              <div className="space-y-2">
                <code className="block break-all rounded border p-3">
                  {ingestionKey}
                </code>
                
                <button
                  type="button"
                  onClick={handleCopyKey}
                  disabled={isRotating || isLoadingKey || isDeleting}
                >
                  Copy key
                </button>
              </div>
            )}

            {keyError && <p role="alert">{keyError}</p>}

            <button
              type="button"
              onClick={handleRotateKey}
              disabled={isRotating || isLoadingKey || isDeleting}
            >
              {isRotating ? 'Rotating...' : 'Rotate key'}
            </button>

            {keyMessage && <p role="status">{keyMessage}</p>}
          </section>
        </section>
      )}
    </main>
  );
};

export default ProjectSettingsPage;