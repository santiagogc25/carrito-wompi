import { create } from "zustand";
import { Product } from "@/types";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  subtotal: number;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  
  addToCart: (product, quantity) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Si el producto ya está en el carrito, solo aumentamos la cantidad
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      } else {
        // Si no está en el carrito, lo agregamos con la cantidad seleccionada
        return {
          cart: [...state.cart, { ...product, quantity }],
        };
      }
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  subtotal: 0, // Esto se actualizará con un selector en el componente
}));
