import { Link } from 'react-router-dom';
import { ActivityIcon } from '../common/Icons';

const ProjectHeader = ({ project, activeTab = 'issues', issueCount = null }) => {
  if (!project) return null;

  return (
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
          <p className="mt-1 text-xs text-zinc-400 font-mono">
            ID: {project._id}
          </p>
        </div>
      </div>

{/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06]">
        <Link
          to={`/projects/${project._id}`}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
            activeTab === 'issues'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Issues</span>
          {issueCount !== null && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                activeTab === 'issues'
                  ? 'bg-white/20 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {issueCount}
            </span>
          )}
        </Link>

        <Link
          to={`/projects/${project._id}/settings`}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          Settings
        </Link>
      </div>
    </div>
  );
};

export default ProjectHeader;