"use client";

import Categories from "@/views/Categories";
import { useShop } from "@/context/ShopContext";
import { useNavigateTo } from "@/context/NavigationContext";

export default function CategoriesPage() {
  const navigateTo = useNavigateTo();
  const { catalog, productsLoading } = useShop();

  return (
    <Categories
      navigateTo={navigateTo}
      products={catalog}
      productsLoading={productsLoading}
      productsError={false}
    />
  );
}
