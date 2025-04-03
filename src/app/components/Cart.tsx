"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash } from "lucide-react";
import { loadWompiWidget } from "@/services/wompiService";
import AcceptanceTerms from "./AcceptanceTerms";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Cart = () => {
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [acceptanceToken, setAcceptanceToken] = useState<string>("");
    
    const { setCart } = useCartStore.getState();

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart.map(item => ({ ...item, quantity: item.quantity || 1 })));
                }
            } catch (e) {
                console.error("Error parsing cart from localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleAcceptTerms = (token: string) => {
        setAcceptanceToken(token);
    };

    const handlePayment = async () => {
        try {
            if (total === 0) throw new Error("El total debe ser mayor a 0 para realizar un pago.");
            if (!acceptanceToken) throw new Error("Debes aceptar los términos y condiciones para continuar.");
            
            const paymentResponse = await loadWompiWidget(total);
            
            if (paymentResponse && paymentResponse.success) {
                toast.success("Pago realizado con éxito");
                useCartStore.setState({ cart: [] }); // Vaciar carrito tras pago exitoso
                localStorage.removeItem("cart"); // Limpia el localStorage
            } else {
                setError("Hubo un problema con el pago.");
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
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

            {isOpen && (
                <div className="fixed top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 shadow-xl p-6 z-50 flex flex-col overflow-y-auto">
                    <Button 
                        onClick={() => setIsOpen(false)}
                        variant="ghost"
                        className="text-red-500 text-2xl self-end"
                        aria-label="Cerrar carrito"
                    >
                        <X />
                    </Button>
                    <h2 className="text-2xl font-bold mb-6 text-center">Carrito de Compras</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-600 text-center">🛒 Tu carrito está vacío</p>
                    ) : (
                        <>
                            <ul className="flex-1 overflow-y-auto space-y-4">
                                {cart.map((product) => (
                                    <li key={product.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{product.title}</span>
                                            <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, product.quantity - 1)} disabled={product.quantity === 1}>
                                                <Minus size={16} />
                                            </Button>
                                            <span className="text-lg font-semibold">{product.quantity}</span>
                                            <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                                                <Plus size={16} />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => removeFromCart(product.id)}>
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 font-bold text-xl text-center">Total: ${total.toFixed(2)}</p>
                            <AcceptanceTerms onAccept={handleAcceptTerms} />
                            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
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
