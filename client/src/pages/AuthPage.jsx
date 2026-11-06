import { useContext, useState } from 'react';
import { AuthContext } from '../api/AuthContext.jsx';
import { LogoIcon, AlertCircleIcon, CheckCircleIcon, EyeIcon, EyeOffIcon, Loader2Icon, ShieldIcon } from '../components/common/Icons';

const AuthPage = () => {
  const { login, register } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError('');
    setMessage('');

    if (!isLogin && formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isLogin
        ? await login({
            email: formData.email,
            password: formData.password,
          })
        : await register(formData);

      if (!result.success) {
        setError(result.message || 'Authentication failed.');
        return;
      }

      setFormData((previous) => ({
        ...previous,
        password: '',
      }));

      if (isLogin) {
        setMessage('Login successful. Redirecting...');
      } else {
        setMessage('Account created successfully! Please sign in with your credentials.');
        setIsLogin(true);
      }
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = (targetMode) => {
    setIsLogin(targetMode);
    setError('');
    setMessage('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 w-[500px] h-[250px] bg-blue-600/10 blur-[130px] rounded-full" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/30 p-2.5 shadow-xl shadow-purple-500/10 mb-4">
            <LogoIcon className="h-full w-full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            WhyDidItBreak
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            AI-Assisted Error Monitoring & Context-Aware Debugging
          </p>
        </div>

        {/* Auth form container */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-950/70 p-1 border border-white/[0.06] mb-6">
            <button
              type="button"
              onClick={() => toggleMode(true)}
              disabled={isSubmitting}
              className={`rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
                isLogin
                  ? 'bg-purple-600/90 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => toggleMode(false)}
              disabled={isSubmitting}
              className={`rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
                !isLogin
                  ? 'bg-purple-600/90 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback banners */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-300 animate-in fade-in duration-200"
            >
              <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 animate-in fade-in duration-200"
            >
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  placeholder="Ada Lovelace"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition disabled:opacity-50"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="developer@example.com"
                disabled={isSubmitting}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-zinc-300"
                >
                  Password
                </label>
                {!isLogin && (
                  <span className="text-[11px] text-zinc-500">Min. 8 characters</span>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={formData.password}
                  onChange={handleChange}
                  minLength={isLogin ? undefined : 8}
                  required
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2Icon className="h-4 w-4" />}
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : isLogin
                    ? 'Sign In to Dashboard'
                    : 'Create Free Account'}
              </span>
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldIcon className="h-3.5 w-3.5 text-purple-400" />
            <span>Secure JWT authentication with bcrypt-hashed credentials</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
