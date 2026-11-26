import { datosDelNegocio } from "@/librerias/datosDelNegocio";
import { formatearPesos } from "@/librerias/impuestos";
import type { Factura } from "@/tipos/factura";
import { nombresDeMedios } from "@/tipos/pago";

export function FacturaImprimible({ factura }: { factura: Factura }) {
  const fecha = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(factura.fechaIso));

  return (
    <article
      aria-label={`Factura ${factura.numero}`}
      className="zona-de-impresion mx-auto w-full max-w-sm rounded-xl border border-borde bg-superficie p-4 font-mono text-sm"
    >
      <header className="text-center">
        <p className="text-base font-bold">{datosDelNegocio.nombre}</p>
        <p>NIT {datosDelNegocio.nit}</p>
        <p>{datosDelNegocio.direccion}</p>
      </header>

      <p className="mt-3">Factura N.° {factura.numero}</p>
      <p>Fecha: {fecha}</p>
      <p>Cliente: consumidor final</p>

      <ul className="mt-3 border-t border-dashed border-texto-suave pt-2">
        {factura.lineas.map(({ producto, cantidad }) => (
          <li key={producto.codigoDeBarras} className="mb-2">
            <p>{producto.nombre}</p>
            <p className="flex justify-between">
              <span>
                {cantidad} x {formatearPesos(producto.precioDeVenta)}
              </span>
              <span>{formatearPesos(producto.precioDeVenta * cantidad)}</span>
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-2 grid grid-cols-2 gap-1 border-t border-dashed border-texto-suave pt-2">
        <dt>Subtotal</dt>
        <dd className="text-right">{formatearPesos(factura.totales.subtotal)}</dd>
        <dt>IVA</dt>
        <dd className="text-right">{formatearPesos(factura.totales.iva)}</dd>
        <dt>Imp. al consumo</dt>
        <dd className="text-right">{formatearPesos(factura.totales.impuestoAlConsumo)}</dd>
        <dt className="font-bold">TOTAL</dt>
        <dd className="text-right font-bold">{formatearPesos(factura.totales.total)}</dd>
      </dl>

      <div className="mt-2 border-t border-dashed border-texto-suave pt-2">
        <p className="font-bold">Pagos</p>
        <ul>
          {factura.pagos.map((pago) => (
            <li key={pago.id} className="flex justify-between">
              <span>{nombresDeMedios[pago.medio]}</span>
              <span>{formatearPesos(pago.monto)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between">
          <span>Cambio</span>
          <span>{formatearPesos(factura.cambio)}</span>
        </p>
      </div>

      <footer className="mt-3 text-center text-xs">
        <p>Documento interno, no es factura electrónica de la DIAN.</p>
        <p>Gracias por su compra.</p>
      </footer>
    </article>
  );
}