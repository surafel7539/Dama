import React, { useMemo } from "react";

export default function Categories({
  products = [],
  navigateTo = () => {},
}) {
  // ==========================================
  // CATEGORY ICON
  // ==========================================

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

  // ==========================================
  // BUILD CATEGORIES FROM PRODUCTS
  // ==========================================

  const categoryList = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const category = product.category;

      if (!category) return;

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category]++;
    });

    return Object.entries(categoryMap).map(
      ([name, count], index) => ({
        id: index,
        name,
        count,
        icon: getCategoryIcon(name),
      })
    );
  }, [products]);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="max-w-[1600px] dark:text-white text-gray-800 mx-auto px-6 md:px-12 py-12">

      <h1 className="text-2xl font-bold mb-8">
        Categories
      </h1>

      {categoryList.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">
            📦
          </div>

          <p>
            No categories available yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

          {categoryList.slice(0, 6).map((cat) => (

            <button
              key={cat.id}
              onClick={() =>
                navigateTo("marketplace", {
                  search: cat.name,
                })
              }
              className="group bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-[#c29b57] transition-all hover:-translate-y-1 text-center"
            >

              {/* ICON */}

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c29b57]/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>

              {/* NAME */}

              <h3 className="mt-4 font-bold text-sm text-gray-900 dark:text-white">
                {cat.name}
              </h3>

              {/* COUNT */}

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {cat.count}{" "}
                {cat.count === 1 ? "item" : "items"}
              </p>

            </button>

          ))}

        </div>
      )}
    </div>
  );
}