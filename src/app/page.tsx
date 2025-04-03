"use client";
import { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import { fetchProducts } from "@/services/productService";
import ProductList from "./components/ProductList";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        if (!Array.isArray(data)) throw new Error("❌ Respuesta de productos no válida.");
      } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        setError("Error al cargar los productos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="container mx-auto p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-4xl font-extrabold text-center mb-8 dark:text-white">
        Catálogo de Productos
      </h1>

      {/* Mostrar indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      )}

      {/* Mostrar mensaje de error */}
      {error && (
        <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg shadow-md">
          ❌ {error}
        </p>
      )}

      {/* Renderizar los productos solo si no hay error ni está cargando */}
      {!loading && !error && <ProductList />}

      <Footer />
    </div>
  );
}
