"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface UseFilterBaseOptions {
  activeCountKeys?: string[];
}

export const useFilterBase = (options: UseFilterBaseOptions = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(key)?.split(",") || [];

    if (currentValues.includes(value)) {
      const newValues = currentValues.filter((v) => v !== value);
      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.set(key, [...currentValues, value].join(","));
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updateParams = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const isValueValid =
        value === true || typeof value === "number" || (typeof value === "string" && value !== "");

      if (isValueValid) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updateParam = (key: string, value: any) => {
    updateParams({ [key]: value });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const isSelected = (key: string, value: string) => {
    return searchParams.get(key)?.split(",")?.includes(value) ?? false;
  };

  const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const activeFiltersCount = options.activeCountKeys
    ? options.activeCountKeys.filter((key) => {
        const value = searchParams.get(key);
        if (!value) return false;
        if (value === "false") return false;
        return true;
      }).length
    : 0;

  return {
    router,
    pathname,
    searchParams,
    toggleFilter,
    updateParam,
    updateParams,
    clearFilters,
    isSelected,
    capitalize,
    activeFiltersCount,
  };
};
