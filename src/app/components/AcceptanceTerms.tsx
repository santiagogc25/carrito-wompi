"use client"; // Indica que este componente se ejecuta en el cliente (React en el navegador).

import { useState, useEffect } from "react";

// Definición de las propiedades esperadas por el componente
interface AcceptanceTermsProps {
  onAccept: (token: string) => void; // Función que se ejecutará cuando el usuario acepte los términos
}

// Componente que maneja la aceptación de términos y condiciones de Wompi
const AcceptanceTerms: React.FC<AcceptanceTermsProps> = ({ onAccept }) => {
  // Estados del componente
  const [loading, setLoading] = useState(true); // Indica si aún se está cargando la información
  const [permalink, setPermalink] = useState(""); // URL de los términos y condiciones
  const [acceptanceToken, setAcceptanceToken] = useState(""); // Token de aceptación proporcionado por Wompi
  const [isChecked, setIsChecked] = useState(false); // Estado del checkbox de aceptación

  // Efecto que se ejecuta al montar el componente para obtener el token de aceptación desde Wompi
  useEffect(() => {
    const fetchAcceptanceToken = async () => {
      try {
        console.log("🔍 Obteniendo aceptación desde Wompi...");
        const response = await fetch(
          `https://sandbox.wompi.co/v1/merchants/${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`
        );

        if (!response.ok) {
          console.error(`❌ Error en la petición: ${response.status} ${response.statusText}`);
          return;
        }

        const data = await response.json();
        console.log("📡 Respuesta de Wompi:", data);

        // Extrae el token de aceptación y el enlace de términos y condiciones
        const acceptanceToken = data.data?.presigned_acceptance?.acceptance_token;
        const permalink = data.data?.presigned_acceptance?.permalink;

        if (acceptanceToken) {
          setAcceptanceToken(acceptanceToken);
          setPermalink(permalink);
          console.log("✅ Token guardado:", acceptanceToken);
        } else {
          console.error("❌ No se recibió el token de aceptación en la respuesta.");
        }
      } catch (error) {
        console.error("❌ Error obteniendo el token de aceptación:", error);
      } finally {
        setLoading(false); // Finaliza la carga independientemente del resultado
      }
    };

    fetchAcceptanceToken();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Términos y Condiciones
      </h2>

      {loading ? (
        // Muestra un mensaje de carga mientras se obtiene el token
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-300 my-2">
            Para continuar con el pago, por favor acepta nuestros{" "}
            <a
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Términos y Condiciones
            </a>.
          </p>

          {/* Checkbox para aceptar los términos y condiciones */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="accept-terms"
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label htmlFor="accept-terms" className="text-gray-700 dark:text-gray-300">
              Acepto los términos y condiciones
            </label>
          </div>

          {/* Botón de continuar, solo habilitado si el usuario acepta los términos */}
          <button
            onClick={() => {
              console.log("📩 Enviando token de aceptación:", acceptanceToken);
              onAccept(acceptanceToken);
            }}
            disabled={!isChecked}
            className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg ${
              isChecked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar
          </button>
        </>
      )}
    </div>
  );
};

export default AcceptanceTerms;
