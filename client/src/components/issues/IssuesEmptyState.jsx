import { Link } from 'react-router-dom';
import { ActivityIcon, ChevronRightIcon } from '../common/Icons';

const IssuesEmptyState = ({ projectId }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3">
        <ActivityIcon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-200">No issues captured yet</h3>
      <p className="mt-1 max-w-sm text-xs text-zinc-400">
        Trigger an error from your web application or click "Cause an error" in the SDK demo to see issues appear here.
      </p>
      <Link
        to={`/projects/${projectId}/settings`}
        className="mt-5 inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
      >
        <span>View SDK Setup Instructions</span>
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
};

export default IssuesEmptyState;