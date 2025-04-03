// Indica que este componente es un cliente en Next.js, necesario para usar hooks como useState y useEffect.
"use client";

import { useEffect, useState } from "react"; // Importa los hooks useEffect y useState necesarios.

const WompiWidget = ({ amount }: { amount: number }) => {
  // Estado para controlar si se está cargando el widget o si la acción de pago está en progreso.
  const [isLoading, setIsLoading] = useState(false);

  // useEffect para cargar dinámicamente el script de Wompi solo cuando el componente se monta.
  useEffect(() => {
    // Verifica que estamos en el entorno del navegador y que el widget no ha sido cargado previamente.
    if (typeof window !== "undefined" && !window.WidgetCheckout) {
      // Crea un elemento <script> y asigna la URL del script de Wompi.
      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.async = true; // Carga el script de manera asíncrona.
      document.body.appendChild(script); // Agrega el script al cuerpo del documento.
    }
  }, []); // Se ejecuta solo una vez, cuando el componente se monta.

  // Función que se ejecuta cuando el usuario hace clic en el botón para iniciar el pago.
  const handlePayment = () => {
    setIsLoading(true); // Cambia el estado a "cargando" para deshabilitar el botón.

    try {
      // Genera una referencia única para la transacción (simulada).
      const reference = "TEST_" + Math.floor(Math.random() * 1000000);
      
      // Verifica si el objeto WidgetCheckout está disponible (es decir, si el script de Wompi se cargó correctamente).
      if (typeof window !== "undefined" && window.WidgetCheckout) {
        // Crea una nueva instancia del widget de Wompi.
        const checkout = new window.WidgetCheckout({
          currency: "COP", // Moneda en la que se realizará el pago.
          amountInCents: amount * 100, // Convierte el monto a centavos, como exige Wompi.
          reference: reference, // Establece la referencia única de la transacción.
          publicKey: "pub_test_rrnLHOmdCTLw1kquFbHgxQjKyYSndKhu", // Clave pública proporcionada por Wompi.
          redirectUrl: "https://ejemplo.com/confirmacion", // URL a la que el usuario será redirigido después del pago.
        });

        // Abre el widget de pago y maneja la respuesta de Wompi.
        checkout.open((response) => {
          console.log("Respuesta de Wompi:", response); // Muestra la respuesta de la transacción en la consola.
          alert(`Estado: ${response.transaction.status}\nReferencia: ${response.transaction.reference}`); // Muestra el estado de la transacción y la referencia.
          setIsLoading(false); // Finaliza el estado de carga.
        });
      } else {
        // Si el widget no está disponible, lanza un error.
        throw new Error("El widget de Wompi no está disponible.");
      }
    } catch (error: any) {
      // Si ocurre un error, muestra un mensaje de alerta.
      alert(error.message);
      setIsLoading(false); // Finaliza el estado de carga en caso de error.
    }
  };

  return (
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Pago con Wompi</h2>
      
      {/* Botón para iniciar el pago, se deshabilita cuando se está cargando */}
      <button
        onClick={handlePayment} // Llama a handlePayment cuando se hace clic.
        disabled={isLoading} // Deshabilita el botón si está en carga.
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {/* Muestra texto de "Cargando..." si está en carga, de lo contrario muestra "Pagar con Wompi" */}
        {isLoading ? "Cargando..." : "Pagar con Wompi"}
      </button>
    </div>
  );
};

export default WompiWidget; // Exporta el componente para su uso en otros archivos.
