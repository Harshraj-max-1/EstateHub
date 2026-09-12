import React, { useState } from 'react';
import { User, Phone, Mail, Briefcase, Award, Lock, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { getInitials } from '../utils/formatters';
import api from '../api/axios';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    agencyName: user?.agencyName || '',
    experienceYears: user?.experienceYears || 0
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    setProfileErr('');
    try {
      await updateUserProfile(profileData);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileErr(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErr('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg('');
    setPasswordErr('');
    try {
      const res = await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        setPasswordMsg('Password changed successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordErr(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {profileData.avatar ? (
          <img
            src={profileData.avatar}
            alt={user?.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center">
            {getInitials(user?.name)}
          </div>
        )}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <Badge variant="primary">{user?.role}</Badge>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          {user?.agencyName && (
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              {user.agencyName} • {user.experienceYears || 0} Years Experience
            </p>
          )}
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Basic Info */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Profile Details
          </h3>

          {profileMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-semibold">
              {profileMsg}
            </div>
          )}
          {profileErr && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
              {profileErr}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              icon={User}
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />

            <Input
              label="Phone Number"
              icon={Phone}
              placeholder="+91 98765 43210"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />

            <Input
              label="Avatar Image URL"
              placeholder="https://..."
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
            />

            {user?.role === 'AGENT' && (
              <>
                <Input
                  label="Agency Name"
                  icon={Briefcase}
                  value={profileData.agencyName}
                  onChange={(e) => setProfileData({ ...profileData, agencyName: e.target.value })}
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  icon={Award}
                  value={profileData.experienceYears}
                  onChange={(e) =>
                    setProfileData({ ...profileData, experienceYears: Number(e.target.value) })
                  }
                />
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Short Bio
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Tell potential clients about your real estate background..."
              />
            </div>

            <Button type="submit" variant="primary" size="sm" isLoading={profileLoading} className="mt-2">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Security & Password
          </h3>

          {passwordMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-semibold">
              {passwordMsg}
            </div>
          )}
          {passwordErr && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
              {passwordErr}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <Input
              label="Current Password"
              type="password"
              icon={Lock}
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              required
            />

            <Input
              label="New Password"
              type="password"
              icon={Lock}
              placeholder="At least 6 characters"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              required
            />

            <Button type="submit" variant="outline" size="sm" isLoading={passwordLoading} className="mt-2">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
