import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

interface UseFilterByPaginationProps {
  defaultPageSize?: string;
}

export const useFilterByPagination = ({
  defaultPageSize = "10",
}: UseFilterByPaginationProps = {}) => {
  const { createQueryString } = useBuildQueryString();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || defaultPageSize;

  const onChangePage = (newPage: string) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      page: newPage,
    };

    const url = createQueryString(
      Object.entries(params).map(([key, value]) => ({ key, value })),
      false,
    );

    push(url);
  };

  const onChangePageSize = (newPageSize: string) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      pageSize: newPageSize,
      page: "1", // sempre volta para página 1 ao mudar tamanho
    };

    const url = createQueryString(
      Object.entries(params).map(([key, value]) => ({ key, value })),
      false,
    );

    push(url);
  };

  return {
    page,
    pageSize,
    onChangePage,
    onChangePageSize,
  };
};
