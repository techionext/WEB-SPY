"use client";
import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import { PagesCard } from "./pages-cards";

export const ListPages = () => {
  const { data, isLoading } = useGetLabsPagesQuery({});

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[450px] w-full bg-content2/10 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {data?.data.map((page) => (
            <PagesCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  );
};
