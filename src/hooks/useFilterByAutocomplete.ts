import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

interface UseFilterByAutocompleteProps {
  queryKey: string;
}

export const useFilterByAutocomplete = ({ queryKey }: UseFilterByAutocompleteProps) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const selectedValue = searchParams.get(queryKey) || "";

  const onChange = (value: string) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
    };

    const url = createQueryString(
      [
        ...Object.entries(params)
          .filter(([key]) => key !== queryKey)
          .map(([key, value]) => ({
            key,
            value,
          })),
        {
          key: queryKey,
          value: value || "",
        },
      ],
      false,
    );

    push(url, { scroll: false });
  };

  return {
    selectedValue,
    onChange,
  };
};
