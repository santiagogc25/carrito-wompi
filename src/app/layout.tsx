import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Carrito de Compras",
  description: "Prueba técnica con Wompi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />
      </head>
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
          <Cart />
        </ThemeProvider>
      </body>
    </html>
  );
}
