import { Pagination } from "@/components/pagination";
import { useSpyOffers } from "./use-spy-offers";
import { OffersCard, OffersCardLoading } from "./offers-card";

export const OffersTab = () => {
  const { data, isLoading, defaultPageSize } = useSpyOffers();

  return (
    <div className="flex flex-col gap-4">
      {/* <SpyFilters data={groupedData} showFavoriteFilter /> */}
      <div className="grid grid-cols-5 gap-4 h-fit">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => <OffersCardLoading key={index} />)
          : data?.data.map((item) => <OffersCard key={item.id} data={item} />)}
      </div>
      {data?.meta?.totalPages && data?.meta?.totalPages > 0 && (
        <Pagination
          total={data?.meta?.totalPages ?? 0}
          defaultPageSize={defaultPageSize.toString()}
        />
      )}
    </div>
  );
};
