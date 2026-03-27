"use client";

import { Accordion, AccordionItem, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { SearchBar } from "@/components/searchbar";
import { FilterItem } from "./filter-item";
import { FilterRangeSlider } from "./filter-range-slider";
import { formatViews } from "@/utils/formatViews";
import React, { ReactNode } from "react";

export type FilterSectionType = "list" | "status" | "quantity" | "custom";

export interface FilterSection {
  id: string;
  label: string;
  icon: string;
  type: FilterSectionType;
  dataKey?: string;
}

interface SidebarFilterProps {
  title?: string;
  totalItems?: number;
  totalItemsLabel?: string;
  isLoadingTotal?: boolean;
  activeFiltersCount: number;
  sections: FilterSection[];
  onClearFilters: () => void;
  renderSectionContent?: (section: FilterSection) => ReactNode;
  groupedData?: Record<string, any>;
  isSelected?: (key: string, value: string) => boolean;
  onToggleFilter?: (key: string, value: string) => void;
  quantityState?: any;
  onQuantityChange?: (key: string, value: [number, number]) => void;
  capitalize?: (str: string) => string;
}

export const SidebarFilter = ({
  title = "Filtros",
  totalItems,
  totalItemsLabel = "itens encontrados",
  isLoadingTotal,
  activeFiltersCount,
  sections,
  onClearFilters,
  renderSectionContent,
  groupedData,
  isSelected,
  onToggleFilter,
  quantityState,
  onQuantityChange,
  capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
}: SidebarFilterProps) => {
  const defaultRenderSection = (section: FilterSection) => {
    switch (section.type) {
      case "list": {
        const data = groupedData?.[section.dataKey || section.id] || {};
        return (
          <div className="flex flex-col gap-1">
            {Object.entries(data).map(([key, count]) => (
              <FilterItem
                key={key}
                label={capitalize(key)}
                value={key}
                count={count as number}
                isSelected={isSelected?.(section.id, key) ?? false}
                onSelect={() => onToggleFilter?.(section.id, key)}
              />
            ))}
          </div>
        );
      }
      case "status":
        return null;
      case "quantity":
        if (!quantityState || !onQuantityChange) return null;
        return (
          <div className="flex flex-col gap-1 px-1">
            <FilterRangeSlider
              label="Anúncios"
              value={quantityState.ads}
              minValue={0}
              maxValue={100000}
              formatValue={formatViews}
              onChange={(val) => onQuantityChange("ads", val)}
            />
            <FilterRangeSlider
              label="Visualizações"
              value={quantityState.views}
              minValue={0}
              maxValue={10000000}
              formatValue={formatViews}
              onChange={(val) => onQuantityChange("views", val)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 card p-4 rounded-2xl w-[330px] sticky top-1">
      <div className="flex flex-col gap-1 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="solar:filter-bold-duotone" className="text-primary" width={22} />
            <h2 className="text-lg font-bold">{title}</h2>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <Button
            variant="light"
            size="sm"
            onPress={onClearFilters}
            className="text-default-400 hover:text-danger font-bold text-xs h-7 min-w-0 px-2"
          >
            Limpar
          </Button>
        </div>
        {!isLoadingTotal && totalItems !== undefined && (
          <span className="text-[11px] text-default-400 font-medium">
            {totalItems} {totalItemsLabel}
          </span>
        )}
      </div>

      <SearchBar className="px-1" />

      <Accordion selectionMode="multiple" defaultExpandedKeys={["quantity"]}>
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            aria-label={section.label}
            title={
              <div className="flex items-center gap-2">
                <Icon icon={section.icon} className="text-default-400" width={18} />
                <span className="text-sm font-bold text-foreground">{section.label}</span>
              </div>
            }
          >
            {renderSectionContent ? renderSectionContent(section) : defaultRenderSection(section)}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
