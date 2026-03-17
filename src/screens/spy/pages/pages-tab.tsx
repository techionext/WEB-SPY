import { useSpyPages } from "./use-spy-pages";
import { SpyFilters } from "../filters/spy-filters";
import { PageCard, PageCardLoading } from "./page-card";
import { Pagination } from "@/components/pagination";

export const PagesTab = () => {
  const { data, isLoading, groupedData, defaultPageSize } = useSpyPages();

  return (
    <div className="flex flex-col gap-4 grow">
      <SpyFilters data={groupedData} />
      <div className="grid grid-cols-5 gap-4 h-fit">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => <PageCardLoading key={index} />)
          : data?.data.map((item) => <PageCard key={item.id} data={item} />)}
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
