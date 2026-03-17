"use client";

import { useRouter, usePathname } from "next/navigation";

import { Tab, Tabs } from "@heroui/react";
import { useSession } from "@/providers/session-provider";

export const ToggleChangeViewRoot = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { user } = useSession();

  const selectedKey = pathname.startsWith("/root") ? "ROOT" : "USER";

  if (user?.platformRole === "USER") return null;
  return (
    <Tabs
      fullWidth
      radius="full"
      selectedKey={selectedKey}
      onSelectionChange={(v) => {
        if (v.toString() === "ROOT") {
          return push("/root/dashboard");
        } else {
          return push("/dashboard");
        }
      }}
    >
      <Tab key={"ROOT"} title="Administrador" />
      <Tab key={"USER"} title="Usuário" />
    </Tabs>
  );
};
