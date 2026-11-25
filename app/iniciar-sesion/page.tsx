"use client";

import { useState } from "react";

type Errores = { correo?: string; contrasena?: string };

function validarFormulario(correo: string, contrasena: string): Errores {
  const errores: Errores = {};

  if (!correo.trim()) {
    errores.correo = "Escribe tu correo.";
  } else if (!/^\S+@\S+\.\S+$/.test(correo.trim())) {
    errores.correo = "El correo no es válido.";
  }

  if (!contrasena) {
    errores.contrasena = "Escribe tu contraseña.";
  }

  return errores;
}

export default function PaginaIniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState("");

  function manejarEnvio(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("");

    const erroresEncontrados = validarFormulario(correo, contrasena);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) return;

    setMensaje("Datos válidos. La conexión con el servidor se agrega en el siguiente paso.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <section className="w-full max-w-md rounded-xl border border-borde bg-superficie p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-primario">UniFact</h1>
        <p className="mt-1 text-texto-suave">Inicia sesión para continuar</p>

        <form onSubmit={manejarEnvio} noValidate className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="correo" className="font-semibold">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              autoComplete="username"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              aria-invalid={Boolean(errores.correo)}
              aria-describedby={errores.correo ? "error-correo" : undefined}
              className="min-h-12 rounded-lg border border-borde px-3"
            />
            {errores.correo && (
              <p id="error-correo" role="alert" className="text-sm text-peligro">
                {errores.correo}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="contrasena" className="font-semibold">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              aria-invalid={Boolean(errores.contrasena)}
              aria-describedby={errores.contrasena ? "error-contrasena" : undefined}
              className="min-h-12 rounded-lg border border-borde px-3"
            />
            {errores.contrasena && (
              <p id="error-contrasena" role="alert" className="text-sm text-peligro">
                {errores.contrasena}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="min-h-12 rounded-lg bg-primario font-semibold text-primario-texto"
          >
            Entrar
          </button>

          {mensaje && (
            <p role="status" className="text-sm text-exito">
              {mensaje}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}