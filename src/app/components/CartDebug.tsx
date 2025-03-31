"use client";

import { useCartStore } from "@/store/cartStore";

const CartDebug = () => {
  const cart = useCartStore((state) => state.cart);

  return (
    <div>
      <h2>Carrito (Debug)</h2>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};

export default CartDebug;