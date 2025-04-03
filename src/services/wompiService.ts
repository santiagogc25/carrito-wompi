const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
const WOMPI_BASE_URL = "https://sandbox.wompi.co/v1";

if (!WOMPI_PUBLIC_KEY) {
    throw new Error("❌ La clave pública de Wompi no está definida. Verifica tu configuración de variables de entorno.");
}

/**
 * Carga y muestra el widget de pago de Wompi con un resultado simulado.
 */
export const loadWompiWidget = async (amount: number): Promise<{ success: boolean }> => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
        if (typeof window === "undefined") {
            return reject(new Error("❌ Wompi solo puede ser cargado en el navegador."));
        }

        const scriptId = "wompi-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://checkout.wompi.co/widget.js";
            script.async = true;
            script.onload = () => resolve({ success: true });
            script.onerror = () => reject(new Error("❌ Error al cargar el script de Wompi."));
            document.body.appendChild(script);
        } else {
            resolve({ success: true });
        }
    }).then(() => {
        if (typeof window.Wompi === "undefined") {
            throw new Error("❌ Wompi aún no está disponible en window.");
        }

        window.Wompi.open({
            currency: "COP",
            amount_in_cents: amount * 100,
            public_key: WOMPI_PUBLIC_KEY!,
            redirect_url: "https://tu-web.com/checkout",
        });

        // Simular una respuesta de pago exitoso después de 3 segundos
        return new Promise<{ success: boolean }>((resolve) => {
            setTimeout(() => resolve({ success: true }), 3000);
        });
    });
};
