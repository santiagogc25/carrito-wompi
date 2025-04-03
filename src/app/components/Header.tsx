"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const Header = () => {
  const cart = useCartStore((state) => state.cart);

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo y título */}
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">Tienda Online</h1>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/cart" className="relative flex items-center">
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
