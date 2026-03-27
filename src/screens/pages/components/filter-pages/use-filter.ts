"use client";

import { useState } from "react";
import { useFilterBase } from "@/hooks/use-filter-base";
import { useGetSpyOfferGroupedQuery } from "@/services/spy/spy-offers.service";

export type RangeValue = [number, number];

export interface FilterStatus {
  isClimbing: boolean;
  isCloaker: boolean;
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

export const useFilterPages = () => {
  const {
    searchParams,
    toggleFilter,
    updateParam,
    updateParams,
    clearFilters,
    isSelected,
    capitalize,
  } = useFilterBase();

  const { data: groupedData } = useGetSpyOfferGroupedQuery({});

  const sections: FilterSection[] = [
    {
      id: "offer",
      label: "Oferta",
      icon: "solar:folder-linear",
      type: "custom",
    },
    {
      id: "type",
      label: "Tipo",
      icon: "solar:globus-linear",
      type: "list",
      dataKey: "type",
    },
    {
      id: "status",
      label: "Status",
      icon: "solar:tag-linear",
      type: "list",
      dataKey: "status",
    },
    {
      id: "options",
      label: "Opções",
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
    isCloaker: searchParams.get("isCloaker") === "true",
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
    searchParams.get("isCloaker") === "true",
    (Number(searchParams.get("minAdQuantity")) || 0) > 0,
    (Number(searchParams.get("maxAdQuantity")) || 100000) < 100000,
    (Number(searchParams.get("minViewsQuantity")) || 0) > 0,
    (Number(searchParams.get("maxViewsQuantity")) || 10000000) < 10000000,
    searchParams.get("type"),
    searchParams.get("status"),
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
