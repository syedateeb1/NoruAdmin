// import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

// import "flatpickr/dist/flatpickr.css";
// import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | Noru Admin Panel",
    default: "Noru Admin Panel",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
  icons: {
    // icon: "/logo.png", // 👈 your logo path from public/
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          {children}
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
