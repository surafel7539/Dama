import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function Cart({ cartItems, setCartItems, navigateTo }) {
  // Helper function to safely extract numeric price
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;
  };

  // Safe subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * (item.qty || 1);
  }, 0);

  // Quantity Handlers
  const handleIncreaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        (item._id || item.id) === id ? { ...item, qty: (item.qty || 1) + 1 } : item
      )
    );
  };

  const handleDecreaseQty = (id) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if ((item._id || item.id) === id) {
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter(item => item.qty > 0)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl font-bold mb-8">Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0a291f] rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigateTo('marketplace')} 
            className="bg-[#c29b57] text-[#041c14] px-6 py-2.5 rounded font-bold"
          >
            Marketplace
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const itemId = item._id || item.id;
              const itemName = item.name || item.title || 'Product';
              const itemImage = item.image || item.imageUrl || 'https://via.placeholder.com/150';
              const sellerName = typeof item.seller === 'object' && item.seller !== null
                ? item.seller.fullName || item.seller.email
                : (item.seller || 'Verified Seller');

              return (
                <div key={itemId} className="p-4 rounded-xl bg-white dark:bg-[#0a291f] border border-gray-400 dark:border-gray-800 flex items-center gap-4">
                  <img 
                    src={itemImage} 
                    alt={itemName} 
                    className="w-20 h-20 object-contain rounded border bg-gray-800 border-gray-800 dark:bg-gray-800" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold dark:text-white text-gray-500 text-sm">{itemName}</h3>
                    <p className="text-xs text-gray-400">{sellerName}</p>
                    <p className="text-sm font-bold text-[#c29b57] mt-1">
                      Br {parsePrice(item.price).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDecreaseQty(itemId)}
                      className="p-1 hover:text-[#c29b57] text-gray-400 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="text-sm font-bold px-3 py-1 bg-gray-800 text-white rounded">
                      Qty: {item.qty}
                    </span>

                    <button 
                      onClick={() => handleIncreaseQty(itemId)}
                      className="p-1 hover:text-[#c29b57] text-gray-400 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>

                    <button 
                      onClick={() => handleRemoveItem(itemId)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors ml-2"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 h-fit space-y-4">
            <h2 className="font-bold text-lg dark:text-white text-gray-700 border-b border-gray-200 dark:border-gray-800 pb-3">Order Summary</h2>
            <div className="flex justify-between text-sm">
              <span className="dark:text-gray-400 text-gray-600">Subtotal</span>
              <span className="font-bold">Br {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="font-bold text-green-500">Free</span>
            </div>
            <div className="border-t dark:text-white text-gray-600 border-gray-200 dark:border-gray-800 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#c29b57]">Br {subtotal.toLocaleString()}</span>
            </div>
            <button onClick={() => navigateTo('checkout')} className="w-full bg-[#c29b57] text-[#041c14] py-3 rounded-lg font-bold hover:bg-[#a88548] transition-colors">
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}