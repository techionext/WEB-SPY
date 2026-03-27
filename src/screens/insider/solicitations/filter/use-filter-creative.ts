"use client";

import { useState } from "react";
import { useFilterBase } from "@/hooks/use-filter-base";
import { useGetAnalysisRequestGroupedQuery } from "@/services/analysis-request/analysis-request.service";

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

  const { data: groupedData } = useGetAnalysisRequestGroupedQuery({});

  const sections: FilterSection[] = [
    {
      id: "offers",
      label: "Ofertas",
      icon: "solar:globus-linear",
      type: "list",
      dataKey: "offer",
    },
    {
      id: "status",
      label: "Status",
      icon: "solar:chart-square-linear",
      type: "list",
      dataKey: "status",
    },
    {
      id: "type",
      label: "Tipo",
      icon: "solar:target-bold",
      type: "list",
      dataKey: "type",
    },
    {
      id: "users",
      label: "Usuários",
      icon: "solar:users-group-rounded-bold",
      type: "list",
      dataKey: "user",
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
    searchParams.get("offers"),
    searchParams.get("status"),
    searchParams.get("type"),
    searchParams.get("users"),
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
