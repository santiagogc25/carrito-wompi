export const fetchProducts = async () => {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error("Error al obtener productos");
        }
        return await response.json();
    } catch (error) {
        console.error("❌ Error al cargar productos:", error);
        return [];
    }
};
