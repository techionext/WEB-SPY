import { useEffect, useState } from "react";
import { Selection } from "@heroui/react";

export const usePersistedColumns = (
  key: string,
  defaultColumns: string[],
): [Selection, (value: Selection) => void] => {
  const storageKey = `visibleColumns:${key}`;

  const [visibleColumns, setVisibleColumns] = useState<Selection>(() => {
    if (typeof window === "undefined") return new Set(defaultColumns);
    const stored = localStorage.getItem(storageKey);

    return stored ? new Set(JSON.parse(stored)) : new Set(defaultColumns);
  });

  useEffect(() => {
    if (visibleColumns !== "all") {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(visibleColumns)));
    }
  }, [visibleColumns, storageKey]);

  return [visibleColumns, setVisibleColumns];
};
