import "./globals.css";
import { Toaster } from "react-hot-toast";

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

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{

              duration: 3000,

              style: {

                background: "#111827",
                color: "#fff",

                borderRadius: "18px",

                padding: "14px 18px",

                fontSize: "14px",

                boxShadow:
                  "0 10px 30px rgba(15,23,42,0.08)",
              },

              success: {

                iconTheme: {

                  primary: "#10B981",
                  secondary: "#fff",
                },
              },

              error: {

                iconTheme: {

                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />

        </body>

      </html>
  );
}