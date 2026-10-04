"use client";

import Register from "@/views/Register";
import { useNavigateTo } from "@/context/NavigationContext";

export default function RegisterPage() {
  const navigateTo = useNavigateTo();
  return <Register navigateTo={navigateTo} />;
}
