import type { Producto } from "@/tipos/producto";

// Datos de prueba: se reemplazan por los productos reales de Supabase.
export const productosDePrueba: Producto[] = [
  { codigoDeBarras: "7701001", nombre: "Aguardiente 750 ml", categoria: "Aguardiente", gradoAlcoholico: 29, precioDeVenta: 40000, porcentajeIva: 19, porcentajeConsumo: 10 },
  { codigoDeBarras: "7701002", nombre: "Ron añejo 750 ml", categoria: "Ron", gradoAlcoholico: 35, precioDeVenta: 65000, porcentajeIva: 19, porcentajeConsumo: 10 },
  { codigoDeBarras: "7701003", nombre: "Cerveza lata 330 ml", categoria: "Cerveza", gradoAlcoholico: 4, precioDeVenta: 3000, porcentajeIva: 19, porcentajeConsumo: 8 },
  { codigoDeBarras: "7701004", nombre: "Whisky 750 ml", categoria: "Whisky", gradoAlcoholico: 40, precioDeVenta: 120000, porcentajeIva: 19, porcentajeConsumo: 10 },
];