"use client";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 flex flex-col items-center">
      <img src={product.image} alt={product.title} className="w-32 h-32 object-cover mb-4 rounded" />
      <h2 className="text-lg font-bold text-center">{product.title}</h2>
      <p className="text-gray-600 text-center">${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)} className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all">
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;