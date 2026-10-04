"use client";

import Checkout from "@/views/Checkout";
import RequireAuth from "@/components/RequireAuth";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function CheckoutPage() {
  const navigateTo = useNavigateTo();
  const { cartItems, setCartItems } = useShop();

  return (
    <RequireAuth>
      <Checkout
        navigateTo={navigateTo}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </RequireAuth>
  );
}
