import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { RouteGuard } from "@/components/RouteGuard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Berozgar Saathi",
  description: "Academia-Industry Collaboration Portal — Find opportunities matched to your skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col bg-slate-50`}
      >
        <RouteGuard>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </main>
        </RouteGuard>
      </body>
    </html>
  );
}
