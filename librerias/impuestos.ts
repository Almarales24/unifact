import type { LineaDeVenta } from "@/tipos/producto";

export type TotalesDeVenta = {
  subtotal: number;
  iva: number;
  impuestoAlConsumo: number;
  total: number;
};

export function calcularTotales(lineas: LineaDeVenta[]): TotalesDeVenta {
  let subtotal = 0;
  let iva = 0;
  let impuestoAlConsumo = 0;

  for (const { producto, cantidad } of lineas) {
    const base = producto.precioDeVenta * cantidad;
    subtotal += base;
    iva += Math.round((base * producto.porcentajeIva) / 100);
    impuestoAlConsumo += Math.round((base * producto.porcentajeConsumo) / 100);
  }

  return {
    subtotal,
    iva,
    impuestoAlConsumo,
    total: subtotal + iva + impuestoAlConsumo,
  };
}

export function formatearPesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}