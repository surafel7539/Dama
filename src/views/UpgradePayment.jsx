import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle, CreditCard } from 'lucide-react';

export default function UpgradePayment({ navigateTo }) {
  const { user,setUser, login } = useAuth(); // Assuming 'login' or an 'updateUser' function exists in your context
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading('Processing subscription...');

    // Simulate API call to process payment and update user role
    setTimeout(() => {
      setLoading(false);
      toast.dismiss(toastId);
      toast.success('Welcome to Premium Seller Hub!');

     localStorage.setItem("isPremium", "true");

      setUser({
        ...user,
        role: "seller",
        isPremium: true,
      });

      // Redirect straight into the unlocked dashboard
      navigateTo('seller-dashboard');
    }, 1500);
  };

  const navigateToSellerHub = () => {

  }
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold mb-2 dark:text-white">Complete Your Upgrade</h1>
        <p className="text-gray-500 dark:text-gray-400">Join thousands of successful sellers on DAMA.</p>
      </div>

      <div className="grid md:grid-cols-2 dark:text-white gap-8">
        {/* Order Summary */}
        <div className="bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 h-fit space-y-6">
          <h2 className="font-bold text-lg border-b border-gray-200 dark:border-gray-800 pb-3">Subscription Details</h2>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#c29b57]">Premium Seller Plan</h3>
              <p className="text-xs text-gray-500 mt-1">Billed Monthly</p>
            </div>
            <span className="text-xl font-bold">Br 999</span>
          </div>

          <ul className="space-y-3 py-4 border-y border-gray-200 dark:border-gray-800">
            {['Unlimited Listings', 'Priority Support', 'Sales Analytics'].map((perk, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle size={16} className="text-[#c29b57]" /> {perk}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 text-xs text-gray-400 bg-gray-50 dark:bg-[#041c14] p-4 rounded-xl">
            <ShieldCheck size={20} className="text-green-500" />
            <p>Secure, encrypted transaction. Cancel anytime from your account settings.</p>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleUpgrade} className="bg-white dark:bg-[#0a291f] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
          <h2 className="font-bold text-lg border-b border-gray-200 dark:border-gray-800 pb-3 flex items-center gap-2">
            <CreditCard size={20} /> Payment Method
          </h2>
          
          <div className="space-y-3">
            <label 
              onClick={() => setPaymentMethod('telebirr')}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'telebirr' 
                  ? 'border-[#c29b57] bg-[#c29b57]/10' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              <input type="radio" checked={paymentMethod === 'telebirr'} readOnly className="text-[#c29b57]" />
              <span className="font-bold text-sm">Telebirr / CBE Birr</span>
            </label>

            <label 
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'card' 
                  ? 'border-[#c29b57] bg-[#c29b57]/10' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              <input type="radio" checked={paymentMethod === 'card'} readOnly className="text-[#c29b57]" />
              <span className="font-bold text-sm">Credit / Debit Card</span>
            </label>
          </div>

          {/* Conditional input fields based on payment method could go here */}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#c29b57] text-[#041c14] py-4 rounded-xl font-bold hover:bg-[#a88548] transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Br 999 & Upgrade'}
          </button>
        </form>
      </div>
    </div>
  );
}