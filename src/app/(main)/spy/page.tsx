"use client";

import { ScreenSpy } from "@/screens/spy";
import { Suspense } from "react";

export default function SpyPage() {
  return (
    <Suspense>
      <ScreenSpy />
    </Suspense>
  );
}
