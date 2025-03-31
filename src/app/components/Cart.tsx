"use client";
import { useCartStore } from "@/store/cartStore";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const subtotal = useCartStore((state) => state.subtotal);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">El carrito está vacío</p>
      ) : (
        <>
          <ul>
            {cart.map((product) => (
              <li key={product.id} className="border-b py-2 flex justify-between">
                <span>{product.title} - ${product.price.toFixed(2)}</span>
                <button onClick={() => removeFromCart(product.id)} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">
                  X
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default Cart;
