import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowUp } from "lucide-react";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChat from "./components/AICHAT";

import Home from "./pages/home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import UpgradePayment from "./pages/UpgradePayment";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";

import { apiRequest } from "./services/api";
import { MOCK_PRODUCTS } from "./data/mockData";
import { productId, productName, stockOf } from "./utils/product";

const PROTECTED_PAGES = [
  "checkout",
  "buyer-dashboard",
  "profile",
  "seller-dashboard",
  "upgrade-payment",
];

function readStored(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return fallback;
  }
}

export default function App() {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dama-theme") !== "light";
  });

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [cartItems, setCartItems] = useState(() => readStored("cart", []));
  const [wishlist, setWishlist] = useState(() => readStored("wishlist", []));
  const [recentProducts, setRecentProducts] = useState(() =>
    readStored("recent-products", [])
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  const wishlistIds = wishlist.map((item) => String(productId(item)));
  const catalog =
    productsError && products.length === 0 ? MOCK_PRODUCTS : products;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("recent-products", JSON.stringify(recentProducts));
  }, [recentProducts]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("dama-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        const data = await apiRequest("/products/my-products");
        setMyProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Loading my products failed:", error);
      }
    };

    if (user) {
      loadMyProducts();
    } else {
      setMyProducts([]);
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      if (products.length === 0) setProductsLoading(true);
      const data = await apiRequest("/products");
      setProducts(Array.isArray(data) ? data : data.products || []);
      setProductsError(false);
    } catch (error) {
      console.error(error);
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    const refreshPages = ["home", "marketplace", "categories", "product-details"];
    if (refreshPages.includes(currentPage)) {
      loadProducts();
    }
    // Refresh the catalog when the shopper returns to a product page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (!user && PROTECTED_PAGES.includes(currentPage)) {
      setCurrentPage("login");
    }
  }, [user, currentPage]);

  const rememberProduct = (id) => {
    const product = catalog.find(
      (item) => String(productId(item)) === String(id)
    );
    if (!product) return;

    setRecentProducts((prev) => {
      const next = [
        product,
        ...prev.filter((item) => String(productId(item)) !== String(id)),
      ].slice(0, 8);
      return next;
    });
  };

  const navigateTo = (page, param = null) => {
    if (PROTECTED_PAGES.includes(page) && !user) {
      toast.error("Please sign in to continue.");
      setCurrentPage("login");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (page === "seller-dashboard") {
      const isPremiumSeller =
        user?.isPremium || localStorage.getItem("isPremium") === "true";

      if (!isPremiumSeller) {
        setCurrentPage("upgrade-payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (
      page === "marketplace" &&
      param &&
      typeof param === "object" &&
      param.search !== undefined
    ) {
      setSearchQuery(param.search);
    } else if (page === "product-details" && param) {
      setSelectedProductId(param);
      rememberProduct(param);
    } else if (param && page !== "marketplace") {
      setSelectedProductId(param);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, amount = 1) => {
    if (!user) {
      toast.error("Please login to add products to your cart.");
      navigateTo("login");
      return false;
    }

    const qtyToAdd = Math.max(1, Number(amount) || 1);
    const id = productId(product);
    const stock = stockOf(product);
    const current = cartItems.find((item) => productId(item) === id);
    const nextQty = (current?.qty || 0) + qtyToAdd;

    if (stock !== null && (stock <= 0 || nextQty > stock)) {
      toast.error(
        stock <= 0
          ? "This product is out of stock."
          : `Only ${stock} in stock.`
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
  };

  const toggleWishlist = (product) => {
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
  };

  const sharedProductProps = {
    wishlistIds,
    onToggleWishlist: toggleWishlist,
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
        currentPage={currentPage}
        navigateTo={navigateTo}
        searchQuery={searchQuery}
        wishlistCount={wishlist.length}
        cartCount={cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)}
        onSearchChange={setSearchQuery}
      />

      <main>
        {currentPage === "home" && (
          <Home
            navigateTo={navigateTo}
            addToCart={addToCart}
            products={catalog}
            productsLoading={productsLoading}
            productsError={false}
            recentProducts={recentProducts}
            {...sharedProductProps}
          />
        )}

        {currentPage === "marketplace" && (
          <Marketplace
            products={catalog}
            navigateTo={navigateTo}
            addToCart={addToCart}
            searchQuery={searchQuery}
            productsLoading={productsLoading}
            productsError={false}
            {...sharedProductProps}
          />
        )}

        {currentPage === "product-details" && (
          <ProductDetails
            products={catalog}
            productId={selectedProductId}
            addToCart={addToCart}
            navigateTo={navigateTo}
            saved={wishlistIds.includes(String(selectedProductId))}
            onToggleWishlist={toggleWishlist}
            {...sharedProductProps}
          />
        )}

        {currentPage === "seller-dashboard" && (
          <SellerDashboard
            myProducts={myProducts}
            setMyProducts={setMyProducts}
          />
        )}

        {currentPage === "buyer-dashboard" && (
          <BuyerDashboard navigateTo={navigateTo} />
        )}

        {currentPage === "cart" && (
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "wishlist" && (
          <Wishlist
            items={wishlist}
            navigateTo={navigateTo}
            addToCart={addToCart}
            onToggleWishlist={toggleWishlist}
          />
        )}

        {currentPage === "categories" && (
          <Categories
            navigateTo={navigateTo}
            products={catalog}
            productsLoading={productsLoading}
            productsError={false}
          />
        )}

        {currentPage === "checkout" && (
          <Checkout
            navigateTo={navigateTo}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}

        {currentPage === "login" && <Login navigateTo={navigateTo} />}
        {currentPage === "register" && <Register navigateTo={navigateTo} />}

        {currentPage === "upgrade-payment" && (
          <UpgradePayment navigateTo={navigateTo} />
        )}

        {currentPage === "profile" && <Profile navigateTo={navigateTo} />}
        {currentPage === "about" && <About navigateTo={navigateTo} />}

        {currentPage === "search-results" && (
          <SearchResults
            products={catalog}
            searchQuery={searchQuery}
            navigateTo={navigateTo}
            addToCart={addToCart}
            {...sharedProductProps}
          />
        )}
      </main>

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
