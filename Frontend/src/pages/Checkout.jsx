import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Checkout({ navigateTo = () => {}, cartItems = [], setCartItems = () => {} }) {
  const { user } = useAuth();

  // Controlled form state initialized with user context or defaults
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName ,
  });

  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [loading, setLoading] = useState(false);

  // Sync full name if auth user state loads asynchronously
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName
      }));
    }
  }, [user]);

  // Order Submit Handler
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Processing order...');

    setTimeout(() => {
      setLoading(false);
      toast.dismiss(toastId);
      toast.success('Order Placed Successfully!');

      // Clear cart items if setter is available
      if (typeof setCartItems === 'function') {
        setCartItems([]);
      }

      // Navigate to Buyer Dashboard to view recent order
      navigateTo('buyer-dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-8">
        
        {/* Shipping Information Section */}
        <div className="space-y-6 bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg border-b border-gray-200 dark:border-gray-800 pb-3">Shipping Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={shippingInfo.fullName} 
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Delivery Address</label>
              <input 
                type="text" 
                required
                placeholder='eg: Bole, Addis Ababa, Ethiopia'
                value={shippingInfo.address} 
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Phone Number</label>
              <input 
                type="text" 
                required
                placeholder='eg: +251 912 345 678'
                value={shippingInfo.phone} 
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#041c14] border border-gray-200 dark:border-gray-800 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57]" 
              />
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-6 bg-white dark:bg-[#0a291f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 h-fit">
          <h2 className="font-bold text-lg border-b border-gray-200 dark:border-gray-800 pb-3">Payment Method</h2>
          <div className="space-y-3">
            <label 
              onClick={() => setPaymentMethod('telebirr')}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                paymentMethod === 'telebirr' 
                  ? 'border-[#c29b57] bg-[#c29b57]/10' 
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'telebirr'} 
                onChange={() => setPaymentMethod('telebirr')}
                className="text-[#c29b57]" 
              />
              <span className="font-bold text-sm">Telebirr / CBE Birr</span>
            </label>

            <label 
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                paymentMethod === 'card' 
                  ? 'border-[#c29b57] bg-[#c29b57]/10' 
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')}
                className="text-[#c29b57]" 
              />
              <span className="font-bold text-sm">Credit / Debit Card</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#c29b57] text-[#041c14] py-3 rounded-lg font-bold hover:bg-[#a88548] transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>

      </form>
    </div>
  );
}