import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChat from "./components/AICHAT";

// Pages
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

import { apiRequest } from "./services/api";

export default function App() {
  const { user } = useAuth();

  const [lang, setLang] = useState("en");
  const [darkMode, setDarkMode] = useState(true);

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ==========================================
  // LOAD SELLER PRODUCTS
  // ==========================================

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        const data = await apiRequest("/products/my-products");

        console.log("My Products:", data);

        setMyProducts(
          Array.isArray(data)
            ? data
            : data.products || []
        );
      } catch (error) {
        console.error(
          "Loading my products failed:",
          error
        );
      }
    };

    if (user) {
      loadMyProducts();
    } else {
      setMyProducts([]);
    }
  }, [user]);

  // ==========================================
  // LOAD MARKETPLACE PRODUCTS
  // ==========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiRequest("/products");

        console.log("All Products:", data);

        setProducts(
          Array.isArray(data)
            ? data
            : data.products || []
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  // ==========================================
  // DARK MODE
  // ==========================================

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // ==========================================
  // AUTH-PROTECTED PAGES
  // ==========================================

  
  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigateTo = (page, param = null) => {

    // ------------------------------------------
    // LOGIN REQUIRED
    // ------------------------------------------

    

    // ------------------------------------------
    // SELLER PREMIUM CHECK
    // ------------------------------------------

    if (page === "seller-dashboard") {
      const isPremiumSeller =
        user?.isPremium ||
        localStorage.getItem("isPremium") === "true";

      if (!isPremiumSeller) {
        setCurrentPage("upgrade-payment");

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }
    }

    // ------------------------------------------
    // MARKETPLACE SEARCH
    // ------------------------------------------

    if (
      page === "marketplace" &&
      param &&
      typeof param === "object" &&
      param.search
    ) {
      setSearchQuery(param.search);
    }

    // ------------------------------------------
    // PRODUCT ID / PARAMETER
    // ------------------------------------------

    else if (param) {
      setSelectedProductId(param);
    }

    // ------------------------------------------
    // CHANGE PAGE
    // ------------------------------------------

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {

    // Login required
    if (!user) {
      toast.error("Please login to add products to your cart.");

      navigateTo("login");

      return;
    }

    setCartItems((prev) => {
      const exists = prev.find(
        (item) =>
          (item._id || item.id) ===
          (product._id || product.id)
      );

      if (exists) {
        return prev.map((item) =>
          (item._id || item.id) ===
          (product._id || product.id)
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: 1,
        },
      ];
    });

    toast.success(
      `${product.title || product.name || "Item"} added to cart!`
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen dark:bg-[#041c14] font-sans">

      <Toaster position="top-right" />

      {/* ================= NAVBAR ================= */}

      <Navbar
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        navigateTo={navigateTo}
        cartCount={cartItems.reduce(
          (acc, item) => acc + item.qty,
          0
        )}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage("marketplace");
        }}
      />

      {/* ================= MAIN ================= */}

      <main>

        {/* HOME */}

        {currentPage === "home" && (
          <Home
            navigateTo={navigateTo}
            addToCart={addToCart}
            products={products}
          />
        )}

        {/* MARKETPLACE */}

        {currentPage === "marketplace" && (
          <Marketplace
            products={products}
            navigateTo={navigateTo}
            addToCart={addToCart}
            searchQuery={searchQuery}
          />
        )}

        {/* PRODUCT DETAILS */}

        {currentPage === "product-details" && (
          <ProductDetails
            products={products}
            productId={selectedProductId}
            addToCart={addToCart}
            navigateTo={navigateTo}
          />
        )}

        {/* SELLER DASHBOARD */}

        {currentPage === "seller-dashboard" && (
          <SellerDashboard
            myProducts={myProducts}
            setMyProducts={setMyProducts}
          />
        )}

        {/* BUYER DASHBOARD */}

        {currentPage === "buyer-dashboard" && (
          <BuyerDashboard
            navigateTo={navigateTo}
          />
        )}

        {/* CART */}

        {currentPage === "cart" && (
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
            navigateTo={navigateTo}
          />
        )}

        {/* CATEGORIES */}

        {currentPage === "categories" && (
          <Categories
            categories={Categories}
            navigateTo={navigateTo}
            products={products}
            addToCart={addToCart}
          />
        )}

        {/* CHECKOUT */}

        {currentPage === "checkout" && (
          <Checkout
            navigateTo={navigateTo}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}

        {/* LOGIN */}

        {currentPage === "login" && (
          <Login
            navigateTo={navigateTo}
          />
        )}

        {/* REGISTER */}

        {currentPage === "register" && (
          <Register
            navigateTo={navigateTo}
          />
        )}

        {/* UPGRADE PAYMENT */}

        {currentPage === "upgrade-payment" && (
          <UpgradePayment
            navigateTo={navigateTo}
          />
        )}

        {/* PROFILE */}

        {currentPage === "profile" && (
  <Profile navigateTo={navigateTo} />
)}

        {/* SETTINGS */}

        

        {/* ABOUT */}

        {currentPage === "about" && (
          <About
            navigateTo={navigateTo}
          />
        )}

        {/* SEARCH RESULTS */}

        {currentPage === "search-results" && (
          <SearchResults
            products={products}
            searchQuery={searchQuery}
            navigateTo={navigateTo}
            addToCart={addToCart}
          />
        )}

      </main>

      {/* ================= FOOTER ================= */}

      <Footer
        navigateTo={navigateTo}
      />

      {/* ================= AI CHAT ================= */}

      <AIChat
        navigateTo={navigateTo}
        addToCart={addToCart}
      />

    </div>
  );
}