import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext.jsx';
import { getProjects, createProject } from '../api/projectApi.js';
import {
  FolderIcon,
  PlusIcon,
  SearchIcon,
  ChevronRightIcon,
  KeyIcon,
  ActivityIcon,
  AlertCircleIcon,
  Loader2Icon,
} from '../components/common/Icons';

const ProjectsPage = () => {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        const data = await getProjects();
        if (active) {
          setProjects(data.projects || []);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load projects.');
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
      setShowCreateModal(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Unable to create project.');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Projects
            </h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
              {projects.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Welcome back, {user?.name || 'Developer'}. Select or register an application to monitor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreateError('');
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 active:scale-[0.99] transition cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & filters toolbar */}
      {projects.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>
        </div>
      )}

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

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-5 animate-pulse"
            >
              <div className="h-5 w-2/3 bg-zinc-800 rounded mb-4" />
              <div className="h-3 w-1/2 bg-zinc-800/60 rounded mb-8" />
              <div className="h-6 w-1/3 bg-zinc-800/40 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
            <FolderIcon className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-zinc-200">No projects yet</h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-400">
            Create your first project to receive a unique ingestion key and start monitoring errors.
          </p>
          <button
            type="button"
            onClick={() => {
              setCreateError('');
              setShowCreateModal(true);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create First Project</span>
          </button>
        </div>
      )}

      {/* Project Cards Grid */}
      {!loading && !error && projects.length > 0 && (
        <>
          {filteredProjects.length === 0 ? (
            <p className="text-xs text-zinc-500">No projects matching "{searchQuery}"</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-5 hover:border-purple-500/40 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-purple-500/5 transition duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/20 transition">
                          <ActivityIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-purple-300 transition">
                            {project.name}
                          </h2>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            ID: {project._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        JavaScript SDK
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <KeyIcon className="h-3 w-3 text-zinc-400" />
                      <span>Ingestion Key Configured</span>
                    </span>
                    <span>
                      {new Date(project.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => !isCreating && setShowCreateModal(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white">Create New Project</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Each project receives a dedicated ingestion key for error event capture.
            </p>

            <form onSubmit={handleCreateProject} className="mt-5 space-y-4">
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
                  placeholder="e.g. Acme Web Store"
                  disabled={isCreating}
                  autoFocus
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition disabled:opacity-50"
                />
              </div>

              {createError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"
                >
                  <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !projectName.trim()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating && <Loader2Icon className="h-3.5 w-3.5" />}
                  <span>{isCreating ? 'Creating...' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
