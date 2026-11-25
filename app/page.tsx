export default function PaginaInicio() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-primario">UniFact</h1>
      <p className="text-texto-suave">Facturación y control de almacén</p>
      <button className="min-h-12 rounded-lg bg-primario px-6 font-semibold text-primario-texto">
        Botón de prueba
      </button>
    </main>
  );
}