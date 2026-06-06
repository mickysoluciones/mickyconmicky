import "./globals.css";

export const metadata = {
  title: "Para Micky",
  description: "Una historia que merece continuar",
};

export default function RootLayout({
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