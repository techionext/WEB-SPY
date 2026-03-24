"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider locale="pt-BR">
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
