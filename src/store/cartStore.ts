import { create } from "zustand";
import { Product } from "@/types";

interface CartState {
  cart: Product[];
  subtotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void; // ✅ Agregamos esta función
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  subtotal: 0,

  addToCart: (product) =>
    set((state) => {
      const updatedCart = [...state.cart, product];
      return {
        cart: updatedCart,
        subtotal: updatedCart.reduce((sum, item) => sum + item.price, 0),
      };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId);
      return {
        cart: updatedCart,
        subtotal: updatedCart.reduce((sum, item) => sum + item.price, 0),
      };
    }),
}));
