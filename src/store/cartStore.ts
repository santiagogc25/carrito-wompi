import { create } from "zustand";

interface Product {
  id: number;
  title: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setCart: (cart: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  totalPrice: 0,

  addToCart: (product, quantity = 1) =>
    set((state) => {
      if (quantity < 1) return state; // Evita agregar cantidades inválidas

      const existingProduct = state.cart.find((p) => p.id === product.id);

      const updatedCart = existingProduct
        ? state.cart.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
        : [...state.cart, { ...product, quantity }];

      return {
        cart: updatedCart,
        totalPrice: updatedCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      };
    }),

  setCart: (cart) =>
    set({
      cart,
      totalPrice: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
    }),

  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((p) => p.id !== id);
      return {
        cart: updatedCart,
        totalPrice: updatedCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p
      );
      return {
        cart: updatedCart,
        totalPrice: updatedCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      };
    }),

  clearCart: () => set({ cart: [], totalPrice: 0 }),
}));
