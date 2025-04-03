"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  // Obtiene los productos en el carrito desde el store global
  const cartItems = useCartStore((state) => state.cart);
  
  // Calcula el total sumando los precios de los productos por sus cantidades
  const totalPrice = useCartStore((state) => 
    state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  
  const [loading, setLoading] = useState(false); // Estado para manejar la carga del pago
  const [error, setError] = useState(""); // Estado para almacenar errores

  // Carga el script de Wompi solo si no está ya disponible
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

  // Maneja la lógica del pago con Wompi
  const handlePayment = () => {
    if (cartItems.length === 0) return alert("🛒 El carrito está vacío.");
    if (!window.Wompi || !window.Wompi.WidgetCheckout) {
      return setError("❌ Error: Wompi no está disponible.");
    }

    // Obtiene las variables de entorno necesarias para la integración con Wompi
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const redirectUrl = process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL;

    if (!publicKey || !redirectUrl) {
      setError("❌ Falta configurar las variables de entorno de Wompi.");
      return;
    }

    setLoading(true);

    // Inicializa el widget de pago de Wompi
    const checkout = new window.Wompi.WidgetCheckout({
      currency: "COP", // Moneda en la que se realizará el pago
      amount_in_cents: Math.round(totalPrice * 100), // Total convertido a centavos
      reference: `ORDER-${Date.now()}`, // Referencia única para la transacción
      public_key: publicKey, // Llave pública de Wompi
      redirect_url: redirectUrl, // URL de redirección tras el pago
    });

    // Abre el widget de pago y maneja la respuesta
    checkout.open(({ transaction }) => {
      if (transaction?.status === "APPROVED") {
        alert("✅ Pago aprobado");
      } else {
        alert("⚠️ Pago no aprobado");
      }
      setLoading(false);
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        Resumen de Compra
      </h2>
      <div className="border-b pb-3 mb-3">
        <p className="text-lg text-gray-700 dark:text-gray-300 flex justify-between">
          Total a pagar: <span className="font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
        </p>
      </div>
      {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-3">{error}</p>}
      <button
        onClick={handlePayment}
        className="mt-4 w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Proceder al pago"}
      </button>
    </div>
  );
};

export default Checkout;
