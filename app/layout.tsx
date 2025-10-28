import RegisterSW from './register-sw';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}