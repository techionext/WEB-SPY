"use client";

import { Switch, cn } from "@heroui/react";

interface SwitchFormProps {
  label: string;
  description?: string;
  isSelected?: boolean;
  onValueChange?: (isSelected: boolean) => void;
  className?: string;
}

export const SwitchForm = ({
  label,
  description,
  isSelected,
  onValueChange,
  className,
}: SwitchFormProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-content1 rounded-xl border-1 transition-all cursor-pointer group",
        isSelected ? "border-primary bg-primary/5" : "border-divider hover:border-default-400",
        className,
      )}
      onClick={() => onValueChange?.(!isSelected)}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-foreground-500 font-medium">{description}</span>
        )}
      </div>
      <Switch
        isSelected={isSelected}
        onValueChange={onValueChange}
        classNames={{
          wrapper: "group-hover:bg-default-300",
        }}
      />
    </div>
  );
};
