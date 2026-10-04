import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ navigateTo = () => {} }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Logging in...');

    try {
      // Calls the actual login function from your AuthContext and backend API
      await login(formData.email, formData.password);

      toast.dismiss(toastId);
      toast.success('Login Successful!');
      
      // Navigate to buyer dashboard (or home) after successful login
      navigateTo('marketplace');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-xs text-gray-400 mb-6">Log in to access your account</p>
        
        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded p-3 text-sm focus:ring-1 focus:ring-[#c29b57] focus:border-[#c29b57] focus:outline-none" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded p-3 pr-10 text-sm focus:ring-1 focus:ring-[#c29b57] focus:border-[#c29b57] focus:outline-none" 
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ba39a]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#c29b57] text-[#041c14] py-3 rounded font-bold hover:bg-[#a88548] transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6">
          Don't have an account?{' '}
          <button 
            onClick={() => navigateTo('register')} 
            className="text-[#c29b57] font-bold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}