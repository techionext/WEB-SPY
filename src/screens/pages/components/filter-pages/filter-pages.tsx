import { SidebarFilter, FilterSection } from "@/components/filters/sidebar-filter";
import { FilterItem } from "@/components/filters/filter-item";
import { FilterSwitch } from "@/components/filters/filter-switch";
import { FilterRangeSlider } from "@/components/filters/filter-range-slider";
import { formatViews } from "@/utils/formatViews";
import { useOfferList } from "@/screens/offers/use-offer-list";
import { FilterQuantity, FilterStatus, useFilterPages } from "./use-filter";
import { OfferSelector } from "@/components/offer-selector/offer-selector";

export const FilterPages = () => {
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
  } = useFilterPages();

  const { data: offerData, isLoading: isLoadingOffers } = useOfferList();

  const renderSectionContent = (section: FilterSection) => {
    switch (section.type) {
      case "custom":
        if (section.id === "offer") return <OfferSelector groupedData={groupedData?.offer} />;
        return null;

      case "list": {
        const data = groupedData?.[section.dataKey as keyof typeof groupedData] || {};
        return (
          <div className="flex flex-col gap-1">
            {Object.entries(data).map(([key, count]) => (
              <FilterItem
                key={key}
                label={capitalize(key)}
                value={key}
                count={count as number}
                isSelected={isSelected(section.id, key)}
                onSelect={() => toggleFilter(section.id, key)}
              />
            ))}
          </div>
        );
      }
      case "status":
        return (
          <div className="flex flex-col gap-1">
            <FilterSwitch
              label="Com URL"
              isSelected={status.isClimbing}
              onSelect={(val: boolean) => {
                setStatus((prev: FilterStatus) => ({ ...prev, isClimbing: val }));
                updateParam("isClimbing", val);
              }}
            />
            <FilterSwitch
              label="Com Arquivo"
              isSelected={status.isCloaker}
              onSelect={(val: boolean) => {
                setStatus((prev: FilterStatus) => ({ ...prev, isCloaker: val }));
                updateParam("isCloaker", val);
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
