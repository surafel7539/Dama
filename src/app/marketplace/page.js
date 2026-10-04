"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Marketplace from "@/views/Marketplace";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function MarketplacePage() {
  const params = useSearchParams();
  const search = params.get("search") || "";
  const navigateTo = useNavigateTo();
  const {
    catalog,
    productsLoading,
    addToCart,
    wishlistIds,
    toggleWishlist,
    setSearchQuery,
  } = useShop();

  useEffect(() => {
    setSearchQuery(search);
  }, [search, setSearchQuery]);

  return (
    <Marketplace
      products={catalog}
      navigateTo={navigateTo}
      addToCart={addToCart}
      searchQuery={search}
      productsLoading={productsLoading}
      productsError={false}
      wishlistIds={wishlistIds}
      onToggleWishlist={toggleWishlist}
    />
  );
}
