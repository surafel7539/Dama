import React from "react";
import {
  ShieldCheck,
  Truck,
  Award,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Store,
  Sparkles,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../data/mockData";

export default function Home({
  navigateTo = () => {},
  addToCart = () => {},
  products = [],
  categories = [],
}) {
  // Use real API data when available, otherwise use mock data
  

// Generate categories from real products



const getCategoryIcon = (category) => {
  const name = category.toLowerCase();

  if (name.includes("electronic")) return "📱";
  if (name.includes("fashion") || name.includes("cloth")) return "👕";
  if (name.includes("home") || name.includes("living")) return "🏠";
  if (name.includes("beauty") || name.includes("cosmetic")) return "💄";
  if (name.includes("food")) return "🍔";
  if (name.includes("accessory")) return "👜";
  if (name.includes("sport")) return "⚽";
  if (name.includes("book")) return "📚";
  if (name.includes("phone") || name.includes("mobile")) return "📱";
  if (name.includes("computer") || name.includes("laptop")) return "💻";
  if (name.includes("shoe")) return "👟";
  if (name.includes("jewel")) return "💎";
  if (name.includes("furniture")) return "🛋️";
  if (name.includes("toy")) return "🧸";
  if (name.includes("car") || name.includes("vehicle")) return "🚗";

  return "📦";
};

const productList =
  Array.isArray(products) && products.length > 0
    ? products
    : MOCK_PRODUCTS;

const categoryMap = {};

productList.forEach((product) => {
  const category = product.category;

  if (!category) return;

  if (!categoryMap[category]) {
    categoryMap[category] = 0;
  }

  categoryMap[category]++;
});

const categoryList = Object.entries(categoryMap).map(
  ([name, count], index) => ({
    id: index,
    name,
    count,
    icon: getCategoryIcon(name),
  })
);
  return (
    <div className="pb-20">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="px-4 sm:px-8 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#041c14] border border-gray-200 dark:border-[#17382d] shadow-xl">

          {/* Decorative glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#c29b57]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#c29b57]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 items-center min-h-[520px]">

            {/* Hero text */}
            <div className="px-7 sm:px-12 lg:px-16 py-14">

              <div className="inline-flex items-center gap-2 bg-[#c29b57]/10 border border-[#c29b57]/30 text-[#c29b57] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                <Sparkles size={14} />
                Ethiopia's Marketplace
              </div>

              <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white">
                Discover
                <br />

                <span className="text-[#c29b57]">
                  Something Amazing.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Shop products from trusted sellers, discover unique
                finds, and experience a marketplace built for you.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  onClick={() => navigateTo("marketplace")}
                  className="bg-[#c29b57] text-[#041c14] px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#a88548] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <ShoppingBag size={18} />
                  Shop Now
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigateTo("categories")}
                  className="px-7 py-3.5 rounded-xl font-bold border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:border-[#c29b57] hover:text-[#c29b57] transition-all"
                >
                  Explore Categories
                </button>

              </div>

              {/* Small stats */}
              <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">

                <div>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {productList.length}+
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Products
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {categoryList.length}+
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Categories
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-[#c29b57]">
                    4.9
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Average Rating
                  </p>
                </div>

              </div>
            </div>

            {/* Hero image */}
            <div className="relative flex justify-center items-center px-6 pb-10 lg:pb-0">

              <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#c29b57]/10 blur-2xl" />

              <img
                src="758853720_2533852980378695_8891268762573421557_n.jpg"
                alt="Dama Marketplace"
                className="relative z-10 w-full max-w-[520px] h-[350px] sm:h-[430px] object-contain drop-shadow-2xl"
              />

            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* TRUST FEATURES */}
      {/* ========================================================= */}

      <section className="max-w-[1500px] mx-auto px-5 sm:px-10 mt-10">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {[
            {
              icon: ShieldCheck,
              title: "Buyer Protection",
              desc: "Shop with confidence",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Across Ethiopia",
            },
            {
              icon: CreditCard,
              title: "Secure Payments",
              desc: "Multiple payment options",
            },
            {
              icon: Award,
              title: "Trusted Sellers",
              desc: "Quality you can trust",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-[#c29b57] transition-all hover:-translate-y-1 shadow-sm"
              >

                <div className="shrink-0 p-3 rounded-xl bg-[#c29b57]/10 text-[#c29b57] group-hover:bg-[#c29b57]/20 transition">
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {feature.desc}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* ========================================================= */}
      {/* CATEGORIES */}
      {/* ========================================================= */}

      <section className="max-w-[1500px] mx-auto px-5 sm:px-10 mt-20">

        <div className="flex items-end justify-between mb-8">

          <div>
            <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-2">
              Explore
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Shop by Category
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Find exactly what you're looking for.
            </p>
          </div>

          <button
            onClick={() => navigateTo("categories")}
            className="hidden sm:flex items-center gap-2 text-[#c29b57] font-bold text-sm hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </button>

        </div>


        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {categoryList.slice(0, 6).map((cat, index) => {

            const catId = cat._id || cat.id || index;
            const catName =
              cat.name || cat.title || "Category";

            const catCount =
              cat.count ??
              cat.itemCount ??
              0;

            const catIcon =
              cat.icon || "📦";

            return (
              <button
                key={catId}
                onClick={() =>
                  navigateTo("marketplace", {
                    search: catName,
                  })
                }
                className="group bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-[#c29b57] transition-all hover:-translate-y-1 text-center"
              >

                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c29b57]/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {catIcon}
                </div>

                <h3 className="mt-4 font-bold text-sm text-gray-900 dark:text-white">
                  {catName}
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {catCount} items
                </p>

              </button>
            );
          })}

        </div>

        <button
          onClick={() => navigateTo("categories")}
          className="sm:hidden flex items-center gap-2 mt-5 text-[#c29b57] font-bold text-sm"
        >
          View All Categories
          <ArrowRight size={16} />
        </button>

      </section>


      {/* ========================================================= */}
      {/* FEATURED PRODUCTS */}
      {/* ========================================================= */}

      <section className="max-w-[1500px] mx-auto px-5 sm:px-10 mt-20">

        <div className="flex items-end justify-between mb-8">

          <div>
            <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-2">
              Just for you
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Featured Products
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Popular products from our marketplace.
            </p>
          </div>

          <button
            onClick={() => navigateTo("marketplace")}
            className="hidden sm:flex items-center gap-2 text-[#c29b57] font-bold text-sm hover:underline"
          >
            View Marketplace
            <ArrowRight size={16} />
          </button>

        </div>


        {productList.length === 0 ? (

          <div className="text-center py-20 bg-white dark:bg-[#0a291f] rounded-3xl border border-gray-200 dark:border-gray-800">

            <ShoppingBag
              size={40}
              className="mx-auto text-[#c29b57] mb-4"
            />

            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              No products yet
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Check back soon for new listings.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {productList.slice(0, 8).map((product) => {

              const productId =
                product._id || product.id;

              return (
                <ProductCard
                  key={productId}
                  product={product}
                  navigateTo={navigateTo}
                  addToCart={addToCart}
                />
              );
            })}

          </div>

        )}

        <button
          onClick={() => navigateTo("marketplace")}
          className="sm:hidden mx-auto mt-6 flex items-center gap-2 text-[#c29b57] font-bold text-sm"
        >
          View Marketplace
          <ArrowRight size={16} />
        </button>

      </section>


      {/* ========================================================= */}
      {/* SELLER CTA */}
      {/* ========================================================= */}

      <section className="max-w-[1500px] mx-auto px-5 sm:px-10 mt-20">

        <div className="relative overflow-hidden rounded-3xl bg-[#0a291f] dark:bg-[#0a291f] border border-[#c29b57]/20">

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#c29b57]/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12">

            <div>

              <div className="flex items-center gap-2 text-[#c29b57] mb-4">
                <Store size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  For Sellers
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Have something to sell?
              </h2>

              <p className="text-gray-300 mt-3 max-w-xl">
                Turn your products into a business and reach customers
                across the Dama marketplace.
              </p>

            </div>

            <button
              onClick={() => navigateTo("seller-dashboard")}
              className="shrink-0 bg-[#c29b57] text-[#041c14] px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#a88548] transition-all"
            >
              Start Selling
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="max-w-[1000px] mx-auto px-5 text-center mt-20">

        <div className="bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-3xl p-10 sm:p-14">

          <ShoppingBag
            size={38}
            className="mx-auto text-[#c29b57]"
          />

          <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Ready to find something great?
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Explore thousands of possibilities and find your next favorite product.
          </p>

          <button
            onClick={() => navigateTo("marketplace")}
            className="mt-7 bg-[#c29b57] text-[#041c14] px-8 py-3.5 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[#a88548] transition-all shadow-lg"
          >
            Explore Marketplace
            <ArrowRight size={18} />
          </button>

        </div>

      </section>

    </div>
  );
}