"use client";

import { useState } from "react";
import { nombresDeDocumentos, type Cliente, type TipoDeDocumento } from "@/tipos/cliente";
import {
  limpiarDocumento,
  validarCliente,
  type ErroresDeCliente,
} from "@/librerias/validacionesDeCliente";

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tipoDeDocumento, setTipoDeDocumento] = useState<TipoDeDocumento>("cedula");
  const [numeroDeDocumento, setNumeroDeDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [autoriza, setAutoriza] = useState(false);
  const [errores, setErrores] = useState<ErroresDeCliente>({});
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const textoBuscado = busqueda.trim().toLowerCase();
  const clientesVisibles = textoBuscado
    ? clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(textoBuscado) ||
          cliente.numeroDeDocumento.includes(limpiarDocumento(textoBuscado))
      )
    : clientes;

  function manejarEnvio(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("");

    const erroresEncontrados = validarCliente(
      {
        tipoDeDocumento,
        numeroDeDocumento,
        nombre,
        correo,
        autorizaTratamientoDeDatos: autoriza,
      },
      clientes
    );
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    setClientes((actuales) => [
      ...actuales,
      {
        id: crypto.randomUUID(),
        tipoDeDocumento,
        numeroDeDocumento: limpiarDocumento(numeroDeDocumento),
        nombre: nombre.trim(),
        correo: correo.trim(),
      },
    ]);
    setNumeroDeDocumento("");
    setNombre("");
    setCorreo("");
    setAutoriza(false);
    setMensaje("Cliente guardado.");
  }

  function quitarCliente(id: string) {
    setClientes((actuales) => actuales.filter((cliente) => cliente.id !== id));
    setMensaje("");
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Clientes</h1>
      <p className="mt-1 text-texto-suave">
        Guarda los datos de quien pide la factura a su nombre.
      </p>

      <form
        onSubmit={manejarEnvio}
        noValidate
        className="mt-4 flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-4"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="tipo-de-documento" className="font-semibold">
              Tipo de documento
            </label>
            <select
              id="tipo-de-documento"
              value={tipoDeDocumento}
              onChange={(evento) => setTipoDeDocumento(evento.target.value as TipoDeDocumento)}
              className="min-h-12 rounded-lg border border-borde bg-superficie px-3"
            >
              {(Object.keys(nombresDeDocumentos) as TipoDeDocumento[]).map((clave) => (
                <option key={clave} value={clave}>
                  {nombresDeDocumentos[clave]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="numero-de-documento" className="font-semibold">
              Número de documento
            </label>
            <input
              id="numero-de-documento"
              type="text"
              inputMode="numeric"
              value={numeroDeDocumento}
              onChange={(evento) => setNumeroDeDocumento(evento.target.value)}
              aria-invalid={Boolean(errores.numeroDeDocumento)}
              aria-describedby={errores.numeroDeDocumento ? "error-documento" : undefined}
              className="min-h-12 rounded-lg border border-borde px-3"
            />
            {errores.numeroDeDocumento && (
              <p id="error-documento" role="alert" className="text-sm text-peligro">
                {errores.numeroDeDocumento}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="nombre-del-cliente" className="font-semibold">
            Nombre completo o razón social
          </label>
          <input
            id="nombre-del-cliente"
            type="text"
            autoComplete="off"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? "error-nombre" : undefined}
            className="min-h-12 rounded-lg border border-borde px-3"
          />
          {errores.nombre && (
            <p id="error-nombre" role="alert" className="text-sm text-peligro">
              {errores.nombre}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="correo-del-cliente" className="font-semibold">
            Correo
          </label>
          <input
            id="correo-del-cliente"
            type="email"
            autoComplete="off"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? "error-correo-cliente" : undefined}
            className="min-h-12 rounded-lg border border-borde px-3"
          />
          {errores.correo && (
            <p id="error-correo-cliente" role="alert" className="text-sm text-peligro">
              {errores.correo}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex min-h-12 items-center gap-3 font-semibold">
            <input
              type="checkbox"
              checked={autoriza}
              onChange={(evento) => setAutoriza(evento.target.checked)}
              aria-describedby={errores.autorizaTratamientoDeDatos ? "error-autorizacion" : undefined}
              className="h-6 w-6"
            />
            El cliente autoriza el tratamiento de sus datos personales para facturar (Ley 1581 de 2012)
          </label>
          {errores.autorizaTratamientoDeDatos && (
            <p id="error-autorizacion" role="alert" className="text-sm text-peligro">
              {errores.autorizaTratamientoDeDatos}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="min-h-12 rounded-lg bg-primario px-6 font-semibold text-primario-texto"
        >
          Guardar cliente
        </button>

        {mensaje && (
          <p role="status" className="font-semibold text-exito">
            {mensaje}
          </p>
        )}
      </form>

      <section className="mt-6 rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-xl font-bold">Clientes guardados</h2>

        <div className="mt-3 flex flex-col gap-1">
          <label htmlFor="buscar-cliente" className="font-semibold">
            Buscar por nombre o documento
          </label>
          <input
            id="buscar-cliente"
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            className="min-h-12 rounded-lg border border-borde px-3"
          />
        </div>

        {clientes.length === 0 ? (
          <p className="mt-3 text-texto-suave">Aún no hay clientes guardados.</p>
        ) : clientesVisibles.length === 0 ? (
          <p className="mt-3 text-texto-suave">Ningún cliente coincide con la búsqueda.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {clientesVisibles.map((cliente) => (
              <li
                key={cliente.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-borde pb-3"
              >
                <div>
                  <p className="font-semibold">{cliente.nombre}</p>
                  <p className="text-sm text-texto-suave">
                    {nombresDeDocumentos[cliente.tipoDeDocumento]} {cliente.numeroDeDocumento} ·{" "}
                    {cliente.correo}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => quitarCliente(cliente.id)}
                  aria-label={`Quitar a ${cliente.nombre}`}
                  className="min-h-12 rounded-lg border border-borde px-4"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}