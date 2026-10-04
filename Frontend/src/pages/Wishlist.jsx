import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";

export default function Wishlist({
  items = [],
  navigateTo = () => {},
  addToCart = () => {},
  onToggleWishlist = () => {},
}) {
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-2">
            Saved
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#041c14] dark:text-white">
            Wishlist
          </h1>
          <p className="text-sm text-[#8ba39a] mt-2">
            {items.length} {items.length === 1 ? "product" : "products"} saved on this device.
          </p>
        </div>
        <button
          onClick={() => navigateTo("marketplace")}
          className="hidden sm:inline-flex text-sm font-bold text-[#c29b57] hover:underline"
        >
          Continue shopping
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a291f] rounded-3xl border border-gray-200 dark:border-[#17382d]">
          <Heart size={40} className="mx-auto text-[#c29b57] mb-4" />
          <h2 className="font-bold text-lg text-[#041c14] dark:text-white">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-[#8ba39a] mt-2 mb-6">
            Tap the heart on any product to save it for later.
          </p>
          <button
            onClick={() => navigateTo("marketplace")}
            className="bg-[#c29b57] text-[#041c14] px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[#a88548]"
          >
            <ShoppingBag size={18} />
            Browse marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              navigateTo={navigateTo}
              addToCart={addToCart}
              saved
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
