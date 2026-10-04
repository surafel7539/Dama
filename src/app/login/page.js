"use client";

import Login from "@/views/Login";
import { useNavigateTo } from "@/context/NavigationContext";

export default function LoginPage() {
  const navigateTo = useNavigateTo();
  return <Login navigateTo={navigateTo} />;
}
