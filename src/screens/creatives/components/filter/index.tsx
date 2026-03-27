import { SidebarFilter, FilterSection } from "@/components/filters/sidebar-filter";
import { useFilterCreative } from "./use-filter-creative";
import { FilterItem } from "@/components/filters/filter-item";
import { FilterRangeSlider } from "@/components/filters/filter-range-slider";
import { FilterSwitch } from "@/components/filters/filter-switch";
import { trafficNetworkValues, TrafficNetwork } from "@/types/offer/offer.type";
import { languages } from "@/components/select-language/countries";
import { formatViews } from "@/utils/formatViews";
import { useCreativeList } from "../../use-creative-list";
import { OfferSelector } from "@/components/offer-selector/offer-selector";

export const FilterCreative = () => {
  const {
    sections,
    groupedData,
    status,
    setStatus,
    quantity,
    setQuantity,
    toggleFilter,
    updateParam,
    updateParams,
    clearFilters,
    isSelected,
    capitalize,
    activeFiltersCount,
  } = useFilterCreative();

  const { data: creativeData, isLoading: isLoadingCreatives } = useCreativeList();

  const renderSectionContent = (section: FilterSection) => {
    switch (section.type) {
      case "custom":
        if (section.id === "offer") return <OfferSelector groupedData={groupedData?.offer} />;
        return null;

      case "list": {
        const data = groupedData?.[section.dataKey as keyof typeof groupedData] || {};
        return (
          <div className="flex flex-col gap-1">
            {Object.entries(data).map(([key, count]) => {
              if (section.id === "trafficNetwork") {
                const config = trafficNetworkValues[key as TrafficNetwork];
                return (
                  <FilterItem
                    key={key}
                    label={config?.label || key}
                    icon={config?.icon}
                    value={key}
                    count={count as number}
                    isSelected={isSelected(section.id, key)}
                    onSelect={() => toggleFilter(section.id, key)}
                  />
                );
              }

              if (section.id === "language") {
                const langConfig = languages.find(
                  (l) => l.value.toLowerCase() === key.toLowerCase(),
                );
                return (
                  <FilterItem
                    key={key}
                    label={key.toLowerCase()}
                    image={langConfig?.flag}
                    icon={!langConfig?.flag ? "solar:global-bold" : undefined}
                    value={key}
                    count={count as number}
                    isSelected={isSelected(section.id, key)}
                    onSelect={() => toggleFilter(section.id, key)}
                  />
                );
              }

              return (
                <FilterItem
                  key={key}
                  label={capitalize(key)}
                  count={count as number}
                  value={key}
                  isSelected={isSelected(section.id, key)}
                  onSelect={() => toggleFilter(section.id, key)}
                />
              );
            })}
          </div>
        );
      }

      case "status":
        return (
          <div className="flex flex-col gap-1">
            <FilterSwitch
              label="Escalando"
              isSelected={status.isClimbing}
              onSelect={(val) => {
                setStatus({ ...status, isClimbing: val });
                updateParam("isClimbing", val);
              }}
            />
          </div>
        );

      case "quantity":
        return (
          <div className="flex flex-col gap-2 px-1">
            <FilterRangeSlider
              label="Anúncios"
              value={quantity.ads}
              minValue={0}
              maxValue={100000}
              formatValue={formatViews}
              onChange={(val) => {
                setQuantity((prev) => ({ ...prev, ads: val }));
                updateParams({
                  minAdQuantity: val[0],
                  maxAdQuantity: val[1],
                });
              }}
            />
            <FilterRangeSlider
              label="Visualizações"
              value={quantity.views}
              minValue={0}
              maxValue={10000000}
              formatValue={formatViews}
              onChange={(val) => {
                setQuantity((prev) => ({ ...prev, views: val }));
                updateParams({
                  minViewsQuantity: val[0],
                  maxViewsQuantity: val[1],
                });
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarFilter
      totalItems={creativeData?.meta?.total}
      totalItemsLabel="criativos encontrados"
      isLoadingTotal={isLoadingCreatives}
      activeFiltersCount={activeFiltersCount}
      sections={sections as FilterSection[]}
      onClearFilters={clearFilters}
      renderSectionContent={renderSectionContent}
    />
  );
};
