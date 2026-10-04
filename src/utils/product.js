export function productId(product) {
  return product?._id || product?.id;
}

export function productName(product) {
  return product?.name || product?.title || "Product";
}

export function categoryName(category) {
  if (!category) return "";
  if (typeof category === "object") {
    return category.name || category.title || "";
  }
  return String(category);
}

export function productImage(product) {
  return product?.image || product?.imageUrl || "";
}

export function parsePrice(price) {
  if (typeof price === "number") return Number.isFinite(price) ? price : 0;
  if (!price) return 0;
  const value = parseFloat(String(price).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(value) ? value : 0;
}

export function formatPrice(price) {
  return `Br ${parsePrice(price).toLocaleString()}`;
}

export function sellerName(seller) {
  if (seller && typeof seller === "object") {
    return seller.fullName || seller.email || "Verified Seller";
  }
  return seller || "Verified Seller";
}

export function stockOf(product) {
  if (product?.stock === undefined || product?.stock === null || product?.stock === "") {
    return null;
  }
  const value = Number(product.stock);
  return Number.isFinite(value) ? value : null;
}

export function ratingOf(product) {
  const value = product?.averageRating ?? product?.rating;
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function categoryIcon(category) {
  const name = categoryName(category).toLowerCase();

  if (name.includes("electronic") || name.includes("phone") || name.includes("mobile")) return "📱";
  if (name.includes("computer") || name.includes("laptop")) return "💻";
  if (name.includes("fashion") || name.includes("cloth")) return "👕";
  if (name.includes("shoe")) return "👟";
  if (name.includes("home") || name.includes("living")) return "🏠";
  if (name.includes("beauty") || name.includes("cosmetic")) return "💄";
  if (name.includes("food")) return "🍔";
  if (name.includes("accessory") || name.includes("jewel")) return "👜";
  if (name.includes("sport")) return "⚽";
  if (name.includes("book")) return "📚";
  if (name.includes("furniture")) return "🛋️";
  if (name.includes("toy")) return "🧸";
  if (name.includes("car") || name.includes("vehicle")) return "🚗";

  return "📦";
}

export function buildCategories(products = []) {
  const categoryMap = {};

  products.forEach((product) => {
    const name = categoryName(product.category);
    if (!name) return;
    categoryMap[name] = (categoryMap[name] || 0) + 1;
  });

  return Object.entries(categoryMap).map(([name, count], index) => ({
    id: index,
    name,
    count,
    icon: categoryIcon(name),
  }));
}
