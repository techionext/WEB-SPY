import { useGetSpyOfferGroupedQuery } from "@/services/spy/spy-offers.service";
import { useGetSpyPagesQuery } from "@/services/spy/spy-pages.service";
import { useSearchParams } from "next/navigation";

export const useSpyPages = () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 15;
  const search = useSearchParams();
  const searchParams = Object.fromEntries(search.entries());
  const { data, isLoading } = useGetSpyPagesQuery({
    ...searchParams,
    page: searchParams.page || DEFAULT_PAGE,
    pageSize: searchParams.pageSize || DEFAULT_PAGE_SIZE,
  });
  const { data: groupedData } = useGetSpyOfferGroupedQuery({});
  return { data, isLoading, groupedData, defaultPageSize: DEFAULT_PAGE_SIZE };
};
