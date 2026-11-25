import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFact",
  description: "Facturación y control de almacén para licorerías",
};

export default function DisposicionRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}