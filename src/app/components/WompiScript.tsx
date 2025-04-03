"use client";
import Script from "next/script";

const WompiScript = () => {
  return <Script 
  src="https://checkout.wompi.co/widget.js" 
  strategy="lazyOnload"
  onLoad={() => console.log("Wompi cargado correctamente")}
  onError={() => console.error("Error al cargar Wompi")}
/>;
};

export default WompiScript;
