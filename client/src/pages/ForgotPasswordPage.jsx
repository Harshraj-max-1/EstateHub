import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your account email and we'll send a password recovery link.
          </p>
        </div>

        {message ? (
          <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-xs text-slate-600 dark:text-slate-300">{message}</p>
            <Link to="/login" className="mt-4">
              <Button variant="outline" size="sm">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full mt-2">
              Send Reset Link
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
