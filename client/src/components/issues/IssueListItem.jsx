import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../common/Icons';

const IssueListItem = ({ issue, projectId }) => {
  return (
    <Link
      to={`/projects/${projectId}/issues/${issue._id}`}
      className="flex items-center justify-between p-4 sm:px-6 hover:bg-white/[0.03] transition group"
    >
      <div className="flex items-start gap-3.5 min-w-0 pr-4">
        <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-red-400 shadow-sm shadow-red-400/50" />

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-purple-300 transition truncate">
            {issue.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
            <span className="font-mono text-zinc-400">
              ID: {issue._id.slice(-6)}
            </span>
            <span>•</span>
            <span>First seen: {new Date(issue.firstSeen).toLocaleDateString()}</span>
            <span>•</span>
            <span>
              Last seen:{' '}
              {new Date(issue.lastSeen).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="inline-flex items-center rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-300">
          {issue.occurrenceCount} {issue.occurrenceCount === 1 ? 'event' : 'events'}
        </span>

        <ChevronRightIcon className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
      </div>
    </Link>
  );
};

export default IssueListItem;