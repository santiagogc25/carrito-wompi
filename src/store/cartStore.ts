import { create } from "zustand";

/**
 * Representa un producto disponible para la venta.
 */
interface Product {
  id: number;
  title: string;
  price: number;
}

/**
 * Representa un ítem en el carrito de compras, extendiendo un producto con cantidad.
 */
interface CartItem extends Product {
  quantity: number;
}

/**
 * Estado global del carrito de compras, con funciones para manipularlo.
 */
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

  /**
   * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
   * @param product Producto a agregar.
   * @param quantity Cantidad a añadir (por defecto, 1).
   */
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

  /**
   * Reemplaza el carrito con una nueva lista de productos.
   * @param cart Nuevo estado del carrito.
   */
  setCart: (cart) =>
    set({
      cart,
      totalPrice: cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
    }),

  /**
   * Elimina un producto del carrito por su ID.
   * @param id ID del producto a eliminar.
   */
  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((p) => p.id !== id);
      return {
        cart: updatedCart,
        totalPrice: updatedCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
      };
    }),

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param id ID del producto a modificar.
   * @param quantity Nueva cantidad (mínimo 1).
   */
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

  /**
   * Vacía el carrito y reinicia el total a cero.
   */
  clearCart: () => set({ cart: [], totalPrice: 0 }),
}));
