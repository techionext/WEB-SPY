import { Pagination } from "@/components/pagination";
import { CreativeCardOffer, CreativeCardOfferLoading } from "./creative-card-offer";
import { useGetSpyCreativesQuery } from "@/services/spy/spy-creative.service";
import { useParams, useSearchParams } from "next/navigation";

export const CreativesTabOffer = () => {
  const DEFAULT_PAGE_SIZE = 5;
  const DEFAULT_PAGE = 1;
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { data, isLoading, isFetching } = useGetSpyCreativesQuery({
    offerId: id,
    pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
    page: Number(searchParams.get("page")) || DEFAULT_PAGE,
  });

  return (
    <div className="flex flex-col gap-4 grow">
      <div className="grid grid-cols-5 gap-4 grow">
        {isLoading || isFetching
          ? Array.from({ length: 5 }).map((_, index) => <CreativeCardOfferLoading key={index} />)
          : data?.data.map((item) => <CreativeCardOffer key={item.id} data={item} />)}
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
