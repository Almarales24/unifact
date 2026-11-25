"use client";

import { useState } from "react";
import { formatearPesos } from "@/librerias/impuestos";
import type { ResumenDePagos } from "@/librerias/pagos";
import { nombresDeMedios, type MedioDePago, type Pago } from "@/tipos/pago";

type Propiedades = {
  pagos: Pago[];
  resumen: ResumenDePagos;
  total: number;
  alAgregar: (medio: MedioDePago, monto: number) => void;
  alQuitar: (id: string) => void;
};

export function PanelDePagos({ pagos, resumen, total, alAgregar, alQuitar }: Propiedades) {
  const [medio, setMedio] = useState<MedioDePago>("efectivo");
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");

  function manejarAgregar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const valor = Number(monto);

    if (!Number.isInteger(valor) || valor <= 0) {
      setError("Escribe un valor en pesos mayor que cero, sin puntos ni comas.");
      return;
    }

    alAgregar(medio, valor);
    setMonto("");
    setError("");
  }

  return (
    <section className="mt-6 rounded-xl border border-borde bg-superficie p-4">
      <h2 className="text-xl font-bold">Pago del cliente</h2>

      {total === 0 ? (
        <p className="mt-2 text-texto-suave">Agrega productos antes de registrar el pago.</p>
      ) : (
        <form onSubmit={manejarAgregar} noValidate className="mt-3 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="medio-de-pago" className="font-semibold">
              Medio de pago
            </label>
            <select
              id="medio-de-pago"
              value={medio}
              onChange={(evento) => setMedio(evento.target.value as MedioDePago)}
              className="min-h-12 rounded-lg border border-borde bg-superficie px-3"
            >
              {(Object.keys(nombresDeMedios) as MedioDePago[]).map((clave) => (
                <option key={clave} value={clave}>
                  {nombresDeMedios[clave]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="monto-del-pago" className="font-semibold">
              Valor recibido
            </label>
            <input
              id="monto-del-pago"
              type="text"
              inputMode="numeric"
              value={monto}
              onChange={(evento) => {
                setMonto(evento.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "error-del-pago" : undefined}
              className="min-h-12 w-40 rounded-lg border border-borde px-3"
            />
          </div>

          <button
            type="button"
            disabled={resumen.faltante === 0}
            onClick={() => setMonto(String(resumen.faltante))}
            className="min-h-12 rounded-lg border border-borde px-4 font-semibold disabled:opacity-50"
          >
            Poner lo que falta
          </button>

          <button
            type="submit"
            className="min-h-12 rounded-lg bg-primario px-4 font-semibold text-primario-texto"
          >
            Agregar pago
          </button>
        </form>
      )}

      {error && (
        <p id="error-del-pago" role="alert" className="mt-2 text-sm text-peligro">
          {error}
        </p>
      )}

      {pagos.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {pagos.map((pago) => (
            <li
              key={pago.id}
              className="flex items-center justify-between gap-2 border-b border-borde pb-2"
            >
              <span>
                {nombresDeMedios[pago.medio]}: <strong>{formatearPesos(pago.monto)}</strong>
              </span>
              <button
                type="button"
                onClick={() => alQuitar(pago.id)}
                aria-label={`Quitar el pago en ${nombresDeMedios[pago.medio]} de ${formatearPesos(pago.monto)}`}
                className="min-h-12 rounded-lg border border-borde px-4"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-1">
        <dt>Pagado</dt>
        <dd className="text-right">{formatearPesos(resumen.pagado)}</dd>
        <dt>Falta por pagar</dt>
        <dd className="text-right">{formatearPesos(resumen.faltante)}</dd>
        <dt>Cambio a devolver</dt>
        <dd className="text-right">{formatearPesos(resumen.cambio)}</dd>
      </dl>

      {!resumen.cambioValido && (
        <p role="alert" className="mt-2 text-sm text-peligro">
          El valor que sobra solo se puede devolver si se recibió en efectivo. Reduce el pago con
          tarjeta o transferencia.
        </p>
      )}
    </section>
  );
}