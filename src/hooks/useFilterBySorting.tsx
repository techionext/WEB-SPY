import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

type SortOrder = "asc" | "desc";

type SortDescriptor = {
  column: React.Key;
  direction: "ascending" | "descending";
};

interface UseFilterBySortingProps {
  defaultOrderColumn: string;
  defaultOrderDirection?: SortOrder;
  resetPaginationOnChange?: boolean;
}

export const useFilterBySorting = ({
  defaultOrderColumn,
  defaultOrderDirection = "desc",
  resetPaginationOnChange = true,
}: UseFilterBySortingProps) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const orderColumn = searchParams.get("orderColumn") || defaultOrderColumn;
  const orderDirection = (searchParams.get("orderDirection") as SortOrder) || defaultOrderDirection;

  const mapDirection = (direction: "ascending" | "descending"): SortOrder => {
    return direction === "ascending" ? "asc" : "desc";
  };

  const onChangeSorting = (sortDescriptor: SortDescriptor) => {
    const newOrderColumn = String(sortDescriptor.column);
    const newOrderDirection = mapDirection(sortDescriptor.direction);

    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      orderColumn: newOrderColumn,
      orderDirection: newOrderDirection,
    };

    if (resetPaginationOnChange) {
      params.page = "1";
      params.pageSize = params.pageSize ?? "10";
    }

    const url = createQueryString(
      Object.entries(params).map(([key, value]) => ({ key, value })),
      false,
    );

    push(url, { scroll: false });
  };

  return {
    orderColumn,
    orderDirection,
    onChangeSorting,
  };
};
