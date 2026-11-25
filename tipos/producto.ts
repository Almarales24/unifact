export type Producto = {
  codigoDeBarras: string;
  nombre: string;
  categoria: string;
  gradoAlcoholico: number;
  precioDeVenta: number; // en pesos, antes de impuestos
  porcentajeIva: number;
  porcentajeConsumo: number;
};

export type LineaDeVenta = {
  producto: Producto;
  cantidad: number;
};
