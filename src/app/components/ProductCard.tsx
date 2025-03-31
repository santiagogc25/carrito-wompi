"use client"; 

import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  // Función para incrementar cantidad
  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  // Función para decrementar cantidad (mínimo 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 flex flex-col items-center">
      <img
        src={product.image}
        alt={product.title}
        className="w-32 h-32 object-cover mb-4 rounded"
      />
      <h2 className="text-lg font-bold text-center">{product.title}</h2>
      <p className="text-gray-600 text-center">${product.price.toFixed(2)}</p>

      {/* Controles de cantidad estilo AliExpress */}
      <div className="flex items-center mt-2 space-x-2">
        <button
          onClick={decrementQuantity}
          className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
        >
          −
        </button>
        <span className="px-4 py-1 border dark:border-gray-600">{quantity}</span>
        <button
          onClick={incrementQuantity}
          className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={() => addToCart(product, quantity)}
        className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;
