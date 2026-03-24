"use client";
import { Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FilterItemProps {
  label: string;
  count?: number;
  isSelected?: boolean;
  onSelect: (selected: boolean) => void;
  value: string;
  icon?: string;
  image?: string;
}

export const FilterItem = ({
  label,
  count,
  isSelected,
  onSelect,
  value,
  icon,
  image,
}: FilterItemProps) => {
  return (
    <div
      className="flex items-center justify-between group cursor-pointer"
      onClick={() => onSelect(!isSelected)}
    >
      <Checkbox
        isSelected={isSelected}
        onValueChange={onSelect}
        value={value}
        size="sm"
        classNames={{
          label: "text-sm text-default-500 group-hover:text-foreground transition-colors",
        }}
      >
        <div className="flex items-center gap-2">
          {image ? (
            <img src={image} alt={label} className="w-4 h-4 rounded-full object-cover" />
          ) : (
            icon && <Icon icon={icon} width={16} />
          )}
          {label}
        </div>
      </Checkbox>
      {count !== undefined && (
        <span className="text-xs text-default-400 font-medium group-hover:text-default-600 transition-colors">
          {count}
        </span>
      )}
    </div>
  );
};
