import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import { useParams, useSearchParams } from "next/navigation";

export const useSpyOfferPages = () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 5;
  const search = useSearchParams();
  const searchParams = Object.fromEntries(search.entries());
  const { id } = useParams();
  const { data, isLoading } = useGetLabsPagesQuery(
    {
      offerId: id as string,
      ...searchParams,
      page: Number(searchParams.page) || DEFAULT_PAGE,
      pageSize: Number(searchParams.pageSize) || DEFAULT_PAGE_SIZE,
    },
    { skip: !id },
  );
  return { data, isLoading, defaultPageSize: DEFAULT_PAGE_SIZE };
};
