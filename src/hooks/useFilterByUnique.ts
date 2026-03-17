import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

interface UseFilterByUniqueProps {
  queryKey: string;
  resetPaginationOnChange?: boolean;
  customResets?: string[];
}

export const useFilterByUnique = ({
  queryKey,
  resetPaginationOnChange = true,
  customResets = [],
}: UseFilterByUniqueProps) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const value = searchParams.get(queryKey) ?? "";

  const onChangeValue = (newValue: string) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      [queryKey]: newValue,
    };

    if (resetPaginationOnChange) {
      params.page = "1";
      params.pageSize = "";
    }

    customResets.forEach((reset) => {
      params[reset] = "";
    });

    const url = createQueryString(
      Object.entries(params).map(([key, value]) => ({ key, value })),
      false,
    );

    push(url);
  };

  return {
    value,
    onChangeValue,
  };
};
