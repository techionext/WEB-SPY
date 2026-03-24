"use client";

import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useCreativeList = () => {
  const searchParams = useSearchParams();

  const queryParams = useMemo(() => {
    const params: any = {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 6,
      filter: searchParams.get("filter") || undefined,
      offerId: searchParams.get("offerId") || undefined,
      isClimbing: searchParams.get("isClimbing") === "true" || undefined,
      trafficNetwork: searchParams.get("trafficNetwork")?.split(",") || undefined,
      language: searchParams.get("language")?.split(",") || undefined,
      salesAngle: searchParams.get("salesAngle")?.split(",") || undefined,
      categoryTitles: searchParams.get("category")?.split(",") || undefined,
      minAdQuantity: searchParams.get("minAdQuantity")
        ? Number(searchParams.get("minAdQuantity"))
        : undefined,
      maxAdQuantity: searchParams.get("maxAdQuantity")
        ? Number(searchParams.get("maxAdQuantity"))
        : undefined,
      minViewsQuantity: searchParams.get("minViewsQuantity")
        ? Number(searchParams.get("minViewsQuantity"))
        : undefined,
      maxViewsQuantity: searchParams.get("maxViewsQuantity")
        ? Number(searchParams.get("maxViewsQuantity"))
        : undefined,
    };

    // Remove undefined keys
    return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
  }, [searchParams]);

  const { data, isLoading, isError } = useGetLabsCreativeQuery(queryParams);

  return {
    data,
    isLoading,
    isError,
    queryParams,
  };
};
