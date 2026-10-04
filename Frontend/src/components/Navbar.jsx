import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Sun,
  Moon,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { page: "home", label: "Home" },
  { page: "marketplace", label: "Marketplace" },
  { page: "categories", label: "Categories" },
  { page: "about", label: "About" },
];

export default function Navbar({
  navigateTo = () => {},
  cartCount = 0,
  wishlistCount = 0,
  darkMode,
  setDarkMode,
  onSearchChange = () => {},
  currentPage = "home",
  searchQuery = "",
}) {
  const { user, logout } = useAuth();
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchInput(searchQuery || "");
  }, [searchQuery]);

  const go = (page, param) => {
    navigateTo(page, param);
    setMobileMenuOpen(false);
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    if (currentPage === "marketplace") onSearchChange(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearchChange(searchInput);
    go("marketplace", { search: searchInput });
  };

  const linkClass = (page, mobile = false) => {
    const active = currentPage === page;
    if (mobile) {
      return `w-full text-center py-2.5 rounded-xl font-bold transition ${
        active
          ? "bg-[#c29b57] text-[#041c14]"
          : "text-[#c29b57] hover:bg-[#c29b57]/10"
      }`;
    }
    return `transition-colors ${
      active ? "text-[#c29b57]" : "hover:text-[#c29b57]"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#041c14]/95 backdrop-blur border-b border-gray-200 dark:border-[#17382d] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-[1600px] mx-auto flex items-center gap-3">
        <button
          onClick={() => go("home")}
          className="shrink-0 flex items-center gap-2"
          aria-label="Dama home"
        >
          <img
            className="size-10 object-contain"
            src="758853720_2533852980378695_8891268762573421557_n-removebg-preview.png"
            alt="Dama Marketplace"
          />
          <span className="hidden xl:block font-extrabold tracking-wide text-[#c29b57]">
            DAMA
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-700 dark:text-gray-200">
          {LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => go(link.page)}
              className={linkClass(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 max-w-xl relative min-w-0"
        >
          <input
            type="search"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchInput}
            className="w-full bg-[#f4f5f7] dark:bg-[#0a291f] border border-transparent focus:border-[#c29b57] rounded-full py-2.5 pl-4 pr-10 text-sm text-[#041c14] dark:text-white outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ba39a] hover:text-[#c29b57]"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
        </form>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-[#f4f5f7] dark:bg-[#0a291f] text-gray-700 dark:text-[#c29b57] hover:scale-105 transition-all"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => go("wishlist")}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#c29b57]"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c29b57] text-[#041c14] text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => go("cart")}
            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#c29b57]"
            title="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => go("buyer-dashboard")}
                  className={`text-sm font-bold px-2 py-1.5 rounded-full transition-colors ${
                    currentPage === "buyer-dashboard"
                      ? "text-[#c29b57]"
                      : "text-[#041c14] dark:text-white hover:text-[#c29b57]"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => go("seller-dashboard")}
                  className="text-sm font-bold text-[#c29b57] bg-[#c29b57]/10 px-3.5 py-1.5 rounded-full hover:bg-[#c29b57]/20 transition-colors"
                >
                  Sell
                </button>
                <button
                  onClick={() => go("profile")}
                  className="text-sm font-bold text-[#041c14] dark:text-white hover:text-[#c29b57] flex items-center gap-1 max-w-[110px]"
                  title="Profile"
                >
                  <User size={16} />
                  <span className="truncate">
                    {user.fullName?.split(" ")[0] || "Account"}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-[#8ba39a] hover:text-red-400 px-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => go("login")}
                className="text-sm font-bold text-[#041c14] dark:text-white hover:text-[#c29b57] flex items-center gap-1 bg-[#f4f5f7] dark:bg-[#0a291f] px-3 py-2 rounded-full"
              >
                <User size={16} /> Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 dark:text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-[#17382d] space-y-2">
          {LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => go(link.page)}
              className={linkClass(link.page, true)}
            >
              {link.label}
            </button>
          ))}

          {user ? (
            <div className="pt-2 border-t border-gray-200 dark:border-[#17382d] space-y-2">
              <button onClick={() => go("buyer-dashboard")} className={linkClass("buyer-dashboard", true)}>
                My Orders
              </button>
              <button onClick={() => go("seller-dashboard")} className={linkClass("seller-dashboard", true)}>
                Seller Hub
              </button>
              <button onClick={() => go("profile")} className={linkClass("profile", true)}>
                Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl font-bold text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => go("login")} className={linkClass("login", true)}>
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
