import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function BuyerDashboard({ navigateTo }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Profile State initialized with auth data or defaults
  const [profile, setProfile] = useState({
    name: user?.fullName || "Kebede Alemu",
    email: user?.email || "kebede.a@example.com",
    phone: "+251 91 234 5678",
    address: "Bole Sub-City, Woreda 03, Addis Ababa, Ethiopia"
  });

  // Password State for Settings tab
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

  // Sync profile when auth user context loads
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Mock Recent Orders
  const mockOrders = [
    { id: "ORD-9824", item: "Premium Watch x1", price: "Br 12,500", status: "Delivered", statusColor: "text-green-500 bg-green-500/10" },
    { id: "ORD-9825", item: "Traditional Leather Boots x1", price: "Br 4,200", status: "Pending", statusColor: "text-amber-500 bg-amber-500/10" },
    { id: "ORD-9826", item: "Handcrafted Coffee Set x1", price: "Br 2,800", status: "In Transit", statusColor: "text-blue-500 bg-blue-500/10" }
  ];

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving changes...');

    try {
      await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ fullName: profile.name }),
      });
      toast.dismiss(toastId);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to update profile');
    }
  };

  // Password Update Handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }

    const toastId = toast.loading('Updating password...');

    try {
      await apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      });
      toast.dismiss(toastId);
      toast.success('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
      <h1 className="text-2xl font-bold dark:text-white text-[#041c14] mb-6">Buyer Dashboard</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`w-full text-left p-3 rounded font-bold text-sm transition-colors ${
              activeTab === 'orders' 
                ? 'bg-[#c29b57] text-[#041c14]' 
                : 'dark:text-white text-[#041c14] hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            My Orders
          </button>

          <button 
            onClick={() => setActiveTab('profile')} 
            className={`w-full text-left p-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'profile' 
                ? 'bg-[#c29b57] text-[#041c14] font-bold' 
                : 'dark:text-white text-[#041c14] hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Profile
          </button>

          <button 
            onClick={() => setActiveTab('settings')} 
            className={`w-full text-left p-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'settings' 
                ? 'bg-[#c29b57] text-[#041c14] font-bold' 
                : 'dark:text-white text-[#041c14] hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">

          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400 uppercase font-bold">Total Orders</span>
                  <p className="text-2xl dark:text-white text-[#041c14] font-bold mt-2">12</p>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400 uppercase font-bold">Pending Orders</span>
                  <p className="text-2xl font-bold text-[#c29b57] mt-2">3</p>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400 uppercase font-bold">Total Spent</span>
                  <p className="text-2xl dark:text-white text-[#041c14] font-bold mt-2">Br 45,600</p>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                <h3 className="font-bold dark:text-white text-[#041c14]">Recent Orders</h3>
                <div className="space-y-3">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold dark:text-white text-[#041c14]">{order.id}</p>
                        <p className="text-xs text-gray-400">{order.item}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#c29b57]">{order.price}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
              <h3 className="font-bold text-lg dark:text-white text-[#041c14]">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Delivery Address</label>
                  <input 
                    type="text" 
                    value={profile.address} 
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] focus:outline-none focus:border-[#c29b57]"
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#c29b57] text-[#041c14] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a88548] transition-colors">
                Save Changes
              </button>
            </form>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
              <h3 className="font-bold text-lg dark:text-white text-[#041c14]">Account Settings</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="font-bold text-sm dark:text-white text-[#041c14]">Email Notifications</h4>
                    <p className="text-xs text-gray-400">Receive order updates and promotions via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#c29b57] w-4 h-4 cursor-pointer" />
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="font-bold text-sm dark:text-white text-[#041c14]">SMS Alerts</h4>
                    <p className="text-xs text-gray-400">Receive real-time tracking SMS updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#c29b57] w-4 h-4 cursor-pointer" />
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-sm dark:text-white text-[#041c14] mb-3">Change Password</h4>
                  <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-md">
                    <input 
                      type="password" 
                      placeholder="Current Password" 
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] text-sm focus:outline-none focus:border-[#c29b57]"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white text-[#041c14] text-sm focus:outline-none focus:border-[#c29b57]"
                    />
                    <button type="submit" className="bg-[#c29b57] text-[#041c14] px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#a88548] transition-colors">
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}