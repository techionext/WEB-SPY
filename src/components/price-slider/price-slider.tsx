"use client";

import type { SliderProps } from "@heroui/react";
import type { RangeFilter, RangeValue } from "@/components/price-slider/filters-types";

import React from "react";
import { Divider, Input, Slider } from "@heroui/react";
import { cn } from "@heroui/react";
import { formatCurrency } from "@/utils/formatCurrency";
import { currencyParseInt } from "@agenus/utils";

export type PriceSliderAnimation = "opacity" | "height";

export type PriceSliderProps = Omit<SliderProps, "ref"> & {
  range?: RangeFilter;
  animation?: PriceSliderAnimation;
  currency?: string;
};

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function scaleValue(value: number, fromRange: RangeValue, toRange: RangeValue = [0, 100]) {
  const [fromMin, fromMax] = fromRange;
  const [toMin, toMax] = toRange;

  // Scaling factor to map the value from one range to another
  const scale = (toMax - toMin) / (fromMax - fromMin);

  // Applying the scaling factor to the value and adjusting by the minimum of the target range
  return (value - fromMin) * scale + toMin;
}

export type PriceSliderPipProps = {
  isInRange: boolean;
  animation?: PriceSliderAnimation;
};

const PriceSliderPip: React.FC<PriceSliderPipProps> = ({ animation = "height", isInRange }) => {
  const rand = React.useMemo(() => Math.floor(Math.random() * 100), []);

  const height = clampValue(rand, 30, 100) + "%";

  const pip = React.useMemo(() => {
    if (animation === "height") {
      return (
        <span
          className="relative h-12 w-1 rounded-full bg-default-100 after:absolute after:bottom-0 after:h-0 after:w-full after:rounded-full after:bg-primary after:transition-all after:!duration-500 after:content-[''] data-[in-range=true]:after:h-full"
          data-in-range={isInRange}
          style={{
            height,
          }}
        />
      );
    }

    return (
      <span
        className="h-12 w-1 rounded-full bg-primary transition-all !duration-500"
        style={{
          background: isInRange
            ? "hsl(var(--heroui-primary-500))"
            : "hsl(var(--heroui-default-100))",
          height,
        }}
      />
    );
  }, [isInRange, height, animation]);

  return pip;
};

const PriceSlider = React.forwardRef<HTMLDivElement, PriceSliderProps>(
  (
    {
      range,
      animation,
      className,
      value: propsValue,
      onChange: propsOnChange,
      currency = "BRL",
      ...props
    },
    ref,
  ) => {
    const defaultValue = React.useMemo<RangeValue>(
      () => range?.defaultValue || [0, 1000],
      [range?.defaultValue],
    );

    const [internalValue, setInternalValue] = React.useState<RangeValue>(defaultValue);

    const value = (propsValue as RangeValue) ?? internalValue;

    const handleValueChange = React.useCallback(
      (newValue: RangeValue) => {
        if (propsValue === undefined) {
          setInternalValue(newValue);
        }
        if (propsOnChange) {
          propsOnChange(newValue);
        }
      },
      [propsValue, propsOnChange],
    );

    const rangePips = React.useMemo(() => {
      const rangeMin = range?.min ?? defaultValue[0];
      const rangeMax = range?.max ?? defaultValue[1];

      return Array.from({ length: 32 }).map((_, index) => {
        const pipValue = scaleValue(index, [0, 31], [rangeMin, rangeMax]);

        const isInRange = pipValue >= value[0] && pipValue <= value[1];

        return <PriceSliderPip key={index} animation={animation} isInRange={isInRange} />;
      });
    }, [animation, value, range?.min, range?.max, defaultValue]);

    const onMinInputValueChange = React.useCallback(
      (inputValue: string) => {
        const newValue = Number(currencyParseInt(inputValue) ?? 0);
        const minValue = range?.min ?? defaultValue[0];

        if (!isNaN(newValue)) {
          const clampedValue = clampValue(newValue, minValue, value[1]);

          handleValueChange([clampedValue, value[1]]);
        }
      },
      [value, range?.min, defaultValue, handleValueChange],
    );

    const onMaxInputValueChange = React.useCallback(
      (inputValue: string) => {
        const newValue = Number(currencyParseInt(inputValue) ?? 0);
        const maxValue = range?.max ?? defaultValue[1];

        if (!isNaN(newValue) && newValue <= maxValue) {
          handleValueChange([value[0], newValue]);
        }
      },
      [value, range?.max, defaultValue, handleValueChange],
    );

    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="flex flex-col gap-1">
          <div className="flex h-12 w-full items-end justify-between px-2">{rangePips}</div>
          <Slider
            {...props}
            ref={ref}
            formatOptions={{ style: "currency", currency }}
            maxValue={range?.max}
            minValue={range?.min}
            size="sm"
            step={range?.step}
            value={value}
            onChange={(val) => handleValueChange(val as RangeValue)}
          />
        </div>
        <div className="flex items-center">
          <Input
            aria-label="Min price"
            labelPlacement="outside"
            type="text"
            value={formatCurrency(value[0] || 0, false, currency)}
            onChange={(e) => onMinInputValueChange(e?.target?.value ?? "")}
          />
          <Divider className="mx-2 w-2" />
          <Input
            aria-label="Max price"
            labelPlacement="outside"
            type="text"
            value={formatCurrency(value[1] || 0, false, currency)}
            onChange={(e) => onMaxInputValueChange(e?.target?.value ?? "")}
          />
        </div>
      </div>
    );
  },
);

PriceSlider.displayName = "PriceSlider";

export default PriceSlider;
