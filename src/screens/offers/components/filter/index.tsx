import { SidebarFilter, FilterSection } from "@/components/filters/sidebar-filter";
import { FilterItem } from "@/components/filters/filter-item";
import { FilterSwitch } from "@/components/filters/filter-switch";
import { FilterRangeSlider } from "@/components/filters/filter-range-slider";
import { formatViews } from "@/utils/formatViews";
import { useFilter, type FilterStatus, type FilterQuantity } from "./use-filter";
import { type TrafficNetwork, trafficNetworkValues } from "@/types/offer/offer.type";
import { languages } from "@/components/select-language/countries";
import { useOfferList } from "../../use-offer-list";

export const Filter = () => {
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
  } = useFilter();

  const { data: offerData, isLoading: isLoadingOffers } = useOfferList();

  const renderSectionContent = (section: FilterSection) => {
    switch (section.type) {
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

              const paramKey = section.id === "category" ? "categories" : section.id;
              return (
                <FilterItem
                  key={key}
                  label={capitalize(key)}
                  value={key}
                  count={count as number}
                  isSelected={isSelected(paramKey, key)}
                  onSelect={() => toggleFilter(paramKey, key)}
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
              onSelect={(val: boolean) => {
                setStatus((prev: FilterStatus) => ({ ...prev, isClimbing: val }));
                updateParam("isClimbing", val);
              }}
            />
            <FilterSwitch
              label="Cloaker"
              isSelected={status.isCloaker}
              onSelect={(val: boolean) => {
                setStatus((prev: FilterStatus) => ({ ...prev, isCloaker: val }));
                updateParam("isCloaker", val);
              }}
            />
            <FilterSwitch
              label="Favoritos"
              isSelected={status.isFavorite}
              onSelect={(val: boolean) => {
                setStatus((prev: FilterStatus) => ({ ...prev, isFavorite: val }));
                updateParam("isFavorite", val);
              }}
            />
          </div>
        );
      case "quantity":
        return (
          <div className="flex flex-col gap-1 px-1">
            <FilterRangeSlider
              label="Anúncios"
              value={quantity.ads}
              minValue={0}
              maxValue={100000}
              formatValue={formatViews}
              onChange={(val: [number, number]) => {
                setQuantity((prev: FilterQuantity) => ({ ...prev, ads: val }));
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
              onChange={(val: [number, number]) => {
                setQuantity((prev: FilterQuantity) => ({ ...prev, views: val }));
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
      totalItems={offerData?.meta?.total}
      totalItemsLabel="ofertas encontradas"
      isLoadingTotal={isLoadingOffers}
      activeFiltersCount={activeFiltersCount}
      sections={sections as FilterSection[]}
      onClearFilters={clearFilters}
      renderSectionContent={renderSectionContent}
    />
  );
};
