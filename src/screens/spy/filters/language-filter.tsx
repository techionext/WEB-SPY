"use client";

import { Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSearchParams } from "next/navigation";
import { useFilterByMany } from "@/hooks/useFilterByMany";
import { useGetSpyOfferGroupedQuery } from "@/services/spy/spy-offers.service";

const LANGUAGE_MAP: Record<string, string> = {
  EN: "English",
  PT_BR: "Português (Brasil)",
  ES: "Español",
  FR: "Français",
  DE: "Deutsch",
  IT: "Italiano",
  RU: "Русский",
  HR: "Croata",
  PT_PT: "Português (Portugal)",
  NL: "Nederlands",
  RO: "Romeno",
  CS: "Tcheco",
};

const FLAG_MAP: Record<string, string> = {
  EN: "us",
  PT_BR: "br",
  ES: "es",
  FR: "fr",
  DE: "de",
  IT: "it",
  RU: "ru",
  HR: "hr",
  PT_PT: "pt",
  NL: "nl",
  RO: "ro",
  CS: "cz",
};

const getLanguageName = (code: string): string => {
  return LANGUAGE_MAP[code.toUpperCase()] || code;
};

const getFlagCode = (code: string): string => {
  return FLAG_MAP[code.toUpperCase()] || code.toLowerCase();
};

export const LanguageFilter = () => {
  const { data: groupedData } = useGetSpyOfferGroupedQuery({});
  const searchParams = useSearchParams();
  const { onChangeValues } = useFilterByMany();

  const selectedValues = searchParams.get("language")?.split(",").filter(Boolean) || [];
  const hasFilters = selectedValues.length > 0;

  const handleSelectionChange = (keys: any) => {
    onChangeValues({
      language: keys.size > 0 ? Array.from(keys).join(",") : "",
    });
  };

  return (
    <Select
      placeholder="Idioma"
      labelPlacement="outside"
      label={false}
      onSelectionChange={handleSelectionChange}
      selectionMode="multiple"
      isClearable
      classNames={{
        trigger: hasFilters ? "border-primary" : "",
      }}
    >
      {(groupedData?.language || []).map((language) => {
        const displayName = getLanguageName(language.type);
        const flagCode = getFlagCode(language.type);
        return (
          <SelectItem
            key={language.type}
            textValue={language.type}
            startContent={<Icon icon={`circle-flags:${flagCode}`} className="text-lg" />}
          >
            {displayName} ({language.quantity})
          </SelectItem>
        );
      })}
    </Select>
  );
};
