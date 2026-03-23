import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { CardCreative } from "./card-creative";

export const ListCreatives = () => {
  const { data } = useGetLabsCreativeQuery({});
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {data?.data.map((i) => (
        <CardCreative key={i.id} creative={i} />
      ))}
    </div>
  );
};
