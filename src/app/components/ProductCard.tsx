"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const price = product.price.toFixed(2);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.title} agregado al carrito`);
  };

  return (
    <>
      <Card
        className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 transition-transform transform hover:scale-105 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="flex flex-col items-center p-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-40 h-40 object-cover mb-4 rounded-lg shadow-md"
          />
          <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100 truncate w-40">
            {product.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg font-medium">${price}</p>

          <div className="flex items-center mt-3 space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity === 1}
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </Button>
            <span className="px-4 py-1 border dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="mt-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md"
          >
            <ShoppingCart size={18} /> Agregar al carrito
          </Button>
        </CardContent>
      </Card>
      console.log("Producto recibido en ProductCard:", product);

      {/* Ventana emergente (modal) */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{product.title}</h2>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-64 object-cover rounded-md"
            />
            <p className="mt-4 text-gray-700 dark:text-gray-300">{product.description}</p>
            <p className="text-blue-500 font-bold mt-2 text-lg">${price}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
