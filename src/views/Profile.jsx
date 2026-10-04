
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function Profile({ navigateTo = () => {} }) {
  const { user, deleteAccount, setUser } = useAuth();
  const [activeTab , setActiveTab] = useState('profile')
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
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileLoading(true);

    const toastId = toast.loading('Updating profile...');

    try {
      const data = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName }),
      });

      // Update local user state
      if (data.user) {
        setUser(data.user);
      }

      toast.dismiss(toastId);
      toast.success(data.message || 'Profile updated successfully!');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
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
      toast.success(
        data.message || 'Password changed successfully!'
      );

      setPasswords({
        currentPassword: '',
        newPassword: '',
      });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account?\n\nYour account and all your listings will be deleted. This cannot be undone.'
    );

    if (!confirmed) return;

    const secondConfirm = window.confirm(
      'This is permanent. Your listings will also be deleted.\n\nContinue?'
    );

    if (!secondConfirm) return;

    setDeleteLoading(true);

    const toastId = toast.loading('Deleting your account...');

    try {
      // Call backend
      await apiRequest('/auth/delete-account', {
        method: 'DELETE',
      });

      // Remove authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('isPremium');

      // Clear cart
      localStorage.removeItem('cart');

      // Clear user state
      if (setUser) {
        setUser(null);
      }

      toast.dismiss(toastId);
      toast.success('Your account has been deleted.');

      // Go back to home
      navigateTo('home');

      // Reload to completely clear application state
      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (err) {
      toast.dismiss(toastId);

      toast.error(
        err.message || 'Failed to delete account.'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
  <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
    <h1 className="text-2xl font-bold dark:text-white text-[#041c14] mb-6">
      Profile
    </h1>

    <div className="grid lg:grid-cols-4 gap-8">

      {/* SIDEBAR */}
      <div className="space-y-2">

        <button
          onClick={() => navigateTo("buyer-dashboard")}
          className="w-full text-left p-3 rounded font-bold text-sm transition-colors
          dark:text-white text-[#041c14]
          hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          My Orders
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left p-3 rounded text-sm transition-colors ${
            activeTab === "profile"
              ? "bg-[#c29b57] text-[#041c14] font-bold"
              : "dark:text-white text-[#041c14] hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Profile
        </button>

      </div>

      {/* CONTENT */}
      <div className="lg:col-span-2 space-y-6">

        {/* PERSONAL DETAILS */}
        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">

          <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <h2 className="text-lg font-bold dark:text-white text-[#041c14]">
              Personal Information
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Manage your personal account information
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">

            <div>
              <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                Full Name
              </label>

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800
                bg-transparent dark:text-white text-[#041c14]
                focus:outline-none focus:border-[#c29b57]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                Email Address
              </label>

              <input
                type="email"
                disabled
                value={email}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800
                bg-gray-100 dark:bg-gray-900
                dark:text-white text-[#041c14]
                cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-[#c29b57] text-[#041c14] px-6 py-2.5
              rounded-lg font-bold text-sm
              hover:bg-[#a88548] transition-colors
              disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>

          </form>
        </div>


        {/* SECURITY */}
        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">

          <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <h2 className="text-lg font-bold dark:text-white text-[#041c14]">
              Security
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Update your password to keep your account safe
            </p>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >

            <div>
              <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                Current Password
              </label>

              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800
                bg-transparent dark:text-white text-[#041c14]
                focus:outline-none focus:border-[#c29b57]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-bold mb-1">
                New Password
              </label>

              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800
                bg-transparent dark:text-white text-[#041c14]
                focus:outline-none focus:border-[#c29b57]"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[#c29b57] text-[#041c14]
              px-6 py-2.5 rounded-lg font-bold text-sm
              hover:bg-[#a88548] transition-colors
              disabled:opacity-50"
            >
              {passwordLoading
                ? "Updating Password..."
                : "Change Password"}
            </button>

          </form>
        </div>


        {/* DANGER ZONE */}
        <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-red-500/20">

          <div className="border-b border-red-500/20 pb-4 mb-6">

            <h2 className="text-lg font-bold text-red-400">
              Danger Zone
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Permanently delete your DAMA account
            </p>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <p className="font-bold text-sm dark:text-white text-[#041c14]">
                Delete Account
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your account and all associated listings will be permanently deleted.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="bg-red-500/10 text-red-400
              border border-red-500/20
              px-5 py-2.5 rounded-lg
              font-bold text-sm
              hover:bg-red-500/20
              transition-colors
              disabled:opacity-50
              whitespace-nowrap"
            >
              {deleteLoading
                ? "Deleting..."
                : "Delete Account"}
            </button>

          </div>

        </div>

      </div>
    </div>
  </div>
);
}

