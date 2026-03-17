import { SearchBar } from "@/components/searchbar";
import { useFilterByMany } from "@/hooks/useFilterByMany";
import { getFlagCode, getLanguageName } from "@/utils/languageUtils";
import { Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSearchParams } from "next/navigation";
import { FavoriteFilter } from "./favorite-filter";

type SpyFiltersProps = {
  data?: Record<string, Array<{ type: string; quantity: number; icon?: string; label?: string }>>;
  showFavoriteFilter?: boolean;
};

export const SpyFilters = ({ data, showFavoriteFilter }: SpyFiltersProps) => {
  const searchParams = useSearchParams();
  const { onChangeValues } = useFilterByMany();

  const asPlaceholder = {
    language: "Idioma",
    trafficNetwork: "Plataforma",
    typeProduct: "Tipo de Produto",
    categoryTitles: "Nichos",
    structure: "Estrutura",
  };

  const filterOptions = Object.entries(data || {}).map(([key, value]) => {
    const selectedValues = searchParams.get(key)?.split(",").filter(Boolean) || [];
    const hasFilters = selectedValues.length > 0;

    const handleSelectionChange = (keys: any) => {
      onChangeValues({
        [key]: keys.size > 0 ? Array.from(keys).join(",") : "",
      });
    };

    return {
      key,
      label: asPlaceholder[key as keyof typeof asPlaceholder],
      selectedValues,
      hasFilters,
      handleSelectionChange,
      options:
        key === "trafficNetwork"
          ? value.map((item) => {
              return {
                type: item.type,
                quantity: item.quantity,
                label: item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase(),
                icon: `simple-icons:${item.type.toLowerCase()}`,
              };
            })
          : key === "language"
            ? value.map((item) => {
                return {
                  type: item.type,
                  quantity: item.quantity,
                  label: getLanguageName(item.type),
                  icon: `circle-flags:${getFlagCode(item.type)}`,
                };
              })
            : value,
    };
  });

  return (
    <div className="w-full flex gap-2">
      <SearchBar />
      {showFavoriteFilter && <FavoriteFilter />}
      {filterOptions.map((filter) => (
        <Select
          key={filter.key}
          placeholder={filter.label}
          labelPlacement="outside"
          label={false}
          selectionMode="multiple"
          isClearable
          className="max-w-[200px]"
          selectedKeys={new Set(filter.selectedValues)}
          onSelectionChange={filter.handleSelectionChange}
          classNames={{
            trigger: filter.hasFilters ? "border-primary" : "",
          }}
        >
          {filter.options.map((option) => (
            <SelectItem
              startContent={
                "icon" in option ? (
                  <Icon icon={option.icon as string} className="text-lg" />
                ) : undefined
              }
              key={option.type}
              textValue={option.type}
            >
              {("label" in option ? option.label : option.type) || option.type} ({option.quantity})
            </SelectItem>
          ))}
        </Select>
      ))}
    </div>
  );
};
