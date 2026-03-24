"use client";

import type { SliderProps } from "@heroui/react";
import React from "react";
import { Divider, Input, Slider, cn } from "@heroui/react";

export type RangeValue = [number, number];

export interface FilterRangeSliderProps extends Omit<SliderProps, "onChange" | "value"> {
  label: string;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  formatValue?: (val: number) => string;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function scaleValue(
  value: number,
  fromRange: [number, number],
  toRange: [number, number] = [0, 100],
) {
  const [fromMin, fromMax] = fromRange;
  const [toMin, toMax] = toRange;
  const scale = (toMax - toMin) / (fromMax - fromMin);
  return (value - fromMin) * scale + toMin;
}

const FilterRangeSliderPip: React.FC<{ isInRange: boolean }> = ({ isInRange }) => {
  const rand = React.useMemo(() => Math.floor(Math.random() * 100), []);
  const height = clampValue(rand, 30, 100) + "%";

  return (
    <span
      className="relative h-12 w-1 rounded-full bg-default-100 after:absolute after:bottom-0 after:h-0 after:w-full after:rounded-full after:bg-primary after:transition-all after:!duration-500 after:content-[''] data-[in-range=true]:after:h-full"
      data-in-range={isInRange}
      style={{ height }}
    />
  );
};

export const FilterRangeSlider = React.forwardRef<HTMLDivElement, FilterRangeSliderProps>(
  (
    {
      label,
      value,
      onChange,
      minValue = 0,
      maxValue = 100,
      formatValue = (v) => v.toString(),
      className,
      ...props
    },
    ref,
  ) => {
    const rangePips = React.useMemo(() => {
      return Array.from({ length: 32 }).map((_, index) => {
        const pipValue = scaleValue(index, [0, 31], [Number(minValue), Number(maxValue)]);
        const isInRange = pipValue >= value[0] && pipValue <= value[1];
        return <FilterRangeSliderPip key={index} isInRange={isInRange} />;
      });
    }, [value, minValue, maxValue]);

    const handleMinInputChange = (val: string) => {
      // Allow numbers and decimal separators, then convert to float
      const cleaned = val.replace(/[^\d.,]/g, "").replace(",", ".");
      const num = parseFloat(cleaned) || 0;
      // If it's a very small float like 1.5, and the range is large, 
      // maybe they meant 1.5M? No, let's keep it simple: input is the actual value.
      onChange([clampValue(num, Number(minValue), value[1]), value[1]]);
    };

    const handleMaxInputChange = (val: string) => {
      const cleaned = val.replace(/[^\d.,]/g, "").replace(",", ".");
      const num = parseFloat(cleaned) || 0;
      onChange([value[0], clampValue(num, value[0], Number(maxValue))]);
    };

    return (
      <div className={cn("flex flex-col gap-4 py-2", className)} ref={ref}>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-default-400 font-bold uppercase tracking-wider mb-2">
            {label}
          </span>
          <div className="flex h-12 w-full items-end justify-between px-1 mb-2">{rangePips}</div>
          <Slider
            {...props}
            size="sm"
            minValue={minValue}
            maxValue={maxValue}
            value={value}
            onChange={(val) => onChange(val as RangeValue)}
            classNames={{
              base: "max-w-full",
              filler: "bg-primary",
              thumb: "bg-primary after:bg-white after:w-2 after:h-2 after:shadow-none",
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            size="sm"
            variant="flat"
            labelPlacement="outside"
            value={formatValue(value[0])}
            onValueChange={handleMinInputChange}
            classNames={{
              inputWrapper: "bg-content2 h-8 min-h-8",
              input: "text-xs font-bold text-center",
            }}
          />
          <Divider className="w-2 bg-default-300" />
          <Input
            size="sm"
            variant="flat"
            labelPlacement="outside"
            value={formatValue(value[1])}
            onValueChange={handleMaxInputChange}
            classNames={{
              inputWrapper: "bg-content2 h-8 min-h-8",
              input: "text-xs font-bold text-center",
            }}
          />
        </div>
      </div>
    );
  },
);

FilterRangeSlider.displayName = "FilterRangeSlider";
