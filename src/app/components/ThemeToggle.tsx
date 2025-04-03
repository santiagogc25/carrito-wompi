// Indica que este componente es un cliente en Next.js, necesario para usar hooks como useState y useEffect.
"use client";

import { useEffect, useState } from "react"; // Importa los hooks necesarios.
import { Moon, Sun } from "lucide-react"; // Importa los iconos para el cambio de tema.

const ThemeToggle = () => {
  // Estado para manejar el tema ("light" o "dark").
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Al montar el componente, verifica si hay un tema guardado en localStorage.
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      // Si el tema almacenado es "dark", aplica la clase correspondiente y actualiza el estado.
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      // Si el tema es "light" o no hay un tema almacenado, asegura que la clase "dark" no esté presente.
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []); // Se ejecuta solo una vez al montar el componente.

  const toggleTheme = () => {
    // Alterna entre los temas "light" y "dark".
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme); // Actualiza el estado del tema.
    localStorage.setItem("theme", newTheme); // Guarda el nuevo tema en localStorage.
    
    // Agrega o remueve la clase "dark" del elemento raíz según el tema seleccionado.
    document.documentElement.classList.toggle("dark");
  };

  return (
    // Botón para cambiar el tema. Aplica estilos diferentes en modo claro y oscuro.
    <button onClick={toggleTheme} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700">
      {/* Muestra el ícono de la luna en modo claro y el sol en modo oscuro */}
      {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle; // Exporta el componente para su uso en otros archivos.
