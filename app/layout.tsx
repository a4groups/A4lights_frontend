import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { ClientLayout } from "@/components/ClientLayout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "A4LIGHTS — Architectural LED Lighting Solutions",
  description:
    "Premium LED lighting products and professional installation support for residential, commercial and project applications.",
  keywords: [
    "architectural lighting",
    "LED lighting manufacturer",
    "downlights",
    "LED panels",
    "installation support",
    "commercial lighting",
    "residential lighting",
  ],
  openGraph: {
    title: "A4LIGHTS — Better Light. Brighter Spaces.",
    description:
      "Architectural LED lighting products and professional installation support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/a4lights-symbol.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-gold/20 selection:text-foreground">
        <AuthProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  borderRadius: "0",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                },
                success: {
                  iconTheme: { primary: "var(--gold)", secondary: "var(--background)" },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
