"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
