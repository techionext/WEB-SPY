"use client";

import { ProfileSettingsModalProvider } from "@/providers/profile-settings-modal-provider";
import type { ReactNode } from "react";

export function LayoutWithProfileModal({ children }: { children: ReactNode }) {
  return <ProfileSettingsModalProvider>{children}</ProfileSettingsModalProvider>;
}
