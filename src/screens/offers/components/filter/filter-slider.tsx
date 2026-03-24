"use client";
import { Slider } from "@heroui/react";

interface FilterSliderProps {
  label: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

export const FilterSlider = ({ label, value, onChange, min = 0, max = 100 }: FilterSliderProps) => {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-default-400 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold text-foreground">
          {value[0]} — {value[1]}
        </span>
      </div>
      <Slider
        step={1}
        minValue={min}
        maxValue={max}
        value={value}
        onChange={(val) => onChange(val as [number, number])}
        size="sm"
        classNames={{
          base: "max-w-md",
          filler: "bg-primary",
          thumb: "bg-primary after:bg-white after:w-2 after:h-2 after:shadow-none",
        }}
      />
    </div>
  );
};
