"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import Cart from "@/app/components/Cart";
import Footer from "@/app/components/Footer";
import { Product } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-10">
        <Cart />
      </div>
      <Footer />
    </div>
  );
}