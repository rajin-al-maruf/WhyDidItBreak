import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../api/AuthContext';
import { LogoIcon, LogOutIcon, UserIcon, FolderIcon, ShieldIcon } from './Icons';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/projects" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/30 group-hover:border-purple-500/60 transition shadow-lg shadow-purple-500/10">
              <LogoIcon className="h-5 w-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold tracking-tight text-white text-base">WhyDidItBreak</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full">MVP</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              to="/projects"
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                location.pathname.startsWith('/projects')
                  ? 'bg-white/[0.08] text-white shadow-xs'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              }`}
            >
              <FolderIcon className="h-3.5 w-3.5" />
              <span>Projects</span>
            </Link>
          </nav>
        </div>

        {/* Right Section: System Status & User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>API Online</span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1.5 hover:border-white/[0.16] hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-xs font-semibold text-white uppercase shadow-sm">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-medium text-zinc-200 leading-tight max-w-[120px] truncate">{user?.name || 'Developer'}</span>
                <span className="text-[10px] text-zinc-500 leading-tight">Account</span>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                <div className="border-b border-zinc-800/80 px-3 py-2.5 mb-1">
                  <p className="text-xs font-semibold text-zinc-200">{user?.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <ShieldIcon className="h-3 w-3 text-purple-400" />
                    <span>JWT Authenticated Session</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-300">
                    <UserIcon className="h-4 w-4 text-zinc-500" />
                    <span className="text-[11px] text-zinc-400">ID: {user?.id?.slice(-8) || 'Active'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
