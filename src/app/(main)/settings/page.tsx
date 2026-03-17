import { ScreenSettings } from "@/screens/settings/screenSettings";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <Suspense>
      <ScreenSettings />
    </Suspense>
  );
}
