"use client";

import { ProfileSettingsModal } from "@/layout/main/components/profile-settings-modal";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ProfileSettingsModalContextValue = {
  openProfileSettings: () => void;
};

const ProfileSettingsModalContext = createContext<ProfileSettingsModalContextValue | null>(null);

export function ProfileSettingsModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openProfileSettings = useCallback(() => setIsOpen(true), []);

  const value = useMemo(
    () => ({
      openProfileSettings,
    }),
    [openProfileSettings],
  );

  return (
    <ProfileSettingsModalContext.Provider value={value}>
      {children}
      <ProfileSettingsModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </ProfileSettingsModalContext.Provider>
  );
}

export function useProfileSettingsModal() {
  const ctx = useContext(ProfileSettingsModalContext);
  if (!ctx) {
    throw new Error("useProfileSettingsModal deve ser usado dentro de ProfileSettingsModalProvider");
  }
  return ctx;
}
