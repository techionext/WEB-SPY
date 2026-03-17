import { languages } from "@/components/select-language/countries";
import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";

export const SelectLanguage = () => {
  return (
    <Autocomplete label="Idioma" placeholder="Selecione um idioma" defaultItems={languages}>
      {(language) => (
        <AutocompleteItem
          key={language.value}
          textValue={language.value}
          startContent={<Avatar alt={language.label} className="w-6 h-6" src={language.flag} />}
        >
          {language.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
