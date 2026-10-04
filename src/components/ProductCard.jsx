import React from "react";
import { Star, Heart } from "lucide-react";
import {
  productId,
  productName,
  productImage,
  sellerName,
  formatPrice,
  stockOf,
  ratingOf,
  categoryName,
} from "../utils/product";

const FALLBACK_IMAGE =
  "https://placehold.co/600x450/f4f5f7/041c14?text=No+Image";

export default function ProductCard({
  product,
  navigateTo = () => {},
  addToCart = () => {},
  saved = false,
  onToggleWishlist,
}) {
  if (!product) return null;

  const id = productId(product);
  const name = productName(product);
  const image = productImage(product) || FALLBACK_IMAGE;
  const seller = sellerName(product.seller);
  const stock = stockOf(product);
  const rating = ratingOf(product);
  const category = categoryName(product.category);
  const outOfStock = stock !== null && stock <= 0;

  return (
    <div className="bg-white dark:bg-[#0a291f] text-[#041c14] dark:text-white rounded-2xl overflow-hidden border border-gray-200 dark:border-[#17382d] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#c29b57]/60 transition-all duration-300 flex flex-col group">
      <div
        onClick={() => navigateTo("product-details", id)}
        className="relative aspect-[4/3] bg-[#f4f5f7] dark:bg-[#041c14] p-4 cursor-pointer overflow-hidden flex items-center justify-center"
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        {category && (
          <span className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wide bg-white/90 dark:bg-[#0a291f]/90 text-[#041c14] dark:text-[#c29b57] px-2 py-1 rounded-full">
            {category}
          </span>
        )}

        {outOfStock && (
          <span className="absolute right-3 top-3 text-[10px] font-bold uppercase bg-red-500 text-white px-2 py-1 rounded-full">
            Sold out
          </span>
        )}

        {stock !== null && stock > 0 && stock <= 5 && (
          <span className="absolute right-3 top-3 text-[10px] font-bold uppercase bg-[#c29b57] text-[#041c14] px-2 py-1 rounded-full">
            {stock} left
          </span>
        )}

        {onToggleWishlist && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute right-3 bottom-3 p-2 rounded-full shadow-sm transition ${
              saved
                ? "bg-[#c29b57] text-[#041c14]"
                : "bg-white/90 dark:bg-[#0a291f]/90 text-[#8ba39a] hover:text-[#c29b57]"
            }`}
            title={saved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart size={16} className={saved ? "fill-current" : ""} />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3
          onClick={() => navigateTo("product-details", id)}
          className="font-bold text-base cursor-pointer hover:text-[#c29b57] transition-colors line-clamp-2 min-h-[3rem]"
        >
          {name}
        </h3>
        <p className="text-xs text-[#8ba39a] mb-3 mt-1">{seller}</p>

        <div className="flex justify-between items-center mb-4 mt-auto">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
            <Star size={14} className="text-[#c29b57] fill-current mr-1" />
            <span>{rating !== null ? rating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          className="w-full bg-[#041c14] text-white dark:bg-[#c29b57] dark:text-[#041c14] py-2.5 rounded-xl font-semibold text-xs hover:bg-[#0a291f] dark:hover:bg-[#a88548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of Stock" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
