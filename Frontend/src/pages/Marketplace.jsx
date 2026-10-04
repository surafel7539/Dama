import React, { useMemo, useState } from "react";
import { SlidersHorizontal, SearchX } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { MOCK_PRODUCTS } from "../data/mockData";
import {
  productName,
  categoryName,
  parsePrice,
  ratingOf,
  stockOf,
  buildCategories,
} from "../utils/product";

export default function Marketplace({
  navigateTo,
  addToCart,
  searchQuery = "",
  products = [],
  productsLoading = false,
  productsError = false,
  wishlistIds = [],
  onToggleWishlist,
}) {
  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");

  const catalog =
    productsError && products.length === 0 ? MOCK_PRODUCTS : products;

  const categories = useMemo(() => buildCategories(catalog), [catalog]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = catalog.filter((product) => {
      const name = productName(product).toLowerCase();
      const productCategory = categoryName(product.category).toLowerCase();
      const seller = (
        typeof product.seller === "object"
          ? product.seller?.fullName || ""
          : product.seller || ""
      ).toLowerCase();

      const matchesQuery =
        !query ||
        name.includes(query) ||
        productCategory.includes(query) ||
        seller.includes(query);

      const matchesCategory =
        category === "all" ||
        categoryName(product.category).toLowerCase() === category.toLowerCase();

      const stock = stockOf(product);
      const matchesStock = !inStockOnly || stock === null || stock > 0;

      const price = parsePrice(product.price);
      const matchesPrice = !maxPrice || price <= Number(maxPrice);

      return matchesQuery && matchesCategory && matchesStock && matchesPrice;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price-desc") sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    if (sort === "rating") {
      sorted.sort((a, b) => (ratingOf(b) || 0) - (ratingOf(a) || 0));
    }
    if (sort === "newest") {
      sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    return sorted;
  }, [catalog, searchQuery, category, inStockOnly, maxPrice, sort]);

  const clearFilters = () => {
    setSort("featured");
    setCategory("all");
    setInStockOnly(false);
    setMaxPrice("");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-2">
            Shop
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#041c14] dark:text-white">
            Marketplace
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </h1>
          <p className="text-sm text-[#8ba39a] mt-2">
            {productsLoading
              ? "Loading products..."
              : `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] rounded-2xl p-4 mb-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#041c14] dark:text-white">
          <SlidersHorizontal size={16} className="text-[#c29b57]" />
          Filter and sort
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              category === "all"
                ? "bg-[#c29b57] text-[#041c14] border-[#c29b57]"
                : "border-gray-200 dark:border-[#17382d] text-gray-600 dark:text-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => setCategory(item.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                category === item.name
                  ? "bg-[#c29b57] text-[#041c14] border-[#c29b57]"
                  : "border-gray-200 dark:border-[#17382d] text-gray-600 dark:text-gray-300"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="bg-[#f4f5f7] dark:bg-[#041c14] border border-gray-200 dark:border-[#17382d] rounded-xl px-3 py-2.5 text-sm text-[#041c14] dark:text-white outline-none focus:border-[#c29b57]"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>

          <input
            type="number"
            min="0"
            placeholder="Max price (Br)"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="bg-[#f4f5f7] dark:bg-[#041c14] border border-gray-200 dark:border-[#17382d] rounded-xl px-3 py-2.5 text-sm text-[#041c14] dark:text-white outline-none focus:border-[#c29b57]"
          />

          <label className="inline-flex items-center gap-2 text-sm font-bold text-[#041c14] dark:text-white px-2">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
              className="accent-[#c29b57]"
            />
            In stock only
          </label>

          <button
            onClick={clearFilters}
            className="text-sm font-bold text-[#c29b57] hover:underline sm:ml-auto"
          >
            Clear filters
          </button>
        </div>
      </div>

      {productsLoading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 rounded-2xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a291f] rounded-3xl border border-gray-200 dark:border-[#17382d]">
          <SearchX size={40} className="mx-auto text-[#c29b57] mb-4" />
          <h2 className="font-bold text-lg text-[#041c14] dark:text-white">
            No products found
          </h2>
          <p className="text-sm text-[#8ba39a] mt-2">
            Try another search or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
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
