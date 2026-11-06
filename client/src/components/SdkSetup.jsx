import { useState } from 'react';
import { CopyIcon, CheckIcon, TerminalIcon, ShieldIcon } from './common/Icons';

const SdkSetup = ({ ingestionKey }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('quickstart');

  const endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/events`;
  const keyDisplay = ingestionKey || 'YOUR_PROJECT_KEY';

  const quickstartSnippet = `import {
  init,
  startErrorListener,
  sendReport,
} from './lib/whydiditbreak.js';

// Initialize the WhyDidItBreak SDK
init({
  ingestionKey: ${JSON.stringify(keyDisplay)},
  endpoint: ${JSON.stringify(endpoint)},
  environment: 'production',
  captureStack: true,
  captureUrl: true,
  captureBrowser: true,
});

// Start automatic error and rejection listener
startErrorListener(async function (report) {
  await sendReport(report);
});`;

  const manualSnippet = `import { captureException, sendReport } from './lib/whydiditbreak.js';

try {
  // Your critical application operation
  executeCriticalTask();
} catch (error) {
  // Explicitly capture and deliver caught error
  captureException(error, async function (report) {
    await sendReport(report);
  });
}`;

  const currentSnippet = activeTab === 'quickstart' ? quickstartSnippet : manualSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failures
    }
  };

  return (
    <div className="space-y-5">
      {/* Step by step checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 font-mono text-xs font-bold mb-2">
            1
          </div>
          <h4 className="text-xs font-semibold text-zinc-200">Copy SDK file</h4>
          <p className="mt-1 text-[11px] text-zinc-400">
            Copy the lightweight SDK into your project at <code className="text-purple-300 font-mono">src/lib/whydiditbreak.js</code>.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 font-mono text-xs font-bold mb-2">
            2
          </div>
          <h4 className="text-xs font-semibold text-zinc-200">Initialize in Entrypoint</h4>
          <p className="mt-1 text-[11px] text-zinc-400">
            Import and initialize in your main entry file (<code className="text-purple-300 font-mono">main.jsx</code> or <code className="text-purple-300 font-mono">index.js</code>).
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 font-mono text-xs font-bold mb-2">
            3
          </div>
          <h4 className="text-xs font-semibold text-zinc-200">Embed Ingestion Key</h4>
          <p className="mt-1 text-[11px] text-zinc-400">
            Reveal your project ingestion key above so it appears pre-filled in the snippet.
          </p>
        </div>
      </div>

      {/* Code Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4 text-purple-400" />
            <div className="flex items-center gap-1 rounded-lg bg-zinc-950 p-1 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab('quickstart')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                  activeTab === 'quickstart'
                    ? 'bg-purple-600/80 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Automatic Listener
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-purple-600/80 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Manual Capture
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Snippet</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed">
          <pre>
            <code>{currentSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Privacy and Security guarantees */}
      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/30 p-4 flex items-start gap-3 text-xs text-zinc-400">
        <ShieldIcon className="h-4 w-4 shrink-0 text-purple-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-zinc-300">Automatic Data Minimization & Secret Redaction</p>
          <p className="text-[11px]">
            The SDK automatically sanitizes error messages and stack traces to strip Bearer tokens, passwords, and emails before dispatch. It omits cookies, authorization headers, and request bodies by default.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SdkSetup;
