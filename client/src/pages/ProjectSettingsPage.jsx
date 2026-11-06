import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getProject,
  updateProject,
  deleteProject,
  getIngestionKey,
  rotateIngestionKey,
} from '../api/projectApi';
import SdkSetup from '../components/SdkSetup.jsx';
import Modal from '../components/common/Modal.jsx';
import {
  ArrowLeftIcon,
  KeyIcon,
  CopyIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
  TrashIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  Loader2Icon,
  ActivityIcon,
} from '../components/common/Icons';

const ProjectSettingsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Ingestion key states
  const [ingestionKey, setIngestionKey] = useState('');
  const [isLoadingKey, setIsLoadingKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Modal dialog states
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load project.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      active = false;
    };
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
      setSaveMessage('Project settings updated successfully.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Unable to update project.');
    } finally {
      setIsSaving(false);
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
    } catch (err) {
      setKeyError(err.response?.data?.message || 'Unable to retrieve ingestion key.');
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleCopyKey = async () => {
    if (!ingestionKey || isRotating || isLoadingKey || isDeleting) return;

    setKeyError('');
    setKeyMessage('');

    try {
      await navigator.clipboard.writeText(ingestionKey);
      setCopiedKey(true);
      setKeyMessage('Ingestion key copied to clipboard.');
      setTimeout(() => {
        setCopiedKey(false);
        setKeyMessage('');
      }, 2500);
    } catch {
      setKeyError('Unable to access clipboard. Please copy the key manually.');
    }
  };

  const handleConfirmRotate = async () => {
    setKeyError('');
    setKeyMessage('');
    setIsRotating(true);

    try {
      const data = await rotateIngestionKey(id);
      setIngestionKey(data.ingestionKey);
      setKeyMessage('Ingestion key rotated successfully. Make sure to update your application configuration.');
      setShowRotateModal(false);
    } catch (err) {
      setKeyError(err.response?.data?.message || 'Unable to rotate ingestion key.');
    } finally {
      setIsRotating(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteError('');
    setIsDeleting(true);

    try {
      await deleteProject(id);
      setShowDeleteModal(false);
      navigate('/projects', { replace: true });
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Unable to delete project.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb navigation */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300"
        >
          <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-1/3 bg-zinc-800 rounded-xl" />
          <div className="h-48 rounded-2xl bg-zinc-900/40 border border-white/[0.06]" />
          <div className="h-64 rounded-2xl bg-zinc-900/40 border border-white/[0.06]" />
        </div>
      )}

      {/* Project Content */}
      {!loading && !error && project && (
        <div className="space-y-8">
          {/* Project Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <ActivityIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {project.name}
                  </h1>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Project ID: <span className="font-mono text-zinc-300">{project._id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: General Settings */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-6 backdrop-blur-xl">
            <h2 className="text-base font-semibold text-white">General Settings</h2>
            <p className="mt-1 text-xs text-zinc-400">
              Update project details and identifiers.
            </p>

            <form onSubmit={handleUpdateProject} className="mt-5 max-w-lg space-y-4">
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  maxLength={100}
                  required
                  disabled={isSaving}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition disabled:opacity-50"
                />
              </div>

              {saveError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"
                >
                  <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveMessage && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300"
                >
                  <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{saveMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving || projectName.trim() === project.name}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/20 hover:bg-purple-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2Icon className="h-3.5 w-3.5" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>

          {/* Section 2: SDK Ingestion Key (FR-03) */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <KeyIcon className="h-4 w-4 text-purple-400" />
                  <h2 className="text-base font-semibold text-white">Project Ingestion Key</h2>
                </div>
                <p className="mt-1 text-xs text-zinc-400 max-w-xl">
                  Used by the WhyDidItBreak SDK to identify this project when dispatching captured runtime errors.
                  This key grants write-only ingestion access and cannot read private dashboard data.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShowKey}
                  disabled={isLoadingKey}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer disabled:opacity-50"
                >
                  {isLoadingKey ? (
                    <Loader2Icon className="h-3.5 w-3.5" />
                  ) : ingestionKey ? (
                    <EyeOffIcon className="h-3.5 w-3.5" />
                  ) : (
                    <EyeIcon className="h-3.5 w-3.5" />
                  )}
                  <span>{ingestionKey ? 'Hide Key' : 'Reveal Key'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRotateModal(true)}
                  disabled={isLoadingKey}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCwIcon className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Rotate Key</span>
                </button>
              </div>
            </div>

            {/* Revealed Key Display Box */}
            {ingestionKey && (
              <div className="mt-5 rounded-xl border border-purple-500/20 bg-zinc-950/80 p-3.5 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-0.5">
                    Active Ingestion Token
                  </span>
                  <code className="text-xs font-mono text-purple-300 break-all select-all">
                    {ingestionKey}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
                >
                  {copiedKey ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Feedback messages */}
            {keyError && (
              <div
                role="alert"
                className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"
              >
                <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
                <span>{keyError}</span>
              </div>
            )}

            {keyMessage && (
              <div
                role="status"
                className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300"
              >
                <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{keyMessage}</span>
              </div>
            )}
          </div>

          {/* Section 3: SDK Integration Guide (FR-04) */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-6 backdrop-blur-xl">
            <h2 className="text-base font-semibold text-white">SDK Setup & Integration</h2>
            <p className="mt-1 text-xs text-zinc-400">
              Integrate the WhyDidItBreak lightweight JavaScript SDK into your web application.
            </p>

            <div className="mt-6">
              <SdkSetup ingestionKey={ingestionKey} />
            </div>
          </div>

          {/* Section 4: Danger Zone */}
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Permanently delete this project and all associated configurations. This action cannot be reversed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteError('');
                  setShowDeleteModal(true);
                }}
                disabled={isDeleting || isSaving}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 active:bg-red-500/30 transition cursor-pointer disabled:opacity-50"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                <span>Delete Project</span>
              </button>
            </div>

            {deleteError && (
              <div
                role="alert"
                className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"
              >
                <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
                <span>{deleteError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rotate Key Confirmation Modal */}
      <Modal
        isOpen={showRotateModal}
        onClose={() => !isRotating && setShowRotateModal(false)}
        onConfirm={handleConfirmRotate}
        title="Rotate Ingestion Key?"
        description="Rotating your ingestion key will invalidate the current token immediately. Any web application using the previous key will cease reporting errors until updated with the newly generated key."
        confirmText="Rotate Key"
        isDanger={true}
        isLoading={isRotating}
      />

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${project?.name}"?`}
        description="Are you sure you want to delete this project? All project configurations and pending context will be permanently wiped. This action cannot be undone."
        confirmText="Delete Project"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjectSettingsPage;
