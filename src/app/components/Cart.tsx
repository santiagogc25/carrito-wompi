"use client"; // Indica que este componente se ejecuta en el cliente (React en el navegador).

import { useCartStore } from "@/store/cartStore"; // Importa el store del carrito de compras.
import { useState, useEffect } from "react"; // Hooks de React para manejar estado y efectos secundarios.
import { ShoppingCart, X, Plus, Minus, Trash } from "lucide-react"; // Iconos para mejorar la UI.
import { loadWompiWidget } from "@/services/wompiService"; // Función para cargar el widget de pagos de Wompi.
import AcceptanceTerms from "./AcceptanceTerms"; // Componente para aceptar términos y condiciones.
import { toast } from "sonner"; // Biblioteca para mostrar notificaciones.
import { Button } from "@/components/ui/button"; // Componente de botón reutilizable.

const Cart = () => {
    // Obtiene el estado del carrito y las funciones de modificación desde el store.
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    
    // Estados locales para manejar la UI y lógica del pago.
    const [isOpen, setIsOpen] = useState(false); // Controla si el carrito está abierto o cerrado.
    const [error, setError] = useState(""); // Almacena errores relacionados con el pago.
    const [acceptanceToken, setAcceptanceToken] = useState<string>(""); // Token de aceptación de términos.

    const { setCart } = useCartStore.getState(); // Función para actualizar el carrito en el store.

    // Carga el carrito desde localStorage al montar el componente.
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    // Asegura que cada producto tenga una cantidad definida (por defecto 1).
                    setCart(parsedCart.map(item => ({ ...item, quantity: item.quantity || 1 })));
                }
            } catch (e) {
                console.error("Error parsing cart from localStorage", e);
            }
        }
    }, []);

    // Guarda el carrito en localStorage cada vez que cambie.
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Calcula el total del carrito sumando los precios de cada producto multiplicado por su cantidad.
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Función que actualiza el token de aceptación de términos y condiciones.
    const handleAcceptTerms = (token: string) => {
        setAcceptanceToken(token);
    };

    // Maneja el proceso de pago con Wompi.
    const handlePayment = async () => {
        try {
            if (total === 0) throw new Error("El total debe ser mayor a 0 para realizar un pago.");
            if (!acceptanceToken) throw new Error("Debes aceptar los términos y condiciones para continuar.");
            
            // Llama al servicio de pago de Wompi.
            const paymentResponse: { success: boolean } = await loadWompiWidget(total);
            
            if (paymentResponse && paymentResponse.success) {
                toast.success("Pago realizado con éxito"); // Muestra mensaje de éxito.
                useCartStore.setState({ cart: [] }); // Vacía el carrito tras el pago exitoso.
                localStorage.removeItem("cart"); // Elimina el carrito del almacenamiento local.
            } else {
                setError("Hubo un problema con el pago."); // Maneja posibles errores en el pago.
            }
        } catch (err: any) {
            setError(err.message); // Muestra el error en la interfaz.
        }
    };

    return (
        <>
            {/* Botón flotante para abrir el carrito */}
            <Button 
                onClick={() => setIsOpen(true)} 
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition z-50"
            >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.length}
                    </span>
                )}
            </Button>

            {/* Modal del carrito */}
            {isOpen && (
                <div className="fixed top-0 right-0 w-[400px] md:w-[500px] lg:w-[600px] h-full bg-white dark:bg-gray-900 shadow-xl p-6 z-50 flex flex-col overflow-y-auto">
                    {/* Botón para cerrar el carrito */}
                    <Button onClick={() => setIsOpen(false)} variant="ghost" className="text-red-500 text-2xl self-end" aria-label="Cerrar carrito">
                        <X />
                    </Button>

                    <h2 className="text-2xl font-bold mb-6 text-center">Carrito de Compras</h2>

                    {/* Si el carrito está vacío, muestra un mensaje */}
                    {cart.length === 0 ? (
                        <p className="text-gray-600 text-center">🛒 Tu carrito está vacío</p>
                    ) : (
                        <>
                            {/* Lista de productos en el carrito */}
                            <ul className="flex-1 overflow-y-auto space-y-4">
                                {cart.map((product) => (
                                    <li key={product.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{product.title}</span>
                                            <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
                                        </div>
                                        {/* Controles para modificar la cantidad de productos */}
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                onClick={() => updateQuantity(product.id, product.quantity - 1)} 
                                                disabled={product.quantity === 1}
                                            >
                                                <Minus size={16} />
                                            </Button>
                                            <span className="text-lg font-semibold">{product.quantity}</span>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                            >
                                                <Plus size={16} />
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                onClick={() => removeFromCart(product.id)}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Muestra el total del carrito */}
                            <p className="mt-4 font-bold text-xl text-center">Total: ${total.toFixed(2)}</p>

                            {/* Componente para aceptar términos y condiciones */}
                            <AcceptanceTerms onAccept={handleAcceptTerms} />

                            {/* Muestra errores si existen */}
                            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                            {/* Botón para proceder al pago */}
                            <Button 
                                onClick={handlePayment} 
                                className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition text-lg"
                            >
                                Proceder al Pago
                            </Button>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Cart;
