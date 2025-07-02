export const metadata = {
  title: 'Café Nepré',
  description: 'Painel interno de envios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
