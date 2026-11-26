import Link from "next/link";
import { MenuLateral } from "@/componentes/MenuLateral";
import { nombresDeRoles, opcionesPorRol, rolTemporal } from "@/librerias/roles";

export default function DisposicionDelPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const opciones = opcionesPorRol[rolTemporal];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-borde bg-superficie p-4 md:w-64 md:border-b-0 md:border-r">
        <p className="text-2xl font-bold text-primario">UniFact</p>
        <p className="mb-4 text-sm text-texto-suave">
          Rol: {nombresDeRoles[rolTemporal]}
        </p>
        <MenuLateral opciones={opciones} />
        <Link
          href="/iniciar-sesion"
          className="mt-4 flex min-h-12 items-center rounded-lg border border-borde px-4 font-semibold hover:bg-fondo"
        >
          Cerrar sesión
        </Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}