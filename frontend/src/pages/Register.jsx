import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const initialValues = {
  name: '',
  email: '',
  password: '',
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

function Register() {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell min-h-screen text-[#2b221f]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="auth-nav flex items-center justify-between rounded-full px-4 py-3 sm:px-6 bg-[#f8f4f0] border border-[#eadfce] shadow-[0_18px_50px_rgba(96,71,53,0.06)]">
          <Link to="/login" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3b18f] via-[#e39270] to-[#d77b60] text-sm font-bold text-white shadow-[0_14px_30px_rgba(214,122,91,0.25)]">
              B
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-[#2a201b]">Bookmark</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#916d5e]">Flow</div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#5d4d46] md:flex">
            <a href="#features" className="transition hover:text-[#2d201b]">Features</a>
            <a href="#workspace" className="transition hover:text-[#2d201b]">Workspace</a>
            <a href="#pricing" className="transition hover:text-[#2d201b]">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="soft-button rounded-full px-3 py-2 text-sm font-medium border border-[#eadfce] bg-[#fffdfb] text-[#43372f]"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link
              to="/login"
              className="soft-button rounded-full px-4 py-2 text-sm font-medium border border-[#eadfce] bg-[#fffdfb] text-[#43372f]"
            >
              Log in
            </Link>
          </div>
        </nav>

        <main className="grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <section className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex rounded-full border border-[#ead6c7] bg-[#f9eae0] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#b56748] shadow-sm">
              Build your personal library
            </div>

            <h1 className="text-4xl font-black tracking-[-0.06em] text-[#241d1a] sm:text-5xl lg:text-6xl">
              Collect what matters, then move faster.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-[#5d4d46]">
              Organize saved links into neat collections, pin ideas you return to, and turn your browser into a calm creative workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="primary-button rounded-full px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#f1aa82] via-[#e89272] to-[#d17b62] shadow-[0_18px_35px_rgba(214,122,91,0.25)]"
              >
                Sign in to continue
              </Link>
              <a
                href="#workspace"
                className="secondary-button rounded-full px-5 py-3 text-sm font-semibold border border-[#e8d8cb] bg-[#fffdfb] text-[#3c2d27]"
              >
                See workspace
              </a>
            </div>

            <div id="features" className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['1-click', 'Save links'],
                ['Folders', 'Keep tidy'],
                ['Search', 'Find fast'],
              ].map(([value, label]) => (
                <div key={label} className="feature-card rounded-2xl p-4 border border-[#eadfd5] bg-[#fffaf7] shadow-[0_18px_35px_rgba(88,65,56,0.05)]">
                  <div className="text-2xl font-black tracking-[-0.05em] text-[#211c1a]">{value}</div>
                  <div className="mt-1 text-sm text-[#6a5a52]">{label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="relative z-10">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(219,123,73,0.18),_transparent_40%)] blur-3xl" />
            <div className="auth-panel rounded-[2rem] p-5 sm:p-8 border border-[#ebdfd5] bg-[#fffdfb]/90 shadow-[0_30px_80px_rgba(83,61,51,0.12)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#8d766d]">Start free</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-[#241d1a]">Create account</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7efe8] text-lg font-bold text-[#5d4d46] shadow-sm">
                  ✦
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#473d39]">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e7d9ce] bg-[#faf5f1] px-3.5 py-3 text-[#2b221f] outline-none transition focus:border-[#d48363] focus:bg-white focus:ring-4 focus:ring-[#f0d3bf]"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#473d39]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e7d9ce] bg-[#faf5f1] px-3.5 py-3 text-[#2b221f] outline-none transition focus:border-[#d48363] focus:bg-white focus:ring-4 focus:ring-[#f0d3bf]"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#473d39]">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e7d9ce] bg-[#faf5f1] px-3.5 py-3 text-[#2b221f] outline-none transition focus:border-[#d48363] focus:bg-white focus:ring-4 focus:ring-[#f0d3bf]"
                    placeholder="At least 6 characters"
                  />
                  {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
                </div>

                {apiError && (
                  <div className="rounded-2xl border border-[#f0b6a2] bg-[#fff1eb] px-3 py-2.5 text-sm text-[#a4563d]">
                    {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#1d1c1a] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2d2623] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-3 text-xs text-[#7d695f]">
                <div className="h-px flex-1 bg-[#eaded3]" />
                <span>or</span>
                <div className="h-px flex-1 bg-[#eaded3]" />
              </div>

              <div className="mt-5 flex gap-3">
                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#e7d9ce] bg-[#fffaf7] px-3 py-2.5 text-sm font-medium text-[#4b3d37] transition hover:bg-[#fff4ee]">
                  <span>G</span>
                  Google
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#e7d9ce] bg-[#fffaf7] px-3 py-2.5 text-sm font-medium text-[#4b3d37] transition hover:bg-[#fff4ee]">
                  <span>◌</span>
                  GitHub
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-[#615652]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#241d1a] underline decoration-[#d3a688] underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Register;
