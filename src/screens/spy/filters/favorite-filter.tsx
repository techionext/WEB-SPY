"use client";

import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useFilterByMany } from "@/hooks/useFilterByMany";

const FAVORITE_ALL = "all";
const FAVORITE_ONLY = "true";

export const FavoriteFilter = () => {
  const searchParams = useSearchParams();
  const { onChangeValues } = useFilterByMany();

  const isFavoriteParam = searchParams.get("isFavorite");
  const isFilteringFavorites = isFavoriteParam === "true";
  const selectedKey = isFilteringFavorites ? FAVORITE_ONLY : FAVORITE_ALL;

  const handleSelectionChange = (keys: unknown) => {
    const keySet =
      keys && typeof keys === "object" && "has" in keys ? (keys as Set<string>) : new Set<string>();
    const value = keySet.has(FAVORITE_ONLY) ? FAVORITE_ONLY : "";
    onChangeValues({ isFavorite: value });
  };

  return (
    <Select
      placeholder="Favoritos"
      labelPlacement="outside"
      label={false}
      selectedKeys={new Set([selectedKey])}
      onSelectionChange={handleSelectionChange}
      selectionMode="single"
      classNames={{
        trigger: isFilteringFavorites ? "border-primary" : "",
      }}
    >
      <SelectItem key={FAVORITE_ALL} textValue="Todos">
        Todos
      </SelectItem>
      <SelectItem key={FAVORITE_ONLY} textValue="Favoritos">
        Favoritos
      </SelectItem>
    </Select>
  );
};
