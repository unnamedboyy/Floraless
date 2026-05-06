import "./globals.css";

export const metadata = {
  title: "Floraless",
  description: "Wedding & Church Decoration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">

      <body>

        {children}

      </body>

    </html>
  );
}