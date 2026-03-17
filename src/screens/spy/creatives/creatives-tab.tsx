import { useSpyCreatives } from "./use-spy-creative";
import { Pagination } from "@/components/pagination";
import { CreativeCard, CreativeCardLoading } from "./creative-card";
import { SpyFilters } from "../filters/spy-filters";
export const CreativesTab = () => {
  const { data, isLoading, defaultPageSize, groupedData, isFetching } = useSpyCreatives();
  return (
    <div className="flex flex-col gap-4 grow">
      <SpyFilters data={groupedData} />
      <div className="grid grid-cols-5 gap-4 grow">
        {isLoading || isFetching
          ? Array.from({ length: 10 }).map((_, index) => <CreativeCardLoading key={index} />)
          : data?.data.map((item) => <CreativeCard key={item.id} data={item} />)}
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
