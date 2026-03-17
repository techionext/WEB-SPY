import {
  useGetSpyOffersQuery,
  useGetSpyOfferGroupedQuery,
} from "@/services/spy/spy-offers.service";
import { useSearchParams } from "next/navigation";

export const useSpyOffers = () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 15;
  const search = useSearchParams();
  const searchParams = Object.fromEntries(search.entries());
  const { data, isLoading, isFetching } = useGetSpyOffersQuery({
    ...searchParams,
    page: Number(searchParams.page) || DEFAULT_PAGE,
    pageSize: Number(searchParams.pageSize) || DEFAULT_PAGE_SIZE,
  });
  const { data: groupedData } = useGetSpyOfferGroupedQuery({});

  return { data, groupedData, isLoading, isFetching, defaultPageSize: DEFAULT_PAGE_SIZE };
};
