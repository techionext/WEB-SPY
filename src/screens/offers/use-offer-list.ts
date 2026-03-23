"use client";
import { useGetSpyOffersQuery } from "@/services/spy/spy-offers.service";
import { useSearchParams } from "next/navigation";

export const useOfferList = () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 9;
  const search = useSearchParams();
  const searchParams = Object.fromEntries(search.entries());

  const parseBoolean = (value: string | undefined): boolean | undefined => {
    if (value === undefined || value === "") return undefined;
    return value === "true";
  };

  const parseStringArray = (value: string | undefined): string[] | undefined => {
    if (value === undefined || value === "") return undefined;
    return value.split(",").filter(Boolean);
  };

  const { data, isLoading, isFetching } = useGetSpyOffersQuery({
    page: Number(searchParams.page) || DEFAULT_PAGE,
    pageSize: Number(searchParams.pageSize) || DEFAULT_PAGE_SIZE,
    filter: searchParams.filter || "",
    // isFavorite: parseBoolean(searchParams.isFavorite),
    // news: parseBoolean(searchParams.news),
    // isPopular: parseBoolean(searchParams.isPopular),
    // categories: parseStringArray(searchParams.categories),
    // highestCPA: parseBoolean(searchParams.highestCPA),
    // myPlan: parseBoolean(searchParams.myPlan),
    // affiliateStatus: parseStringArray(searchParams.affiliateStatus),
    // orderByType: searchParams.orderByType as
    //   | "createdAt"
    //   | "recommended"
    //   | "scaling"
    //   | "highest-affiliates"
    //   | "opportunities"
    //   | "best"
    //   | "highest-CPA"
    //   | undefined,
    // orderBy: searchParams.orderBy as "ASC" | "DESC" | undefined,
  });

  return { data, isLoading, defaultPageSize: DEFAULT_PAGE_SIZE, isFetching };
};
