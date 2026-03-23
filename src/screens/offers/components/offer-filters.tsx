"use client";

import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useFilterByMany } from "@/hooks/useFilterByMany";
import { useOfferList } from "../use-offer-list";
import { useGetCategoryQuery } from "@/services/category/category.service";
import { ILabsCategory } from "@/types/labs/category/labs-category.type";
import { ISpyOffer } from "@/types/spy/spy-offers.type";

type BooleanFilterType = "isFavorite" | "news" | "isPopular" | "highestCPA" | "myPlan";

const BOOLEAN_FILTER_CONFIG: Record<BooleanFilterType, { label: string; placeholder: string }> = {
  isFavorite: {
    label: "Favoritos",
    placeholder: "Favoritos",
  },
  news: {
    label: "Novidades",
    placeholder: "Novidades",
  },
  isPopular: {
    label: "Populares",
    placeholder: "Populares",
  },
  highestCPA: {
    label: "Maior CPA",
    placeholder: "Maior CPA",
  },
  myPlan: {
    label: "Meu Plano",
    placeholder: "Meu Plano",
  },
};

export const OfferFilters = () => {
  const searchParams = useSearchParams();
  const { onChangeValues } = useFilterByMany();
  const { data } = useOfferList();
  const { data: categoriesData } = useGetCategoryQuery({});

  const getSelectedFilter = (): string => {
    const hasAnyFilter = Object.keys(BOOLEAN_FILTER_CONFIG).some(
      (key) => searchParams.get(key) === "true",
    );

    if (!hasAnyFilter) {
      return "todos";
    }

    for (const key of Object.keys(BOOLEAN_FILTER_CONFIG)) {
      if (searchParams.get(key) === "true") {
        return key;
      }
    }

    return "todos";
  };

  const handleFilterChange = (keys: any) => {
    const selectedKey = Array.from(keys as Set<string>)[0] as string | undefined;

    const updates: Record<string, string> = {};

    Object.keys(BOOLEAN_FILTER_CONFIG).forEach((key) => {
      updates[key] = "";
    });

    if (selectedKey && selectedKey !== "todos") {
      updates[selectedKey] = "true";
    }

    onChangeValues(updates);
  };

  const hasAnyBooleanFilter = (): boolean => {
    return Object.keys(BOOLEAN_FILTER_CONFIG).some((key) => searchParams.get(key) === "true");
  };

  const availableCategories = categoriesData?.data
    ? categoriesData.data.map((cat: ILabsCategory) => cat.title).sort()
    : Array.from(new Set(data?.data?.map((item: ISpyOffer) => item.category.title) || [])).sort();

  const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const hasCategoryFilter = selectedCategories.length > 0;

  const filterItems = [
    { key: "todos", label: "Todos" },
    ...Object.entries(BOOLEAN_FILTER_CONFIG).map(([key, config]) => ({
      key,
      label: config.label,
    })),
  ];

  return (
    <div className="flex gap-2 flex-shrink-0">
      <Select
        labelPlacement="outside"
        label={false}
        selectionMode="single"
        isClearable={hasAnyBooleanFilter()}
        selectedKeys={new Set([getSelectedFilter()])}
        onSelectionChange={handleFilterChange}
        classNames={{
          trigger: hasAnyBooleanFilter() ? "border-primary" : "",
          value: "text-ellipsis min-w-0",
        }}
        items={filterItems}
        className="min-w-[160px] w-[160px]"
        popoverProps={{
          classNames: { content: "z-[100]" },
        }}
      >
        {(item) => (
          <SelectItem key={item.key} textValue={item.label}>
            {item.label}
          </SelectItem>
        )}
      </Select>

      {availableCategories.length > 0 && (
        <Select
          placeholder="Categorias"
          labelPlacement="outside"
          label={false}
          selectionMode="multiple"
          isClearable
          selectedKeys={new Set(selectedCategories)}
          onSelectionChange={(keys) => {
            const keySet =
              keys && typeof keys === "object" && "has" in keys
                ? (keys as Set<string>)
                : new Set<string>();
            onChangeValues({
              categories: keySet.size > 0 ? Array.from(keySet).join(",") : "",
            });
          }}
          classNames={{
            trigger: hasCategoryFilter ? "border-primary" : "",
            value: "text-ellipsis min-w-0",
          }}
          className="min-w-[160px] w-[160px]"
          popoverProps={{
            classNames: { content: "z-[100]" },
          }}
        >
          {availableCategories.map(
            (
              category: any, // TODO: change any to the correct type
            ) => (
              <SelectItem key={category} textValue={category}>
                {category}
              </SelectItem>
            ),
          )}
        </Select>
      )}
    </div>
  );
};
