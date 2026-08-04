import React, { useState } from 'react';
import { Search, ShoppingCart, Sun, Moon, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'


export default function Navbar({ 
  navigateTo = () => {}, 
  cartCount = 0, 
  darkMode, 
  setDarkMode, 
  onSearchChange = () => {} 
}) {
  const { user, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle live search filter as the user types
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearchChange(value); // Triggers real-time filtering in parent/marketplace
  };

  // Handle search submission (e.g., pressing enter or clicking search icon)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateTo('marketplace', { search: searchInput });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky dark:bg-[#041c14] border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-50 transition-colors">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* 1. Logo */}
        <img 
          onClick={() => navigateTo('home')} 
          className="size-10 font-extrabold cursor-pointer text-[#c29b57]"
          src='758853720_2533852980378695_8891268762573421557_n-removebg-preview.png'
        />
          
        

        {/* 2. Navigation Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-700 dark:text-gray-200">
          <button onClick={() => navigateTo('home')} className="hover:text-[#c29b57] transition-colors">Home</button>
          <button onClick={() => navigateTo('marketplace')} className="hover:text-[#c29b57] transition-colors">Marketplace</button>
          <button onClick={() => navigateTo('categories')} className="hover:text-[#c29b57] transition-colors">Categories</button>
          <button onClick={() => navigateTo('about')} className="hover:text-[#c29b57] transition-colors">About</button>
          <button onClick={() => navigateTo('contact')} className="hover:text-[#c29b57] transition-colors">Contact</button>
        </div>

        {/* 3. Live Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchInput}
            onChange={handleSearchInput}
            className="w-full bg-gray-100 dark:bg-[#0a291f] border border-transparent focus:border-[#c29b57] rounded-full py-2 pl-4 pr-10 text-sm dark:text-white outline-none transition-all"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-[#c29b57]">
            <Search size={16} />
          </button>
        </form>
         {/* Mobile Search bar*/}
         <div className="md:hidden flex absolute justify-center align-center right-40 pb-2">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchInput}
              onChange={handleSearchInput}
              className="w-full bg-gray-100 dark:bg-[#0a291f] border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm dark:text-white outline-none"
            />
          </div>
        {/* 4. Actions: Theme Toggle, Dashboards, Cart, Auth */}
        <div className="flex items-center gap-4">
          
          {/* Light/Dark Mode Toggle Button */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full bg-gray-100 dark:bg-[#0a291f] text-gray-700 dark:text-[#c29b57] hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart Icon */}
          <button onClick={() => navigateTo('cart')} className="relative text-gray-600 dark:text-gray-300 hover:text-[#c29b57]">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dashboards & Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button onClick={() => navigateTo('buyer-dashboard')} className="text-sm font-bold hover:text-[#c29b57] transition-colors dark:text-white">
                  Buyer Hub
                </button>
                <button onClick={() =>  navigateTo('seller-dashboard') } className="text-sm font-bold text-[#c29b57] bg-[#c29b57]/10 px-3.5 py-1.5 rounded-full hover:bg-[#c29b57]/20 transition-colors">
                  Seller Hub
                </button>
                <button onClick={logout} className="text-xs text-gray-400 hover:text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => navigateTo('login')} className="text-sm font-bold hover:text-[#c29b57] dark:text-white flex items-center gap-1">
                <User size={16} /> Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-gray-700 dark:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden   mt-4 pt-4 border-t border-gray-200 relative dark:border-gray-800 space-y-2 text-sm font-bold">
         
          <button onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }} className=" rounded-2xl flex cursor-pointer align-center justify-center  hover:bg-[#c29b57]  hover:text-white text-[#c29b57] w-full text-left py-1">Home</button>
          <button onClick={() => { navigateTo('marketplace'); setMobileMenuOpen(false); }} className="rounded-2xl flex cursor-pointer align-center justify-center  hover:bg-[#c29b57]  hover:text-white w-full text-[#c29b57] text-left py-1">Marketplace</button>
          <button onClick={() => { navigateTo('categories'); setMobileMenuOpen(false); }} className="rounded-2xl flex cursor-pointer align-center justify-center  hover:bg-[#c29b57]  hover:text-white w-full text-left text-[#c29b57] py-1">Categories</button>
          <button onClick={() => { navigateTo('about'); setMobileMenuOpen(false); }} className="rounded-2xl flex cursor-pointer align-center justify-center  hover:bg-[#c29b57]  hover:text-white w-full text-left text-[#c29b57] py-1">About</button>
          <button onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }} className="rounded-2xl flex cursor-pointer align-center justify-center  hover:bg-[#c29b57]  hover:text-white w-full text-left text-[#c29b57] py-1">Contact</button>
          
          {user ? (
            <div className="pt-2 flex flex-col border-t border-gray-200  dark:border-gray-900 space-y-2">
              <button onClick={() => { navigateTo('buyer-dashboard'); setMobileMenuOpen(false); }} className="cursor-pointer rounded-2xl m-2 hover:bg-[#c29b57]  hover:text-white w-full flex align-center justify-center  text-left py-1 text-[#c29b57]">Buyer Dashboard</button>
              <button onClick={() => { navigateTo('seller-dashboard'); setMobileMenuOpen(false); }} className="cursor-pointer rounded-2xl m-2 w-full hover:bg-[#c29b57]  hover:text-white text-left py-1 flex align-center justify-center  text-[#c29b57]">Seller Dashboard</button>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="cursor-pointer w-full text-left py-1 hover:bg-[#c29b57] ml-2 rounded-2xl   flex align-center justify-center  text-red-400">Logout</button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <button onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }} className="block w-full hover:bg-[#c29b57]  text-left py-1 text-[#c29b57]">Sign In</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}