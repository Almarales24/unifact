"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { OpcionDeMenu } from "@/librerias/roles";

export function MenuLateral({ opciones }: { opciones: OpcionDeMenu[] }) {
  const rutaActual = usePathname();

  return (
    <nav aria-label="Menú principal">
      <ul className="flex flex-row flex-wrap gap-2 md:flex-col">
        {opciones.map((opcion) => {
          const estaActiva = rutaActual === opcion.ruta;
          return (
            <li key={opcion.ruta}>
              <Link
                href={opcion.ruta}
                aria-current={estaActiva ? "page" : undefined}
                className={`flex min-h-12 items-center rounded-lg px-4 font-semibold ${
                  estaActiva
                    ? "bg-primario text-primario-texto"
                    : "text-texto hover:bg-fondo"
                }`}
              >
                {opcion.nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}