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
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}