export interface WompiWidgetInstance {
  /**
   * Abre el widget de pago de Wompi y ejecuta el callback cuando finaliza.
   * @param callback Función que recibe la respuesta de la transacción.
   */
  open: (callback: (response: { transaction?: { status: string } }) => void) => void;
}

export interface WompiCheckout {
  /**
   * Constructor del widget de pago de Wompi.
   * @param options Opciones necesarias para inicializar el widget.
   */
  new (options: {
      currency: string;
      amount_in_cents: number;
      reference: string;
      public_key: string;
      redirect_url: string;
  }): WompiWidgetInstance;
}

/**
* Extensión de la interfaz global `Window` para incluir la propiedad `Wompi`.
*/
declare global {
  interface Window {
      Wompi?: {
          WidgetCheckout: WompiCheckout;
      };
  }
}

export interface Product {
  /**
   * Identificador único del producto.
   */
  id: number;
  
  /**
   * Nombre del producto.
   */
  title: string;
  
  /**
   * Precio del producto en COP.
   */
  price: number;
  
  /**
   * URL de la imagen del producto.
   */
  image: string;
  
  /**
   * Cantidad del producto en el carrito.
   */
  quantity?: number;


  description: string;
}
