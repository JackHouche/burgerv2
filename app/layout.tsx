import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Block B - Click & Collect",
  description: "Commandez en ligne et récupérez vos plats préférés",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Block B - Click & Collect",
    description: "Commandez en ligne et récupérez vos plats préférés",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={cn(inter.className, "min-h-screen bg-white")}>
        <Providers>
          <main className="max-w-md mx-auto bg-white min-h-screen relative shadow-xl">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
