"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchResults from "@/views/SearchResults";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function SearchPage() {
  const params = useSearchParams();
  const search = params.get("q") || "";
  const navigateTo = useNavigateTo();
  const {
    catalog,
    addToCart,
    wishlistIds,
    toggleWishlist,
    setSearchQuery,
  } = useShop();

  useEffect(() => {
    setSearchQuery(search);
  }, [search, setSearchQuery]);

  return (
    <SearchResults
      products={catalog}
      searchQuery={search}
      navigateTo={navigateTo}
      addToCart={addToCart}
      wishlistIds={wishlistIds}
      onToggleWishlist={toggleWishlist}
    />
  );
}
