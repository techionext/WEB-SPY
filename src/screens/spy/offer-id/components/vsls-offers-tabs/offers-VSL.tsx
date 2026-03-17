import { useParams, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { CardVSLSkeleton } from "./card-vsl-skeleton";
import { Empty } from "@/components/empty/empty";
import { useGetSpyVSLSQuery } from "@/services/spy/spy-offers.service";
import { CardOfferVSL } from "./card-offer-VSL";

export const OffersVSL = () => {
  const { id } = useParams<{ id: string }>();
  const DEFAULT_PAGE_SIZE = 2;
  const DEFAULT_PAGE = 1;
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetSpyVSLSQuery(
    {
      offerId: id as string,
      pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
      page: Number(searchParams.get("page")) || DEFAULT_PAGE,
    },
    { skip: !id },
  );

  return (
    <div className="w-full flex flex-col gap-2 h-full justify-between">
      <div className="grid grid-cols-1 gap-4">
        {data?.data.length === 0 ? (
          <div className="col-span-5">
            <Empty description="Não existem VSLs para esta oferta" isLoading={isLoading} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 2 }).map((_, index) => <CardVSLSkeleton key={index} />)
        ) : (
          data?.data.map((vsl) => <CardOfferVSL key={vsl.id} data={vsl} />)
        )}
      </div>
      {data?.meta?.totalPages && data?.meta?.totalPages > 0 && (
        <Pagination
          total={data?.meta?.totalPages ?? 0}
          defaultPageSize={DEFAULT_PAGE_SIZE.toString()}
        />
      )}
    </div>
  );
};
