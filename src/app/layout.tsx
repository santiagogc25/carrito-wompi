import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Cart from "./components/Cart"; // Importamos el nuevo carrito flotante

export const metadata: Metadata = {
  title: "Carrito de Compras",
  description: "Prueba técnica con Wompi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Header />
        {children}
        <Cart /> {/* El carrito siempre está disponible */}
      </body>
    </html>
  );
}
