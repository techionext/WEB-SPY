"use client";

import { useGetSpyCreativeGroupedQuery } from "@/services/spy/spy-creative.service";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type RangeValue = [number, number];

export interface FilterStatus {
  isClimbing: boolean;
}

export interface FilterQuantity {
  ads: RangeValue;
  views: RangeValue;
}

export interface FilterSection {
  id: string;
  label: string;
  icon: string;
  type: "list" | "status" | "quantity" | "custom";
  dataKey?: string;
}

export const useFilterCreative = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: rawGroupedData } = useGetSpyCreativeGroupedQuery({});

  const groupedData = useMemo(() => {
    return rawGroupedData || null;
  }, [rawGroupedData]);

  const sections: FilterSection[] = [
    {
      id: "offer",
      label: "Oferta",
      icon: "solar:tag-linear",
      type: "custom",
    },
    {
      id: "trafficNetwork",
      label: "Rede de Tráfego",
      icon: "solar:globus-linear",
      type: "list",
      dataKey: "trafficNetwork",
    },
    {
      id: "salesAngle",
      label: "Ângulo de Venda",
      icon: "solar:target-bold",
      type: "list",
      dataKey: "salesAngle",
    },
    {
      id: "language",
      label: "Idioma",
      icon: "solar:translation-linear",
      type: "list",
      dataKey: "language",
    },
    {
      id: "category",
      label: "Categoria",
      icon: "solar:folder-linear",
      type: "list",
      dataKey: "category",
    },
    {
      id: "status",
      label: "Status",
      icon: "solar:chart-square-linear",
      type: "status",
    },
    {
      id: "quantity",
      label: "Quantidade",
      icon: "solar:sort-from-top-to-bottom-linear",
      type: "quantity",
    },
  ];

  const [status, setStatus] = useState<FilterStatus>({
    isClimbing: searchParams.get("isClimbing") === "true",
  });

  const [quantity, setQuantity] = useState<FilterQuantity>({
    ads: [
      Number(searchParams.get("minAdQuantity")) || 0,
      Number(searchParams.get("maxAdQuantity")) || 100000,
    ] as RangeValue,
    views: [
      Number(searchParams.get("minViewsQuantity")) || 0,
      Number(searchParams.get("maxViewsQuantity")) || 10000000,
    ] as RangeValue,
  });

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

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const isSelected = (key: string, value: string) => {
    return searchParams.get(key)?.split(",")?.includes(value) ?? false;
  };

  const activeFiltersCount = [
    searchParams.get("isClimbing") === "true",
    (Number(searchParams.get("minAdQuantity")) || 0) > 0,
    (Number(searchParams.get("maxAdQuantity")) || 100000) < 100000,
    (Number(searchParams.get("minViewsQuantity")) || 0) > 0,
    (Number(searchParams.get("maxViewsQuantity")) || 10000000) < 10000000,
    searchParams.get("trafficNetwork"),
    searchParams.get("salesAngle"),
    searchParams.get("language"),
    searchParams.get("category"),
    searchParams.get("offerId"),
    searchParams.get("filter"),
  ].filter(Boolean).length;

  return {
    sections,
    groupedData,
    status,
    setStatus,
    quantity,
    setQuantity,
    toggleFilter,
    updateParam,
    updateParams,
    clearFilters,
    isSelected,
    capitalize,
    activeFiltersCount,
  };
};
