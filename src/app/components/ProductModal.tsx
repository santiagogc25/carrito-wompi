"use client"; // Indica que este componente se ejecuta en el cliente.

import { useState } from "react"; // Importa useState para gestionar el estado.
import { Product } from "@/types"; // Importa el tipo Product para tipado TypeScript.
import { useCartStore } from "@/store/cartStore"; // Importa el store del carrito.
import { ShoppingCart, Minus, Plus, X } from "lucide-react"; // Importa iconos de Lucide React.
import { Button } from "@/components/ui/button"; // Importa el componente de botón reutilizable.
import { Card, CardContent } from "@/components/ui/card"; // Importa componentes de tarjeta.

// Define las propiedades que recibe el modal.
const ProductModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const addToCart = useCartStore((state) => state.addToCart); // Obtiene la función para agregar al carrito.
  const [quantity, setQuantity] = useState(1); // Estado para gestionar la cantidad del producto.

  // Función para aumentar la cantidad.
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  
  // Función para disminuir la cantidad, evitando valores menores a 1.
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Función para agregar el producto al carrito y cerrar el modal.
  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      {/* Contenedor principal del modal */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Botón de cierre */}
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Imagen del producto */}
          <img src={product.image} alt={product.title} className="w-40 h-40 object-cover rounded-lg shadow-md" />

          <div className="text-center md:text-left">
            {/* Información del producto */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{product.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{product.description}</p>
            <p className="text-lg font-medium mt-2 text-gray-900 dark:text-gray-300">${product.price.toFixed(2)}</p>

            {/* Controles de cantidad */}
            <div className="flex items-center justify-center md:justify-start mt-3 space-x-3">
              <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity === 1}>
                <Minus size={16} />
              </Button>
              <span className="px-4 py-1 border dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                {quantity}
              </span>
              <Button variant="outline" size="icon" onClick={incrementQuantity}>
                <Plus size={16} />
              </Button>
            </div>

            {/* Botón Agregar al carrito */}
            <Button
              onClick={handleAddToCart}
              className="mt-4 flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md"
            >
              <ShoppingCart size={18} /> Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
