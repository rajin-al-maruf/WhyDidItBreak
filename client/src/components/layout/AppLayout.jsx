import Navbar from '../common/Navbar';

const AppLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-purple-500/25 selection:text-purple-200">
      {/* Subtle ambient lighting effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>WhyDidItBreak — AI-Assisted Error Monitoring & Debugging MVP</span>
          <span className="font-mono text-[11px] text-zinc-600">Module 1 · JavaScript SDK Ingestion</span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
