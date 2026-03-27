import { useGetSpyOfferGroupedQuery } from "@/services/spy/spy-offers.service";
import { useState } from "react";
import { useFilterBase } from "@/hooks/use-filter-base";

export type RangeValue = [number, number];

export interface FilterStatus {
  isClimbing: boolean;
  isCloaker: boolean;
  isFavorite: boolean;
}

export interface FilterQuantity {
  ads: RangeValue;
  views: RangeValue;
}

export interface FilterSection {
  id: string;
  label: string;
  icon: string;
  type: "list" | "status" | "quantity";
  dataKey?: string;
}

export const useFilter = () => {
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
      id: "trafficNetwork",
      label: "Rede de Tráfego",
      icon: "solar:globus-linear",
      type: "list",
      dataKey: "trafficNetwork",
    },
    {
      id: "typeProduct",
      label: "Tipo de Produto",
      icon: "solar:tag-linear",
      type: "list",
      dataKey: "typeProduct",
    },
    {
      id: "language",
      label: "Idioma",
      icon: "solar:translation-linear",
      type: "list",
      dataKey: "language",
    },
    {
      id: "structure",
      label: "Estrutura",
      icon: "solar:layers-linear",
      type: "list",
      dataKey: "structure",
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
    isCloaker: searchParams.get("isCloaker") === "true",
    isFavorite: searchParams.get("isFavorite") === "true",
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
    searchParams.get("isFavorite") === "true",
    (Number(searchParams.get("minAdQuantity")) || 0) > 0,
    (Number(searchParams.get("maxAdQuantity")) || 100000) < 100000,
    (Number(searchParams.get("minViewsQuantity")) || 0) > 0,
    (Number(searchParams.get("maxViewsQuantity")) || 10000000) < 10000000,
    searchParams.get("trafficNetwork"),
    searchParams.get("structure"),
    searchParams.get("language"),
    searchParams.get("typeProduct"),
    searchParams.get("categories"),
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
