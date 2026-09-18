import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { RouteGuard } from "@/components/RouteGuard";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rozgar Saathi",
  description: "Academia-Industry Collaboration Portal — Find opportunities matched to your skills.",
  icons: {
    icon: "/Rozgar_Saathi.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <RouteGuard>
            <Navbar />
            <main className="flex-1 w-full mx-auto bg-white pt-20 md:pt-28">
              {children}
            </main>
          </RouteGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
