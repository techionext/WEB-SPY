import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

interface UseFilterByManyProps {
  resetPaginationOnChange?: boolean;
}

export const useFilterByMany = ({ resetPaginationOnChange = true }: UseFilterByManyProps = {}) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const onChangeValues = (updates: Record<string, string | undefined>) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
    };

    // Atualiza cada key
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        params[key] = value;
      } else {
        delete params[key]; // Se undefined, remove a chave
      }
    });

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
    onChangeValues,
  };
};
