import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

type OptionItem<T extends string> = {
  value: T;
  label: string;
};

type UseFilterOptionsProps<T extends string> = {
  options: OptionItem<T>[];
  queryKey: string;
  resetPaginationOnChange?: boolean;
  fallbackOption?: T;
};

export const useFilterOptions = <T extends string>({
  options,
  queryKey,
  resetPaginationOnChange = true,
  fallbackOption,
}: UseFilterOptionsProps<T>) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const currentValue = searchParams.get(queryKey) as T | null;

  const activeOption =
    options.find((option) => option.value === currentValue)?.value ??
    fallbackOption ??
    options[0].value;

  const onChangeOption = (newValue: T) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      [queryKey]: newValue,
    };

    if (resetPaginationOnChange) {
      params.page = "1";
      params.pageSize = params.pageSize ?? "10";
    }

    const url = createQueryString(
      Object.entries(params).map(([key, value]) => ({ key, value })),
      false,
    );

    push(url);
  };

  return {
    options,
    activeOption,
    onChangeOption,
  };
};
