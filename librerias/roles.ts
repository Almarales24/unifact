export type Rol = "dueno" | "cajero" | "bodega" | "contador";

export type OpcionDeMenu = { nombre: string; ruta: string };

export const nombresDeRoles: Record<Rol, string> = {
  dueno: "Dueño",
  cajero: "Cajero",
  bodega: "Encargado de bodega",
  contador: "Contador",
};

const inicio = { nombre: "Inicio", ruta: "/inicio" };
const ventas = { nombre: "Ventas", ruta: "/ventas" };
const productos = { nombre: "Productos", ruta: "/productos" };
const inventario = { nombre: "Inventario", ruta: "/inventario" };
const compras = { nombre: "Compras", ruta: "/compras" };
const caja = { nombre: "Caja", ruta: "/caja" };
const facturas = { nombre: "Facturas", ruta: "/facturas" };
const clientes = { nombre: "Clientes", ruta: "/clientes" };
const reportes = { nombre: "Reportes", ruta: "/reportes" };

export const opcionesPorRol: Record<Rol, OpcionDeMenu[]> = {
  dueno: [inicio, ventas, productos, inventario, compras, caja, facturas, clientes, reportes],
  cajero: [inicio, ventas, caja, facturas, clientes],
  bodega: [inicio, inventario, compras],
  contador: [inicio, facturas, reportes],
};

// Valor temporal: se reemplaza por el rol real cuando se conecte Supabase.
export const rolTemporal: Rol = "dueno";