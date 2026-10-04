"use client";

import React, { createContext, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { useShop } from "./ShopContext";

const NavigationContext = createContext(null);

const PROTECTED_PAGES = new Set([
  "checkout",
  "buyer-dashboard",
  "profile",
  "seller-dashboard",
  "upgrade-payment",
]);

export function pageFromPath(pathname = "") {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/marketplace")) return "marketplace";
  if (pathname.startsWith("/product")) return "product-details";
  if (pathname.startsWith("/categories")) return "categories";
  if (pathname.startsWith("/cart")) return "cart";
  if (pathname.startsWith("/checkout")) return "checkout";
  if (pathname.startsWith("/login")) return "login";
  if (pathname.startsWith("/register")) return "register";
  if (pathname.startsWith("/buyer")) return "buyer-dashboard";
  if (pathname.startsWith("/seller")) return "seller-dashboard";
  if (pathname.startsWith("/upgrade")) return "upgrade-payment";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/wishlist")) return "wishlist";
  if (pathname.startsWith("/search")) return "search-results";
  return "home";
}

export function NavigationProvider({ children }) {
  const router = useRouter();
  const { user } = useAuth();
  const { setSearchQuery, rememberProduct } = useShop();

  const navigateTo = useCallback(
    (page, param = null) => {
      if (PROTECTED_PAGES.has(page) && !user) {
        toast.error("Please sign in to continue.");
        router.push("/login");
        return;
      }

      if (page === "seller-dashboard") {
        const isPremiumSeller =
          user?.isPremium || localStorage.getItem("isPremium") === "true";

        if (!isPremiumSeller) {
          router.push("/upgrade");
          return;
        }
      }

      if (page === "marketplace") {
        const search =
          param && typeof param === "object" ? param.search || "" : "";
        setSearchQuery(search);
        router.push(
          search
            ? `/marketplace?search=${encodeURIComponent(search)}`
            : "/marketplace"
        );
        return;
      }

      if (page === "product-details" && param) {
        rememberProduct(param);
        router.push(`/product/${param}`);
        return;
      }

      if (page === "search-results") {
        const search =
          typeof param === "string"
            ? param
            : param?.search || "";
        setSearchQuery(search);
        router.push(
          search ? `/search?q=${encodeURIComponent(search)}` : "/search"
        );
        return;
      }

      const paths = {
        home: "/",
        categories: "/categories",
        cart: "/cart",
        checkout: "/checkout",
        login: "/login",
        register: "/register",
        "buyer-dashboard": "/buyer",
        "seller-dashboard": "/seller",
        "upgrade-payment": "/upgrade",
        profile: "/profile",
        about: "/about",
        wishlist: "/wishlist",
      };

      router.push(paths[page] || "/");
    },
    [router, user, setSearchQuery, rememberProduct]
  );

  return (
    <NavigationContext.Provider value={{ navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigateTo() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigateTo must be used within NavigationProvider");
  }
  return context.navigateTo;
}
