"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { ArrowUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChat from "./AICHAT";
import { useShop } from "../context/ShopContext";
import { pageFromPath, useNavigateTo } from "../context/NavigationContext";

export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigateTo = useNavigateTo();
  const {
    darkMode,
    setDarkMode,
    searchQuery,
    setSearchQuery,
    wishlist,
    wishlistIds,
    cartCount,
    addToCart,
    toggleWishlist,
  } = useShop();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const onSearchChange = (query) => {
    setSearchQuery(query);
    if (pathname.startsWith("/marketplace")) {
      router.replace(
        query
          ? `/marketplace?search=${encodeURIComponent(query)}`
          : "/marketplace",
        { scroll: false }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#041c14] text-[#041c14] dark:text-white font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? "#0a291f" : "#ffffff",
            color: darkMode ? "#ffffff" : "#041c14",
            border: "1px solid #c29b57",
          },
        }}
      />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentPage={pageFromPath(pathname)}
        navigateTo={navigateTo}
        searchQuery={searchQuery}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onSearchChange={onSearchChange}
      />

      <main>{children}</main>

      <Footer navigateTo={navigateTo} />

      <AIChat
        navigateTo={navigateTo}
        addToCart={addToCart}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
      />

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-[#c29b57] text-[#041c14] shadow-lg flex items-center justify-center hover:bg-[#a88548]"
          title="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
