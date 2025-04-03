"use client";

import { useState, useEffect } from "react";
import ProductModal from "./ProductModal";

// Definimos la estructura de un producto con su tipo correspondiente
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

// Traducción de categorías al español
const categoryTranslations: Record<string, string> = {
  "Todos los productos": "Todos los productos",
  "electronics": "Electrónica",
  "jewelery": "Joyería",
  "men's clothing": "Ropa de Hombre",
  "women's clothing": "Ropa de Mujer",
};

const ProductList = () => {
  // Estado para almacenar los productos
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("Todos los productos");
  // Estado para el producto seleccionado en el modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Estado para controlar la visibilidad del menú lateral en dispositivos pequeños
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cargar los productos desde la API al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Extraer categorías únicas de los productos cargados
  const categories = ["Todos los productos", ...new Set(products.map((p) => p.category))];

  // Filtrar los productos según la categoría seleccionada
  const filteredProducts =
    selectedCategory === "Todos los productos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Menú de categorías */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 p-4 bg-gray-200 dark:bg-gray-800 dark:text-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/5`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Categorías</h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
        </div>
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer p-2 rounded-md ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setIsSidebarOpen(false);
              }}
            >
              {categoryTranslations[category] || category}
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenedor de productos */}
      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
        {/* Botón para abrir el menú en dispositivos móviles */}
        <button
          className={`md:hidden mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md ${
            isSidebarOpen ? "hidden" : "block"
          }`}
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ Categorías
        </button>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:text-white hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain aspect-[4/3] mb-4"
              />
              <h3 className="font-bold text-lg">{product.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">${product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
