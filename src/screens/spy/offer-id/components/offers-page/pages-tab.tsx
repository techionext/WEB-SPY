import { PageOfferCard, PageOfferCardLoading } from "./offer-page-card";
import { useSpyOfferPages } from "./use-spy-pages";
import { Pagination } from "@/components/pagination";

export const OfferPagesTab = () => {
  const { data, isLoading, defaultPageSize } = useSpyOfferPages();

  return (
    <div className="flex flex-col gap-4 grow">
      <div className="grid grid-cols-5 gap-4 h-fit">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => <PageOfferCardLoading key={index} />)
          : data?.data.map((item) => <PageOfferCard key={item.id} data={item} />)}
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
