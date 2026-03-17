"use client";

import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useFilterByMany } from "@/hooks/useFilterByMany";
import { useGetSpyOfferGroupedQuery } from "@/services/spy/spy-offers.service";

export const CategoryFilter = () => {
  const { data: groupedData } = useGetSpyOfferGroupedQuery({});
  const searchParams = useSearchParams();
  const { onChangeValues } = useFilterByMany();

  const selectedValues = searchParams.get("categoryTitles")?.split(",").filter(Boolean) || [];
  const hasFilters = selectedValues.length > 0;

  const handleSelectionChange = (keys: any) => {
    onChangeValues({
      categoryTitles: keys.size > 0 ? Array.from(keys).join(",") : "",
    });
  };

  return (
    <Select
      placeholder="Nichos"
      labelPlacement="outside"
      label={false}
      onSelectionChange={handleSelectionChange}
      selectionMode="multiple"
      isClearable
      classNames={{
        trigger: hasFilters ? "border-primary" : "",
      }}
    >
      {(groupedData?.categoryTitles || []).map((category) => (
        <SelectItem key={category.type} textValue={category.type}>
          {category.type} ({category.quantity})
        </SelectItem>
      ))}
    </Select>
  );
};
