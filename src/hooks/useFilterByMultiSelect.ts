import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

interface UseFilterByMultiSelectProps {
  queryKey: string;
}

export const useFilterByMultiSelect = ({ queryKey }: UseFilterByMultiSelectProps) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const selectedValues = searchParams.get(queryKey)?.split(",") || [];

  const onToggleValue = (value: string) => {
    const currentValues = new Set(selectedValues);

    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }

    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
    };

    const url = createQueryString(
      [
        // Mantém todos os outros params normalmente
        ...Object.entries(params).map(([key, value]) => ({
          key,
          value,
        })),
        // Insere todas as novas seleções do multi-select
        // ...Array.from(currentValues).map(value => ({
        //   key: queryKey,
        //   value,
        // })),
        {
          key: queryKey,
          value,
        },
      ],
      false,
    );

    const normalize = decodeURIComponent(url);

    push(normalize, { scroll: false });
  };

  return {
    selectedValues,
    onToggleValue,
  };
};
