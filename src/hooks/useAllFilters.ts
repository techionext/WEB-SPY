import { useSearchParams, useRouter } from "next/navigation";

type FilterItem = { key: string; value?: string; label?: string };

export const useAllFilters = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const filtersObj = Object.fromEntries(searchParams.entries());

  const excludedKeys = ["page", "pageSize", "tab"];

  const parsedFilters: FilterItem[] = [];

  Object.entries(filtersObj).forEach(([key, value]) => {
    if (excludedKeys.includes(key)) return;

    if (value.includes(",")) {
      const values = value.split(",");
      values.forEach((val) => {
        parsedFilters.push({ key, value: val.trim() });
      });
    } else {
      parsedFilters.push({ key, value });
    }
  });

  const removalGroups: Record<string, string[]> = {
    startDate: ["startDate", "endDate", "period"],
    endDate: ["startDate", "endDate", "period"],
    period: ["startDate", "endDate", "period"],
    orderColumn: ["orderColumn", "orderDirection"],
    orderDirection: ["orderColumn", "orderDirection"],
    minValue: ["minValue", "maxValue"],
    maxValue: ["minValue", "maxValue"],
  };

  const onRemoveFilter = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const keysToRemove = removalGroups[key] || [key];

    keysToRemove.forEach((keyToRemove) => {
      const currentValue = params.get(keyToRemove);

      if (!currentValue) return;

      if (currentValue.includes(",")) {
        const updatedValues = currentValue.split(",").filter((val) => val.trim() !== valueToRemove);

        updatedValues.length
          ? params.set(keyToRemove, updatedValues.join(","))
          : params.delete(keyToRemove);
      } else {
        params.delete(keyToRemove);
      }
    });

    push(`${window.location.pathname}?${params.toString()}`);
  };

  const onClearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    Array.from(params.keys()).forEach((key) => {
      if (!excludedKeys.includes(key)) params.delete(key);
    });

    push(`${window.location.pathname}?${params.toString()}`);
  };

  return {
    filters: parsedFilters,
    onRemoveFilter,
    onClearAllFilters,
  };
};
