"use client";
import { Switch } from "@heroui/react";

interface FilterSwitchProps {
  label: string;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

export const FilterSwitch = ({ label, isSelected, onSelect }: FilterSwitchProps) => {
  return (
    <div
      className="flex items-center justify-between group cursor-pointer py-1"
      onClick={() => onSelect(!isSelected)}
    >
      <span className="text-sm text-default-500 group-hover:text-foreground transition-colors">
        {label}
      </span>
      <Switch
        isSelected={isSelected}
        onValueChange={onSelect}
        size="sm"
        classNames={{
          wrapper: "group-data-[selected=true]:bg-primary",
        }}
      />
    </div>
  );
};
