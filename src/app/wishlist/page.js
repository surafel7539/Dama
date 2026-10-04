"use client";

import Wishlist from "@/views/Wishlist";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function WishlistPage() {
  const navigateTo = useNavigateTo();
  const { wishlist, addToCart, toggleWishlist } = useShop();

  return (
    <Wishlist
      items={wishlist}
      navigateTo={navigateTo}
      addToCart={addToCart}
      onToggleWishlist={toggleWishlist}
    />
  );
}
