import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Temporarily using system fonts due to Google Fonts connection issues
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
//   display: "swap",
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "CodeRush 2025",
  description: "CodeRush 2025 - Where Ideas Ignite, Code Unites! Register your team for the ultimate coding competition.",
  icons: {
    icon: [
      { url: '/Coderush.png', type: 'image/png' },
      { url: '/Coderush.png', sizes: '32x32', type: 'image/png' },
      { url: '/Coderush.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/Coderush.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/Coderush.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
