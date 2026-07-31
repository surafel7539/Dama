import React from 'react';
import { ShieldCheck, Truck, Award, CreditCard, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';

export default function Home({ navigateTo = () => {}, addToCart = () => {}, products, categories }) {
  // Use passed props from API or fallback to mock data
  const categoryList = (categories && categories.length > 0) ? categories : MOCK_CATEGORIES;
  const productList = (products && products.length > 0) ? products : MOCK_PRODUCTS;

  return (
    <div className="space-y-16 pb-16 pt-5 relative">
      
      {/* 1. Hero Banner */}
      <section className="relative z-0 bg-white dark:border-none dark:text-white border-1 border-black overflow-hidden dark:bg-gradient-to-r from-gray-900 via-[#041c14] to-[#072a1f] text-black py-12 px-6 sm:px-12 rounded-3xl mx-4 sm:mx-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Text Content */}
        <div className="max-w-2xl space-y-6 relative z-10">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#c29b57] uppercase bg-[#c29b57]/10 px-3 py-1.5 rounded-full border border-[#c29b57]/30 inline-block">
            MARKETPLACE
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            DISCOVER. CONNECT. <br />
            <span className="text-[#c29b57]">TRADE WITH TRUST.</span>
          </h1>
          <p className="dark:text-gray-300 text-gray-900 text-base sm:text-lg max-w-xl">
            Premium products. Trusted sellers. Extraordinary experience.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => navigateTo('marketplace')} 
              className="bg-[#c29b57] text-[#041c14] px-8 py-3.5 rounded-xl font-bold hover:bg-[#a88548] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Shop Now <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Banner Image */}
        <div className="flex-shrink-0 flex justify-center w-full lg:w-auto">
          <img 
            src="758853720_2533852980378695_8891268762573421557_n.jpg" 
            className="h-[300px] sm:h-[400px] lg:h-[450px] object-contain rounded-2xl drop-shadow-2xl" 
            alt="Dama MARKETPLACE" 
          />
        </div>
      </section>

      {/* 2. Trust Badges / Value Proposition */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: ShieldCheck, title: "Buyer Protection", desc: "100% Secure Transaction" },
            { icon: Truck, title: "Fast Delivery", desc: "Across All Regions" },
            { icon: CreditCard, title: "Secure Payments", desc: "Telebirr, CBE & Cards" },
            { icon: Award, title: "Verified Sellers", desc: "Guaranteed Quality" },
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-[#0a291f] text-gray-900 dark:text-white p-5 rounded-2xl border border-gray-900 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="p-3 bg-[#c29b57]/15 text-[#c29b57] rounded-xl">
                <feature.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Categories</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Browse our top collections</p>
          </div>
          <button 
            onClick={() => navigateTo('categories')} 
            className="text-[#c29b57] font-bold text-sm hover:underline flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categoryList.map((cat) => {
            const catId = cat._id || cat.id;
            const catName = cat.name || cat.title || 'Category';
            const catCount = cat.count ?? cat.itemCount ?? 0;
            const catIcon = cat.icon || '📦';

            return (
              <div 
                key={catId} 
                onClick={() => navigateTo('marketplace', catName)} 
                className="bg-white dark:bg-[#0a291f] text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-900 dark:border-gray-800 hover:border-[#c29b57] dark:hover:border-[#c29b57] cursor-pointer transition-all text-center group shadow-sm"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{catIcon}</span>
                <h3 className="font-bold text-sm mb-1">{catName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{catCount} items</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products Grid */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Handpicked quality items for you</p>
          </div>
          <button 
            onClick={() => navigateTo('marketplace')} 
            className="text-[#c29b57] font-bold text-sm hover:underline flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.map((product) => {
            const productId = product._id || product.id;
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
      </section>

    </div>
  );
}