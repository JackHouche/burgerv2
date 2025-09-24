import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Click & Collect Restaurant",
  description: "Commandez en ligne et récupérez vos plats préférés",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={cn(inter.className, "min-h-screen bg-gray-50")}>
        <Providers>
          <main className="max-w-md mx-auto bg-white min-h-screen relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
