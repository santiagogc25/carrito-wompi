"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Wompi?: any;
  }
}

const Checkout = () => {
  const cartItems = useCartStore((state) => state.cart);
  const totalPrice = useCartStore((state) => state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Wompi) {
      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true;
      script.onload = () => console.log("✅ Wompi cargado correctamente.");
      script.onerror = () => setError("❌ Error al cargar el script de Wompi.");
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = () => {
    if (cartItems.length === 0) return alert("🛒 El carrito está vacío.");
    if (!window.Wompi) return alert("❌ Error: Wompi no está disponible.");

    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const redirectUrl = process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL;

    if (!publicKey || !redirectUrl) {
      setError("❌ Falta configurar las variables de entorno de Wompi.");
      return;
    }

    setLoading(true);

    window.Wompi.open({
      currency: "COP",
      amountInCents: Math.round(totalPrice * 100),
      reference: `ORDER-${Date.now()}`,
      publicKey,
      redirectUrl,
    });

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">Resumen de Compra</h2>
      <div className="border-b pb-3 mb-3">
        <p className="text-lg text-gray-700 dark:text-gray-300 flex justify-between">
          Total a pagar: <span className="font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
        </p>
      </div>
      {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-3">{error}</p>}
      <button
        onClick={handlePayment}
        className={`mt-4 w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed`}
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Proceder al pago"}
      </button>
    </div>
  );
};

export default Checkout;
