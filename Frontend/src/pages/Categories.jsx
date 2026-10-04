import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MOCK_PRODUCTS } from "../data/mockData";
import { buildCategories } from "../utils/product";

export default function Categories({
  products = [],
  navigateTo = () => {},
  productsLoading = false,
  productsError = false,
}) {
  const [query, setQuery] = useState("");

  const catalog =
    productsError && products.length === 0 ? MOCK_PRODUCTS : products;

  const categoryList = useMemo(() => {
    const list = buildCategories(catalog);
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter((category) => category.name.toLowerCase().includes(term));
  }, [catalog, query]);

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[#c29b57] text-xs font-bold uppercase tracking-widest mb-2">
            Browse
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#041c14] dark:text-white">
            Categories
          </h1>
          <p className="text-sm text-[#8ba39a] mt-2">
            {categoryList.length} {categoryList.length === 1 ? "category" : "categories"}
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ba39a]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a category"
            className="w-full bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] rounded-full py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#c29b57]"
          />
        </div>
      </div>

      {productsLoading && catalog.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] animate-pulse"
            />
          ))}
        </div>
      ) : categoryList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0a291f] rounded-3xl border border-gray-200 dark:border-[#17382d] text-[#8ba39a]">
          <div className="text-5xl mb-4">📦</div>
          <p>No categories match that search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoryList.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigateTo("marketplace", { search: cat.name })}
              className="group bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-[#17382d] rounded-2xl p-5 hover:border-[#c29b57] transition-all hover:-translate-y-1 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c29b57]/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="mt-4 font-bold text-sm text-[#041c14] dark:text-white">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-[#8ba39a]">
                {cat.count} {cat.count === 1 ? "item" : "items"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
