"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { ShoppingCart } from "lucide-react"; // Icono de carrito

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el carrito

  // Calcular subtotal total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition relative"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      {/* Panel lateral del carrito */}
      {isOpen && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-900 shadow-lg p-4 transition-transform transform translate-x-0">
          <button onClick={() => setIsOpen(false)} className="text-red-500 font-bold text-lg absolute top-2 right-4">
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">Carrito</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">El carrito está vacío</p>
          ) : (
            <>
              <ul>
                {cart.map((product) => (
                  <li key={product.id} className="border-b py-2 flex justify-between items-center">
                    <div>
                      <span className="font-bold">{product.title}</span>
                      <p className="text-gray-600 text-sm">
                        ${product.price.toFixed(2)} x {product.quantity} = <strong>${(product.price * product.quantity).toFixed(2)}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-bold text-lg">Total: ${total.toFixed(2)}</p>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;
