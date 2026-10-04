"use client";

import Cart from "@/views/Cart";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function CartPage() {
  const navigateTo = useNavigateTo();
  const { cartItems, setCartItems } = useShop();

  return (
    <Cart
      cartItems={cartItems}
      setCartItems={setCartItems}
      navigateTo={navigateTo}
    />
  );
}
