"use client";

import { useState } from "react";
import { useFilterBase } from "@/hooks/use-filter-base";
import { useGetSpyCreativeGroupedQuery } from "@/services/spy/spy-creative.service";

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
  const {
    searchParams,
    toggleFilter,
    updateParam,
    updateParams,
    clearFilters,
    isSelected,
    capitalize,
  } = useFilterBase();

  const { data: groupedData } = useGetSpyCreativeGroupedQuery({});

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
