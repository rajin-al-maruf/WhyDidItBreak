const IssueContextCard = ({ issue, event }) => {
  if (!issue) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 backdrop-blur-xl shadow-xl space-y-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Issue Metadata
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs border-b border-white/[0.06] pb-5">
        <div>
          <span className="text-zinc-500 block text-[11px]">Status</span>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-400 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            {issue.status || 'open'}
          </span>
        </div>

        <div>
          <span className="text-zinc-500 block text-[11px]">Occurrences</span>
          <span className="mt-1 inline-block font-semibold text-zinc-200">
            {issue.occurrenceCount || 1} {issue.occurrenceCount === 1 ? 'event' : 'events'}
          </span>
        </div>

        <div>
          <span className="text-zinc-500 block text-[11px]">First Seen</span>
          <span className="mt-1 block font-mono text-[11px] text-zinc-300">
            {new Date(issue.firstSeen).toLocaleDateString()}
          </span>
        </div>

        <div>
          <span className="text-zinc-500 block text-[11px]">Last Seen</span>
          <span className="mt-1 block font-mono text-[11px] text-zinc-300">
            {new Date(issue.lastSeen).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

{/* Latest Event Context */}
      {event && (
        <div className="space-y-4 text-xs">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Latest Event Context
          </h4>

          <div>
            <span className="text-zinc-500 block text-[11px]">Environment</span>
            <span className="mt-1 inline-block rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
              {event.environment || 'development'}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[11px]">URL</span>
            <p className="mt-1 break-all font-mono text-[11px] text-zinc-300 bg-zinc-950/40 p-2 rounded-lg border border-white/[0.04]">
              {event.url || 'Not provided'}
            </p>
          </div>

          <div>
            <span className="text-zinc-500 block text-[11px]">User Agent</span>
            <p className="mt-1 break-all font-mono text-[10px] text-zinc-400 bg-zinc-950/40 p-2 rounded-lg border border-white/[0.04] leading-relaxed">
              {event.browser || 'Unknown'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueContextCard;