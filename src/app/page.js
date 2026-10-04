"use client";

import Home from "@/views/home";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function HomePage() {
  const navigateTo = useNavigateTo();
  const shop = useShop();

  return (
    <Home
      navigateTo={navigateTo}
      addToCart={shop.addToCart}
      products={shop.catalog}
      productsLoading={shop.productsLoading}
      productsError={false}
      recentProducts={shop.recentProducts}
      wishlistIds={shop.wishlistIds}
      onToggleWishlist={shop.toggleWishlist}
    />
  );
}
