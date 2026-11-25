export type MedioDePago = "efectivo" | "tarjeta" | "transferencia";

export type Pago = {
  id: string;
  medio: MedioDePago;
  monto: number; // en pesos
};

export const nombresDeMedios: Record<MedioDePago, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta (datáfono de la tienda)",
  transferencia: "Transferencia",
};