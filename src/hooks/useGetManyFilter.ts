import { useSearchParams } from "next/navigation";

export const useGetManyFilters = (keys: string[]) => {
  const searchParams = useSearchParams();

  return keys.reduce<Record<string, string | undefined>>((acc, key) => {
    acc[key] = searchParams.get(key) ?? undefined;

    return acc;
  }, {});
};
