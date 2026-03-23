import { Empty } from "@/components/empty/empty";
import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { useParams, useSearchParams } from "next/navigation";
import { CreativeLabsCards } from "./creative-labs-cards";
import { Pagination } from "@/components/pagination";
import { CreativeLabsCardsSkeleton } from "./creative-skeleton-cards";

export const ListCreatives = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetLabsCreativeQuery(
    {
      offerId: id as string,
      pageSize: Number(params.pageSize || "6"),
      ...params,
    },
    { skip: !id },
  );

  return (
    <div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="grid grid-cols-2 gap-4">
        {data?.data.length === 0 ? (
          <div className="col-span-5">
            <Empty description="Não existem criativos para esta oferta" isLoading={isLoading} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <CreativeLabsCardsSkeleton key={index} />)
        ) : (
          data?.data?.map((item) => (
            <div key={item.id}>
              <CreativeLabsCards data={item} />
            </div>
          ))
        )}
      </div>
      <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"9"} />
    </div>
  );
};
