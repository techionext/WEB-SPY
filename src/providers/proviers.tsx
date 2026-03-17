"use client";

import { ToastProvider } from "@heroui/react";
import StoreProvider from "./store-provider";
import { UIProvider } from "./ui-provider";
import SessionProvider from "./session-provider";
import { TusClientProvider } from "use-tus";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SessionProvider>
        <UIProvider>
          <TusClientProvider>
            <ToastProvider />
            {children}
          </TusClientProvider>
        </UIProvider>
      </SessionProvider>
    </StoreProvider>
  );
}
