import { useContext, useState } from 'react';
import { AuthContext } from '../api/AuthContext.jsx';

const AuthPage = () => {
  const { login, register } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
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
        setMessage('Login successful.');
      } else {
        setMessage('Account created. Please log in.');
        setIsLogin(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((previous) => !previous);
    setError('');
    setMessage('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">
        {isLogin ? 'Log in to WhyDidItBreak' : 'Create an account'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              required
              className="block w-full rounded border p-2"
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={formData.password}
            onChange={handleChange}
            minLength={isLogin ? undefined : 8}
            required
            className="block w-full rounded border p-2"
          />
        </div>

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Please wait...'
            : isLogin
              ? 'Log in'
              : 'Register'}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleMode}
        disabled={isSubmitting}
      >
        {isLogin ? 'Create an account' : 'Already registered? Log in'}
      </button>
    </main>
  );
};

export default AuthPage;

