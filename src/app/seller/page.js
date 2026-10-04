"use client";

import SellerDashboard from "@/views/SellerDashboard";
import RequireAuth from "@/components/RequireAuth";
import { useShop } from "@/context/ShopContext";

export default function SellerPage() {
  const { myProducts, setMyProducts } = useShop();

  return (
    <RequireAuth seller>
      <SellerDashboard myProducts={myProducts} setMyProducts={setMyProducts} />
    </RequireAuth>
  );
}
