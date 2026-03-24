"use client";

import { Input, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useFilterCreative } from "./use-filter-creative";

export const OfferSelector = () => {
  const { toggleFilter, isSelected, groupedData } = useFilterCreative();
  const [search, setSearch] = useState("");

  const offers = Object.entries(groupedData?.offer || {})
    .filter(([title]) => title.toLowerCase().includes(search.toLowerCase()))
    .map(([title, count]) => ({ title, count }));

  return (
    <div className="flex flex-col gap-4">
      <Input
        size="sm"
        placeholder="Buscar oferta..."
        value={search}
        onValueChange={setSearch}
        startContent={<Icon icon="solar:magnifer-linear" className="text-default-400" />}
        classNames={{
          inputWrapper: "bg-content2",
        }}
      />

      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {offers.map((offer) => {
          const isItemChecked = isSelected("offerId", offer.title);
          return (
            <div
              key={offer.title}
              className="flex items-center justify-between group cursor-pointer"
              onClick={() => toggleFilter("offerId", offer.title)}
            >
              <Checkbox
                isSelected={isItemChecked}
                onValueChange={() => toggleFilter("offerId", offer.title)}
                size="sm"
                classNames={{
                  label: "text-sm text-default-500 group-hover:text-foreground transition-colors truncate max-w-[180px]",
                }}
              >
                {offer.title}
              </Checkbox>
              <span className="text-xs text-default-400 font-medium group-hover:text-default-600 transition-colors">
                {offer.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
