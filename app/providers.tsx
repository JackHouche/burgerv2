"use client";

import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3000}
        theme="light"
        className="toaster"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          },
        }}
      />
    </>
  );
}
