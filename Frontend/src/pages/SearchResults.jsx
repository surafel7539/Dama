import React from "react";
import ProductCard from "../components/ProductCard";
import { MOCK_PRODUCTS } from "../data/mockData";
import { categoryName, productName } from "../utils/product";

export default function SearchResults({
  searchQuery = "",
  products = [],
  navigateTo,
  addToCart,
  wishlistIds = [],
  onToggleWishlist,
}) {
  const query = searchQuery.trim().toLowerCase();
  const source = products.length > 0 ? products : MOCK_PRODUCTS;
  const results = source.filter((product) => {
    const name = productName(product).toLowerCase();
    const category = categoryName(product.category).toLowerCase();
    return !query || name.includes(query) || category.includes(query);
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <h1 className="text-2xl font-extrabold text-[#041c14] dark:text-white mb-2">
        Search Results
      </h1>
      <p className="text-sm text-[#8ba39a] mb-8">
        {results.length} matching {results.length === 1 ? "item" : "items"} for "{searchQuery || "all"}"
      </p>
      {results.length === 0 ? (
        <p className="text-[#8ba39a]">Nothing matched that search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => {
            const id = String(product._id || product.id);
            return (
              <ProductCard
                key={id}
                product={product}
                navigateTo={navigateTo}
                addToCart={addToCart}
                saved={wishlistIds.includes(id)}
                onToggleWishlist={onToggleWishlist}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
