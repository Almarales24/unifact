import type { Pago } from "@/tipos/pago";

export type ResumenDePagos = {
  pagado: number;
  faltante: number;
  cambio: number;
  cambioValido: boolean;
};

export function resumirPagos(pagos: Pago[], total: number): ResumenDePagos {
  const pagado = pagos.reduce((suma, pago) => suma + pago.monto, 0);
  const efectivo = pagos
    .filter((pago) => pago.medio === "efectivo")
    .reduce((suma, pago) => suma + pago.monto, 0);
  const cambio = Math.max(pagado - total, 0);

  return {
    pagado,
    faltante: Math.max(total - pagado, 0),
    cambio,
    cambioValido: cambio <= efectivo,
  };
}