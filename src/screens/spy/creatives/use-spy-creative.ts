import {
  useGetSpyCreativeGroupedQuery,
  useGetSpyCreativesQuery,
} from "@/services/spy/spy-creative.service";
import { useSearchParams } from "next/navigation";

export const useSpyCreatives = () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 15;
  const search = useSearchParams();
  const searchParams = Object.fromEntries(search.entries());
  const { data, isLoading, isFetching } = useGetSpyCreativesQuery({
    ...searchParams,
    page: Number(searchParams.page) || DEFAULT_PAGE,
    pageSize: Number(searchParams.pageSize) || DEFAULT_PAGE_SIZE,
  });
  const { data: groupedData } = useGetSpyCreativeGroupedQuery({});
  return { data, isLoading, isFetching, defaultPageSize: DEFAULT_PAGE_SIZE, groupedData };
};
