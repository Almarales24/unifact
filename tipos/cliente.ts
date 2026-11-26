export type TipoDeDocumento = "cedula" | "nit";

export type Cliente = {
  id: string;
  tipoDeDocumento: TipoDeDocumento;
  numeroDeDocumento: string;
  nombre: string;
  correo: string;
};

export const nombresDeDocumentos: Record<TipoDeDocumento, string> = {
  cedula: "Cédula",
  nit: "NIT",
};