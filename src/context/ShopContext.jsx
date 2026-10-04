"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { apiRequest } from "../services/api";
import { MOCK_PRODUCTS } from "../data/mockData";
import { productId, productName, stockOf } from "../utils/product";

const ShopContext = createContext(null);

function readStored(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  const wishlistIds = wishlist.map((item) => String(productId(item)));
  const catalog =
    productsError && products.length === 0 ? MOCK_PRODUCTS : products;

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
    setCartItems(readStored("cart", []));
    setWishlist(readStored("wishlist", []));
    setRecentProducts(readStored("recent-products", []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("recent-products", JSON.stringify(recentProducts));
  }, [recentProducts, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dama-theme", darkMode ? "dark" : "light");
  }, [darkMode, ready]);

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        const data = await apiRequest("/products/my-products");
        setMyProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Loading my products failed:", error);
      }
    };

    if (user) loadMyProducts();
    else setMyProducts([]);
  }, [user]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await apiRequest("/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
      setProductsError(false);
    } catch (error) {
      console.error(error);
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    const shouldLoad =
      pathname === "/" ||
      pathname.startsWith("/marketplace") ||
      pathname.startsWith("/categories") ||
      pathname.startsWith("/product") ||
      pathname.startsWith("/search");

    if (shouldLoad) loadProducts();
  }, [pathname, loadProducts]);

  const rememberProduct = useCallback(
    (id) => {
      const product = catalog.find(
        (item) => String(productId(item)) === String(id)
      );
      if (!product) return;

      setRecentProducts((prev) =>
        [
          product,
          ...prev.filter((item) => String(productId(item)) !== String(id)),
        ].slice(0, 8)
      );
    },
    [catalog]
  );

  const addToCart = useCallback(
    (product, amount = 1) => {
      if (!user) {
        toast.error("Please login to add products to your cart.");
        router.push("/login");
        return false;
      }

      const qtyToAdd = Math.max(1, Number(amount) || 1);
      const id = productId(product);
      const stock = stockOf(product);
      const current = cartItems.find((item) => productId(item) === id);
      const nextQty = (current?.qty || 0) + qtyToAdd;

      if (stock !== null && (stock <= 0 || nextQty > stock)) {
        toast.error(
          stock <= 0 ? "This product is out of stock." : `Only ${stock} in stock.`
        );
        return false;
      }

      setCartItems((prev) => {
        const exists = prev.find((item) => productId(item) === id);
        if (exists) {
          return prev.map((item) =>
            productId(item) === id
              ? { ...item, qty: (item.qty || 1) + qtyToAdd }
              : item
          );
        }
        return [...prev, { ...product, qty: qtyToAdd }];
      });

      toast.success(`${productName(product)} added to cart!`);
      return true;
    },
    [user, cartItems, router]
  );

  const toggleWishlist = useCallback(
    (product) => {
      const id = String(productId(product));
      const exists = wishlistIds.includes(id);

      if (exists) {
        setWishlist((prev) =>
          prev.filter((item) => String(productId(item)) !== id)
        );
        toast.success("Removed from wishlist");
        return;
      }

      setWishlist((prev) => [{ ...product }, ...prev].slice(0, 40));
      toast.success("Saved to wishlist");
    },
    [wishlistIds]
  );

  const value = {
    darkMode,
    setDarkMode,
    cartItems,
    setCartItems,
    wishlist,
    wishlistIds,
    recentProducts,
    searchQuery,
    setSearchQuery,
    products,
    productsLoading,
    productsError,
    catalog,
    myProducts,
    setMyProducts,
    addToCart,
    toggleWishlist,
    rememberProduct,
    cartCount: cartItems.reduce((total, item) => total + (item.qty || 1), 0),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
