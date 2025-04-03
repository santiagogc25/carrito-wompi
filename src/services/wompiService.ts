const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
const WOMPI_BASE_URL = "https://sandbox.wompi.co/v1";

if (!WOMPI_PUBLIC_KEY) {
    throw new Error("❌ La clave pública de Wompi no está definida. Verifica tu configuración de variables de entorno.");
}

/**
 * Carga el script de Wompi y espera hasta que `window.Wompi` esté disponible.
 */
const loadWompiScript = () => {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            return reject(new Error("❌ Wompi solo puede ser cargado en el navegador."));
        }

        if (window.Wompi) {
            return resolve(true); // Ya está cargado
        }

        if (document.getElementById("wompi-script")) {
            return resolve(true);
        }

        const script = document.createElement("script");
        script.id = "wompi-script";
        script.src = "https://checkout.wompi.co/widget.js";
        script.async = true;
        
        script.onload = () => {
            const checkInterval = setInterval(() => {
                if (window.Wompi) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!window.Wompi) reject(new Error("❌ Error: Wompi no se cargó correctamente."));
            }, 5000);
        };

        script.onerror = () => reject(new Error("❌ Error al cargar el script de Wompi."));
        document.body.appendChild(script);
    });
};

/**
 * Muestra el widget de pago de Wompi.
 * @param {number} amount - Monto en pesos colombianos (COP).
 * @returns {Promise<{ success: boolean }>} Resultado del pago.
 */
export const loadWompiWidget = async (amount) => {
    try {
        await loadWompiScript();

        if (!window.Wompi) {
            throw new Error("❌ Wompi aún no está disponible en window.");
        }

        return new Promise((resolve) => {
            const reference = "TEST_" + Math.floor(Math.random() * 1000000);
            
            const checkout = new window.Wompi.WidgetCheckout({
                currency: "COP",
                amount_in_cents: amount * 100,
                reference,
                public_key: WOMPI_PUBLIC_KEY,
                redirect_url: "https://tu-web.com/checkout",
            });

            checkout.open((response) => {
                if (response.transaction && response.transaction.status === "APPROVED") {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            });
        });
    } catch (error) {
        console.error("Error en el proceso de pago con Wompi:", error);
        return { success: false };
    }
};
