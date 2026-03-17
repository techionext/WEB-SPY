"use client";

import { useSearchParams } from "next/navigation";
import { cn, Pagination as PaginationPrimitive, Select, SelectItem } from "@heroui/react";

import { useBuildQueryString } from "@/hooks/useQueryString";

interface PaginationProps {
  total?: number;
  hash?: string;
  hiddenPageShow?: boolean;
  className?: string;
  hashSize?: string;
  mode?: "card" | "normal";
  defaultPageSize?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  hash = "page",
  hiddenPageShow,
  hashSize = "pageSize",
  className,
  defaultPageSize = "10",
}) => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get(hash) ?? "1";
  const pageSize = searchParams.get(hashSize) ?? defaultPageSize;
  const { createQueryString } = useBuildQueryString();

  function onChangePage(value: number) {
    const url = createQueryString([{ key: hash ?? "search", value: value + "" }]);
    window.history.replaceState(null, "", url);
  }

  function onChangePageSize(value: string) {
    const url = createQueryString([{ key: hashSize, value }]);
    window.history.replaceState(null, "", url);
  }

  if (!total || (total === 1 && pageSize === defaultPageSize)) return null;

  return (
    <div className={cn(["flex w-full items-center justify-between gap-2", className])}>
      <PaginationPrimitive
        isCompact
        showControls
        boundaries={0}
        color="primary"
        initialPage={+currentPage}
        page={+currentPage}
        total={total ?? 1}
        onChange={onChangePage}
      />
      {!hiddenPageShow && (
        <Select
          className="w-fit"
          classNames={{
            base: "items-center",
            label: "w-fit min-w-24",
            trigger: "w-24",
          }}
          defaultSelectedKeys={[defaultPageSize]}
          items={Array.from({ length: 5 }).map((_, idx) => {
            return {
              label: (idx + 1) * +defaultPageSize,
              key: (idx + 1) * +defaultPageSize,
            };
          })}
          label="Itens por pagina"
          labelPlacement="outside-left"
          popoverProps={{
            shouldBlockScroll: false,
            shouldCloseOnScroll: false,
          }}
          selectedKeys={[pageSize ?? defaultPageSize]}
          onChange={(v) => onChangePageSize(v.target.value)}
        >
          {Array.from({ length: 5 }).map((_, idx) => {
            return (
              <SelectItem
                key={(idx + 1) * +defaultPageSize}
                textValue={`${(idx + 1) * +defaultPageSize}`}
              >
                {(idx + 1) * +defaultPageSize}
              </SelectItem>
            );
          })}
        </Select>
      )}
    </div>
  );
};
