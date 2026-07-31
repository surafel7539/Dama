import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import UpgradePayment from './pages/UpgradePayment'; // <-- Added Upgrade Payment Page
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';

// Data
import { MOCK_PRODUCTS } from './data/mockData';

export default function App() {
  const { user } = useAuth(); // Connect to global auth state
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], qty: 1 },
    { ...MOCK_PRODUCTS[1], qty: 1 }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle dark mode toggle on root element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Page Navigation Helper with Paywall Interception for Seller Hub
  const navigateTo = (page, param = null) => {
    // Intercept Seller Hub routing if user is not premium/seller
    if (page === 'seller-dashboard') {
      const isPremiumSeller = user?.role === 'seller' || user?.isPremium;
      if (!isPremiumSeller) {
        setCurrentPage('upgrade-payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (page === 'marketplace' && param && typeof param === 'object' && param.search) {
      setSearchQuery(param.search);
    } else if (param && typeof param === 'number') {
      setSelectedProductId(param);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item to Cart with Toast Notification
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => (item._id || item.id) === (product._id || product.id));
      if (exists) {
        return prev.map(item => 
          (item._id || item.id) === (product._id || product.id) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    toast.success(`${product.title || product.name || 'Item'} added to cart!`);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* 🔔 Global Toast Popups */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0a291f',
            color: '#fff',
            border: '1px solid #c29b57',
          },
        }} 
      />

      {/* 1. Permanent Navbar */}
      <Navbar 
        lang={lang} 
        setLang={setLang}
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        currentPage={currentPage} 
        navigateTo={navigateTo}
        cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)}
        onSearchChange={(query) => {
          setSearchQuery(query);
          if (currentPage !== 'marketplace') {
            setCurrentPage('marketplace');
          }
        }}
      />

      {/* 2. Main Page Router */}
      <div className={`transition-colors duration-300 ${darkMode ? 'bg-[#041c14] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <main className="min-h-[80vh]">
          {currentPage === 'home' && <Home navigateTo={navigateTo} addToCart={addToCart} />}
          {currentPage === 'marketplace' && <Marketplace navigateTo={navigateTo} addToCart={addToCart} searchQuery={searchQuery} />}
          {currentPage === 'product-details' && <ProductDetails productId={selectedProductId} addToCart={addToCart} navigateTo={navigateTo} />}
          {currentPage === 'categories' && <Categories navigateTo={navigateTo} />}
          {currentPage === 'search' && <SearchResults searchQuery={searchQuery} navigateTo={navigateTo} addToCart={addToCart} />}
          {currentPage === 'cart' && <Cart cartItems={cartItems} setCartItems={setCartItems} navigateTo={navigateTo} />}
          {currentPage === 'checkout' && <Checkout navigateTo={navigateTo} />}
          
          {/* Auth Pages */}
          {currentPage === 'login' && <Login navigateTo={navigateTo} />}
          {currentPage === 'register' && <Register navigateTo={navigateTo} />}
          
          {/* Dashboards & Monetization */}
          {currentPage === 'buyer-dashboard' && (
            user ? <BuyerDashboard navigateTo={navigateTo} /> : <Login navigateTo={navigateTo} />
          )}
          {currentPage === 'seller-dashboard' && (
            (user?.role === 'seller' || user?.isPremium) ? <SellerDashboard navigateTo={navigateTo} /> : <UpgradePayment navigateTo={navigateTo} />
          )}
          {currentPage === 'upgrade-payment' && <UpgradePayment navigateTo={navigateTo} />}

          {/* User Settings & Info */}
          {currentPage === 'profile' && <Profile navigateTo={navigateTo} />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'about' && <About navigateTo={navigateTo} />}
          {currentPage === 'contact' && <Contact />}
        </main>

        <Footer navigateTo={navigateTo} />
      </div>
    </div>
  );
}