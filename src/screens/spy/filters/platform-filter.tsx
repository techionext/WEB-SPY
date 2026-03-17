"use client";

import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useFilterByMany } from "@/hooks/useFilterByMany";
import { useGetSpyOfferGroupedQuery } from "@/services/spy/spy-offers.service";

export const PlatformFilter = () => {
  const { data: groupedData } = useGetSpyOfferGroupedQuery({});
  const searchParams = useSearchParams();
  const { onChangeValues } = useFilterByMany();

  const selectedValues = searchParams.get("trafficNetwork")?.split(",").filter(Boolean) || [];
  const hasFilters = selectedValues.length > 0;

  const handleSelectionChange = (keys: any) => {
    onChangeValues({
      trafficNetwork: keys.size > 0 ? Array.from(keys).join(",") : "",
    });
  };

  return (
    <Select
      placeholder="Plataforma"
      labelPlacement="outside"
      label={false}
      onSelectionChange={handleSelectionChange}
      selectionMode="multiple"
      isClearable
      classNames={{
        trigger: hasFilters ? "border-primary" : "",
      }}
    >
      {(groupedData?.trafficNetwork || []).map((trafficNetwork) => {
        const capitalized =
          trafficNetwork.type.charAt(0).toUpperCase() + trafficNetwork.type.slice(1).toLowerCase();
        return (
          <SelectItem key={trafficNetwork.type} textValue={trafficNetwork.type}>
            {capitalized} ({trafficNetwork.quantity})
          </SelectItem>
        );
      })}
    </Select>
  );
};
