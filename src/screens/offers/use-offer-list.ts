"use client";
import { useGetSpyOffersQuery } from "@/services/spy/spy-offers.service";
import { useSearchParams } from "next/navigation";

export const useOfferList = () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 9;
  const search = useSearchParams();
  const searchParams = Object.fromEntries(search.entries());

  const parseBoolean = (value: string | null | undefined): boolean | undefined => {
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  };

  const parseStringArray = (value: string | null | undefined): string[] | undefined => {
    if (!value) return undefined;
    return value.split(",").filter(Boolean);
  };

  const parseNumber = (value: string | null | undefined): number | undefined => {
    if (value === null || value === undefined || value === "") return undefined;
    return Number(value);
  };

  const { data, isLoading, isFetching } = useGetSpyOffersQuery({
    page: Number(searchParams.page) || DEFAULT_PAGE,
    pageSize: Number(searchParams.pageSize) || DEFAULT_PAGE_SIZE,
    filter: searchParams.filter,
    trafficNetwork: parseStringArray(searchParams.trafficNetwork),
    structure: parseStringArray(searchParams.structure),
    language: parseStringArray(searchParams.language),
    typeProduct: parseStringArray(searchParams.typeProduct),
    isClimbing: parseBoolean(searchParams.isClimbing),
    isCloaker: parseBoolean(searchParams.isCloaker),
    isFavorite: parseBoolean(searchParams.isFavorite),
    minAdQuantity: parseNumber(searchParams.minAdQuantity),
    maxAdQuantity: parseNumber(searchParams.maxAdQuantity),
    minViewsQuantity: parseNumber(searchParams.minViewsQuantity),
    maxViewsQuantity: parseNumber(searchParams.maxViewsQuantity),
    categories: parseStringArray(searchParams.categories),
  });

  return { data, isLoading, defaultPageSize: DEFAULT_PAGE_SIZE, isFetching };
};
