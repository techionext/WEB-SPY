import { Autocomplete, AutocompleteProps, cn } from "@heroui/react";

interface FieldAutoCompleteProps extends AutocompleteProps {
  label?: string;
  errorMessage?: string;
  labelClassName?: string;
}

export const FieldAutoComplete = ({
  label,
  errorMessage,
  labelClassName,
  ...props
}: FieldAutoCompleteProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && <p className={cn("text-default-500 text-sm", labelClassName)}>{label}</p>}
      <Autocomplete
        {...props}
        classNames={{
          selectorButton: "min-h-unit-10",
        }}
        listboxProps={{
          emptyContent: "Nenhum resultado encontrado para sua busca",
        }}
      />
      {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}
    </div>
  );
};
