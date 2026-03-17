// app/components/ThemeSwitcher.tsx
"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        isIconOnly
        radius="full"
        size="sm"
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Icon icon={theme === "dark" ? "solar:moon-bold" : "solar:sun-bold"} />
      </Button>
    </div>
  );
}
