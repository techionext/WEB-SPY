"use client";

import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const OFFER_VIEW_DEFAULT_PAGE_SIZE = 3;
const DEFAULT_PAGE_SIZE = 6;

export type UseCreativeListOptions = {
  offerId?: string;
};

export const useCreativeList = (options?: UseCreativeListOptions) => {
  const searchParams = useSearchParams();
  const offerIdProp = options?.offerId;
  const isOfferContext = Boolean(offerIdProp);

  const queryParams = useMemo(() => {
    const pageSizeDefault = isOfferContext ? OFFER_VIEW_DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE;
    const pageKey = isOfferContext ? "creativesPage" : "page";
    const pageSizeKey = isOfferContext ? "creativesPageSize" : "pageSize";

    const params: Record<string, unknown> = {
      page: Number(searchParams.get(pageKey)) || 1,
      pageSize: Number(searchParams.get(pageSizeKey)) || pageSizeDefault,
      filter: searchParams.get("filter") || undefined,
      offerId: offerIdProp || searchParams.get("offerId") || undefined,
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

    return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
  }, [searchParams, offerIdProp, isOfferContext]);

  const { data, isLoading, isError } = useGetLabsCreativeQuery(queryParams);

  return {
    data,
    isLoading,
    isError,
    queryParams,
  };
};
