import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function Profile() {
  const { user } = useAuth();

  // Profile Information State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load user data when component mounts or user state changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // 1. Update Profile Details Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const toastId = toast.loading('Updating profile...');

    try {
      const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName }),
      });

      toast.dismiss(toastId);
      toast.success(data.message || 'Profile updated successfully!');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // 2. Change Password Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    const toastId = toast.loading('Changing password...');

    try {
      const data = await apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      });

      toast.dismiss(toastId);
      toast.success(data.message || 'Password changed successfully!');
      
      // Reset password fields
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      {/* SECTION 1: Personal Details */}
      <div className="bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Details</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your personal account information</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c29b57] transition-colors" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">
              Email Address <span className="text-[10px] text-gray-500">(Cannot be changed)</span>
            </label>
            <input 
              type="email" 
              disabled
              value={email} 
              className="w-full bg-gray-200 dark:bg-[#041c14]/50 border border-gray-300 dark:border-gray-800 rounded p-3 text-sm text-gray-500 cursor-not-allowed" 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={profileLoading}
              className="bg-[#c29b57] text-[#041c14] px-6 py-2.5 rounded font-bold hover:bg-[#a88548] transition-colors disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Security & Password Update */}
      <div className="bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
          <p className="text-xs text-gray-400 mt-1">Update your password to keep your account safe</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Current Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={passwords.currentPassword} 
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c29b57] transition-colors" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">New Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={passwords.newPassword} 
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c29b57] transition-colors" 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={passwordLoading}
              className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2.5 rounded font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {passwordLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}