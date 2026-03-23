import { useGetLabsVSLSQuery } from "@/services/labs/vsls/labs-vsls.service";
import { useParams, useSearchParams } from "next/navigation";
import { CardVSL } from "./card-VSL";
import { Pagination } from "@/components/pagination";
import { CardVSLSkeleton } from "./card-vsl-skeleton";
import { Empty } from "@/components/empty/empty";
import { useSession } from "@/providers/session-provider";

export const ListVSL = () => {
  const { user } = useSession();
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetLabsVSLSQuery({
    offerId: id as string,
    pageSize: Number(params.pageSize || "6"),
    ...params,
  });
  return (
    <div className="w-full flex flex-col gap-2 h-full justify-between">
      <div className="grid grid-cols-2 gap-4">
        {data?.data.length === 0 ? (
          <div className="col-span-5">
            <Empty description="Não existem VSLs para esta oferta" isLoading={isLoading} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <CardVSLSkeleton key={index} />)
        ) : (
          data?.data.map((vsl) => <CardVSL user={user} key={vsl.id} data={vsl} />)
        )}
      </div>
      <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"9"} />
    </div>
  );
};
