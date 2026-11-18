import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getIssueDetails } from '../api/projectApi';
import StackTraceViewer from '../components/issues/StackTraceViewer';
import IssueContextCard from '../components/issues/IssueContextCard';
import { ArrowLeftIcon, AlertCircleIcon, ActivityIcon } from '../components/common/Icons';

const IssueDetailPage = () => {
  const { id: projectId, issueId } = useParams();

  const [issue, setIssue] = useState(null);
  const [latestEvent, setLatestEvent] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadIssue = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getIssueDetails(projectId, issueId);
        if (active) {
          setIssue(data.issue);
          setLatestEvent(data.latestEvent);
          setRecentEvents(data.recentEvents || []);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load issue details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadIssue();

    return () => {
      active = false;
    };
  }, [projectId, issueId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span>Back to Issues</span>
        </Link>
      </div>

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
          <div className="h-10 w-2/3 bg-zinc-800 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 rounded-2xl bg-zinc-900/40 border border-white/[0.06]" />
            <div className="h-72 rounded-2xl bg-zinc-900/40 border border-white/[0.06]" />
          </div>
        </div>
      )}

{/* Main Issue Content */}
      {!loading && !error && issue && (
        <div className="space-y-6">
          <div className="border-b border-white/[0.06] pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="text-purple-400 font-semibold">ISSUE</span>
              <span>•</span>
              <span>ID: {issue._id}</span>
              <span>•</span>
              <span className="truncate max-w-[200px]">Fingerprint: {issue.fingerprint.slice(0, 12)}...</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white break-words">
              {issue.title}
            </h1>
          </div>

{/* StackTrace + Context */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <StackTraceViewer stack={latestEvent?.stack} />

              {recentEvents.length > 1 && (
                <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 backdrop-blur-xl">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Recent Event History ({recentEvents.length})
                  </h3>
                  <div className="space-y-2">
                    {recentEvents.map((evt, idx) => (
                      <div
                        key={evt._id || idx}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-zinc-950/40 border border-white/[0.04]"
                      >
                        <div className="flex items-center gap-2">
                          <ActivityIcon className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="font-mono text-zinc-300">
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {evt.environment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <IssueContextCard issue={issue} event={latestEvent} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetailPage;