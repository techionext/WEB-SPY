import { ScreenRootSettings } from "@/screens/root/settings";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <Suspense>
      <ScreenRootSettings />
    </Suspense>
  );
}
