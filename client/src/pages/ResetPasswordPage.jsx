import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../api/axios';

const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.put(`/auth/reset-password/${resetToken}`, { password });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your new secure password below
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Password successfully reset! Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full mt-2">
              Save New Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
