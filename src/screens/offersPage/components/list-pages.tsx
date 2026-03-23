import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import { useParams, useSearchParams } from "next/navigation";
import { PageCard } from "./page-cards";
import { PageCardSkeleton } from "./skeleton-page";
import { Pagination } from "@/components/pagination";
import { Empty } from "@/components/empty/empty";

export const ListPages = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetLabsPagesQuery(
    {
      offerId: id as string,
      pageSize: Number(params.pageSize) || 6,
      ...params,
    },
    { skip: !id },
  );

  return (
    <div className="flex flex-col gap-2 h-full justify-between w-full">
      <div className="grid grid-cols-2 gap-4">
        {data?.data.length === 0 ? (
          <div className="col-span-5">
            <Empty description="Não existem páginas para esta oferta" isLoading={isLoading} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <PageCardSkeleton key={index} />)
        ) : (
          data?.data.map((page) => (
            <div key={page.id}>
              <PageCard data={page} />
            </div>
          ))
        )}
      </div>
      <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"9"} />
    </div>
  );
};
