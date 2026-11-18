import { useState } from 'react';
import { TerminalIcon, CopyIcon, CheckIcon } from '../common/Icons';

const StackTraceViewer = ({ stack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!stack) return;
    try {
      await navigator.clipboard.writeText(stack);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  if (!stack) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 text-center text-xs text-zinc-500">
        No stack trace available for this error event.
      </div>
    );
  }

  const lines = stack.split('\n').filter((line) => line.trim().length > 0);
  const errorHeader = lines[0] || '';
  const frameLines = lines.slice(1);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Code Window Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-zinc-900/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-semibold text-zinc-300">Stack Trace</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-700/80 hover:text-white transition cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5 text-zinc-400" />
              <span>Copy Stack</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed space-y-1">
        <div className="text-red-400 font-semibold pb-2 border-b border-white/[0.04]">
          {errorHeader}
        </div>

        <div className="pt-2 space-y-1 text-zinc-300">
          {frameLines.map((line, idx) => {
            const trimmed = line.trim();
            return (
              <div
                key={idx}
                className="flex items-start gap-3 py-0.5 px-2 rounded-md hover:bg-white/[0.04] transition group"
              >
                <span className="w-6 shrink-0 text-right text-[11px] text-zinc-600 select-none group-hover:text-zinc-500">
                  {idx + 1}
                </span>
                <span className="text-zinc-300 group-hover:text-purple-200 transition break-all">
                  {trimmed}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StackTraceViewer;