"use client";

import { useState } from "react";
import { FacturaImprimible } from "@/componentes/FacturaImprimible";
import { PanelDePagos } from "@/componentes/PanelDePagos";
import { productosDePrueba } from "@/librerias/productosDePrueba";
import { calcularTotales, formatearPesos } from "@/librerias/impuestos";
import { resumirPagos } from "@/librerias/pagos";
import type { Factura } from "@/tipos/factura";
import type { LineaDeVenta, Producto } from "@/tipos/producto";
import type { MedioDePago, Pago } from "@/tipos/pago";

export default function PaginaVentas() {
  const [busqueda, setBusqueda] = useState("");
  const [lineas, setLineas] = useState<LineaDeVenta[]>([]);
  const [aviso, setAviso] = useState("");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [esMayorDeEdad, setEsMayorDeEdad] = useState(false);
  const [facturaEmitida, setFacturaEmitida] = useState<Factura | null>(null);

  const textoBuscado = busqueda.trim().toLowerCase();
  const coincidencias = textoBuscado
    ? productosDePrueba.filter((producto) =>
        producto.nombre.toLowerCase().includes(textoBuscado)
      )
    : [];

  const totales = calcularTotales(lineas);
  const resumen = resumirPagos(pagos, totales.total);

  const motivosPendientes: string[] = [];
  if (lineas.length === 0) motivosPendientes.push("Agrega al menos un producto.");
  if (!esMayorDeEdad) motivosPendientes.push("Confirma que el cliente es mayor de edad.");
  if (lineas.length > 0 && resumen.faltante > 0)
    motivosPendientes.push("Falta registrar el pago completo.");
  if (!resumen.cambioValido)
    motivosPendientes.push("El valor que sobra no se puede devolver con ese medio de pago.");
  const puedeCerrar = motivosPendientes.length === 0;

  function agregarProducto(producto: Producto) {
    setLineas((actuales) => {
      const existente = actuales.find(
        (linea) => linea.producto.codigoDeBarras === producto.codigoDeBarras
      );
      if (existente) {
        return actuales.map((linea) =>
          linea === existente ? { ...linea, cantidad: linea.cantidad + 1 } : linea
        );
      }
      return [...actuales, { producto, cantidad: 1 }];
    });
    setBusqueda("");
    setAviso("");
  }

  function cambiarCantidad(codigoDeBarras: string, cambio: number) {
    setLineas((actuales) =>
      actuales
        .map((linea) =>
          linea.producto.codigoDeBarras === codigoDeBarras
            ? { ...linea, cantidad: linea.cantidad + cambio }
            : linea
        )
        .filter((linea) => linea.cantidad > 0)
    );
  }

  function manejarBusqueda(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const texto = busqueda.trim();
    if (!texto) return;

    const porCodigo = productosDePrueba.find(
      (producto) => producto.codigoDeBarras === texto
    );
    if (porCodigo) {
      agregarProducto(porCodigo);
      return;
    }
    if (coincidencias.length === 1) {
      agregarProducto(coincidencias[0]);
      return;
    }
    setAviso(
      coincidencias.length === 0
        ? "No se encontró ningún producto."
        : "Hay varios productos, elige uno de la lista."
    );
  }

  function agregarPago(medio: MedioDePago, monto: number) {
    setPagos((actuales) => [...actuales, { id: crypto.randomUUID(), medio, monto }]);
  }

  function quitarPago(id: string) {
    setPagos((actuales) => actuales.filter((pago) => pago.id !== id));
  }

  function cerrarVenta() {
    if (!puedeCerrar) return;

    // Número temporal: el consecutivo real lo dará Supabase.
    setFacturaEmitida({
      numero: `TEMP-${String(Date.now()).slice(-6)}`,
      fechaIso: new Date().toISOString(),
      lineas,
      totales,
      pagos,
      cambio: resumen.cambio,
    });
    setLineas([]);
    setPagos([]);
    setEsMayorDeEdad(false);
  }

  if (facturaEmitida) {
    return (
      <>
        <h1 className="text-3xl font-bold">Venta cerrada</h1>

        <div className="mt-4">
          <FacturaImprimible factura={facturaEmitida} />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-12 rounded-lg bg-primario px-6 font-semibold text-primario-texto"
          >
            Imprimir factura
          </button>
          <button
            type="button"
            onClick={() => setFacturaEmitida(null)}
            className="min-h-12 rounded-lg border border-borde bg-superficie px-6 font-semibold"
          >
            Nueva venta
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Ventas</h1>

      <form onSubmit={manejarBusqueda} className="mt-4 flex flex-col gap-1">
        <label htmlFor="busqueda" className="font-semibold">
          Escanea el código de barras o busca por nombre
        </label>
        <input
          id="busqueda"
          type="text"
          value={busqueda}
          onChange={(evento) => {
            setBusqueda(evento.target.value);
            setAviso("");
          }}
          className="min-h-12 rounded-lg border border-borde bg-superficie px-3"
        />
        {aviso && (
          <p role="alert" className="text-sm text-peligro">
            {aviso}
          </p>
        )}
      </form>

      {coincidencias.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {coincidencias.map((producto) => (
            <li key={producto.codigoDeBarras}>
              <button
                type="button"
                onClick={() => agregarProducto(producto)}
                className="flex min-h-12 w-full items-center justify-between rounded-lg border border-borde bg-superficie px-4 text-left hover:bg-fondo"
              >
                <span>{producto.nombre}</span>
                <span className="font-semibold">
                  {formatearPesos(producto.precioDeVenta)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-6 rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-xl font-bold">Productos de la venta</h2>

        {lineas.length === 0 ? (
          <p className="mt-2 text-texto-suave">Aún no hay productos en esta venta.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-3">
            {lineas.map(({ producto, cantidad }) => (
              <li
                key={producto.codigoDeBarras}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-borde pb-3"
              >
                <div>
                  <p className="font-semibold">{producto.nombre}</p>
                  <p className="text-sm text-texto-suave">
                    {formatearPesos(producto.precioDeVenta)} c/u, antes de impuestos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${producto.nombre}`}
                    onClick={() => cambiarCantidad(producto.codigoDeBarras, -1)}
                    className="min-h-12 min-w-12 rounded-lg border border-borde font-bold"
                  >
                    −
                  </button>
                  <span aria-live="polite" className="min-w-8 text-center font-semibold">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    aria-label={`Agregar una unidad de ${producto.nombre}`}
                    onClick={() => cambiarCantidad(producto.codigoDeBarras, 1)}
                    className="min-h-12 min-w-12 rounded-lg border border-borde font-bold"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-1">
          <dt>Subtotal</dt>
          <dd className="text-right">{formatearPesos(totales.subtotal)}</dd>
          <dt>IVA</dt>
          <dd className="text-right">{formatearPesos(totales.iva)}</dd>
          <dt>Impuesto al consumo</dt>
          <dd className="text-right">{formatearPesos(totales.impuestoAlConsumo)}</dd>
          <dt className="text-xl font-bold">Total</dt>
          <dd className="text-right text-xl font-bold text-primario">
            {formatearPesos(totales.total)}
          </dd>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-xl font-bold">Verificación de edad</h2>
        <label className="mt-3 flex min-h-12 items-center gap-3 font-semibold">
          <input
            type="checkbox"
            checked={esMayorDeEdad}
            onChange={(evento) => setEsMayorDeEdad(evento.target.checked)}
            className="h-6 w-6"
          />
          Confirmo que el cliente es mayor de edad (18 años o más)
        </label>
      </section>

      <PanelDePagos
        pagos={pagos}
        resumen={resumen}
        total={totales.total}
        alAgregar={agregarPago}
        alQuitar={quitarPago}
      />

      <div className="mt-6">
        <button
          type="button"
          onClick={cerrarVenta}
          disabled={!puedeCerrar}
          aria-describedby={puedeCerrar ? undefined : "motivos-pendientes"}
          className="min-h-12 w-full rounded-lg bg-primario px-6 text-lg font-semibold text-primario-texto disabled:opacity-50"
        >
          Cerrar venta
        </button>

        {!puedeCerrar && (
          <ul id="motivos-pendientes" className="mt-2 list-disc pl-6 text-sm text-texto-suave">
            {motivosPendientes.map((motivo) => (
              <li key={motivo}>{motivo}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}