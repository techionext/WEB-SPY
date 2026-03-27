import { SidebarFilter, FilterSection } from "@/components/filters/sidebar-filter";
import { useFilterCreative } from "./use-filter-creative";
import { FilterItem } from "@/components/filters/filter-item";
import { OfferSelector } from "@/components/offer-selector/offer-selector";
import { useGetAnalysisRequestGroupedQuery } from "@/services/analysis-request/analysis-request.service";

export const FilterSolicitations = () => {
  const {
    sections,
    groupedData,
    toggleFilter,
    clearFilters,
    isSelected,
    capitalize,
    activeFiltersCount,
  } = useFilterCreative();

  const { data: creativeData, isLoading: isLoadingCreatives } = useGetAnalysisRequestGroupedQuery(
    {},
  );
  const totalItems = creativeData?.status
    ? Object.values(creativeData.status).reduce((sum, v) => sum + Number(v || 0), 0)
    : 0;

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
      default:
        return null;
    }
  };

  return (
    <SidebarFilter
      totalItems={totalItems}
      totalItemsLabel="solicitações encontradas"
      isLoadingTotal={isLoadingCreatives}
      activeFiltersCount={activeFiltersCount}
      sections={sections as FilterSection[]}
      onClearFilters={clearFilters}
      renderSectionContent={renderSectionContent}
    />
  );
};
