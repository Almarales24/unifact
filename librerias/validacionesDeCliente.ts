import type { Cliente, TipoDeDocumento } from "@/tipos/cliente";

export type DatosDelFormulario = {
  tipoDeDocumento: TipoDeDocumento;
  numeroDeDocumento: string;
  nombre: string;
  correo: string;
  autorizaTratamientoDeDatos: boolean;
};

export type ErroresDeCliente = {
  numeroDeDocumento?: string;
  nombre?: string;
  correo?: string;
  autorizaTratamientoDeDatos?: string;
};

export function limpiarDocumento(valor: string): string {
  return valor.replace(/[.\-\s]/g, "");
}

export function validarCliente(
  datos: DatosDelFormulario,
  clientesExistentes: Cliente[]
): ErroresDeCliente {
  const errores: ErroresDeCliente = {};
  const documento = limpiarDocumento(datos.numeroDeDocumento);

  if (!documento) {
    errores.numeroDeDocumento = "Escribe el número de documento.";
  } else if (!/^\d+$/.test(documento)) {
    errores.numeroDeDocumento = "El documento solo puede tener números.";
  } else if (datos.tipoDeDocumento === "cedula" && (documento.length < 6 || documento.length > 10)) {
    errores.numeroDeDocumento = "La cédula debe tener entre 6 y 10 números.";
  } else if (datos.tipoDeDocumento === "nit" && (documento.length < 9 || documento.length > 10)) {
    errores.numeroDeDocumento = "El NIT debe tener 9 o 10 números, incluido el dígito de verificación.";
  } else if (clientesExistentes.some((cliente) => cliente.numeroDeDocumento === documento)) {
    errores.numeroDeDocumento = "Ya existe un cliente con ese documento.";
  }

  if (datos.nombre.trim().length < 3) {
    errores.nombre = "Escribe el nombre completo o la razón social.";
  }

  if (!datos.correo.trim()) {
    errores.correo = "Escribe el correo.";
  } else if (!/^\S+@\S+\.\S+$/.test(datos.correo.trim())) {
    errores.correo = "El correo no es válido.";
  }

  if (!datos.autorizaTratamientoDeDatos) {
    errores.autorizaTratamientoDeDatos =
      "Debes confirmar que el cliente autorizó el tratamiento de sus datos.";
  }

  return errores;
}