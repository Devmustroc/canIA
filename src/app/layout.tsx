import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/providers/providers";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Modal } from "@/components/modal";
import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CanIA - AI Canvas Graphic Design Studio",
  description: "Canva-inspired graphic design platform with AI tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-violet-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:text-xs focus:font-bold focus:outline-none focus:ring-2 focus:ring-white"
          >
            Passer au contenu principal
          </a>
          <Providers>
            <Modal />
            <Toaster />
            <Suspense fallback={null}>
              <SubscriptionAlert />
            </Suspense>
            <div id="main-content" tabIndex={-1} className="outline-none min-h-screen">
              {children}
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
