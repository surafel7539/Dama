"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "@/views/ProductDetails";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigateTo = useNavigateTo();
  const {
    catalog,
    productsLoading,
    addToCart,
    wishlistIds,
    toggleWishlist,
    rememberProduct,
  } = useShop();

  useEffect(() => {
    if (id) rememberProduct(id);
  }, [id, rememberProduct]);

  return (
    <ProductDetails
      products={catalog}
      productsLoading={productsLoading}
      productId={id}
      addToCart={addToCart}
      navigateTo={navigateTo}
      saved={wishlistIds.includes(String(id))}
      onToggleWishlist={toggleWishlist}
      wishlistIds={wishlistIds}
    />
  );
}
