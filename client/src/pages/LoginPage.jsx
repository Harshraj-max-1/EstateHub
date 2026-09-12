import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Mail, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../utils/constants';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.user.role === 'AGENT') {
        navigate('/agent');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demo) => {
    setLoading(true);
    setError('');
    try {
      const data = await demoLogin(demo.email, demo.password);
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.user.role === 'AGENT') {
        navigate('/agent');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col items-center text-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back to EstateHub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Login to manage listings, scheduled visits, and messages
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={LogIn}
              isLoading={loading}
              className="w-full mt-2"
            >
              Login
            </Button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>1-Click Evaluator Demo Login</span>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoClick(demo)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {demo.badge}
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Quick Login →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Register Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
