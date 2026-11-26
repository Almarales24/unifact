import type { TotalesDeVenta } from "@/librerias/impuestos";
import type { Pago } from "@/tipos/pago";
import type { LineaDeVenta } from "@/tipos/producto";

export type Factura = {
  numero: string;
  fechaIso: string;
  lineas: LineaDeVenta[];
  totales: TotalesDeVenta;
  pagos: Pago[];
  cambio: number;
};