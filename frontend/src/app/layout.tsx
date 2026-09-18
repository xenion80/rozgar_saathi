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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
        <ThemeProvider>
          <RouteGuard>
            <Navbar />
            <main className="flex-1 w-full mx-auto pt-20 pb-10 md:pt-28 md:pb-10">
              {children}
            </main>
          </RouteGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
