import React from 'react';

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
        <h1 className="text-2xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">settings</h1>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
            <span>Email Notifications</span>
            <input type="checkbox" defaultChecked className="accent-[#c29b57]" />
          </div>
          <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
            <span>Two-Factor Authentication</span>
            <input type="checkbox" className="accent-[#c29b57]" />
          </div>
        </div>
      </div>
    </div>
  );
}