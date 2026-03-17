"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Controller } from "react-hook-form";

import { CalendarPicker } from "@/components/calendar/calendar";
import { ConnectForm } from "@/components/connect-form/connect-form";
import PopoverFilterWrapper from "@/components/popover-filter-wrapper.tsx/popover-filter-wrapper";

import { useFilterByDate } from "@/hooks/useFilterByDate";

export const FilterDate = () => {
  const { startDate, endDate, activeOption, onChangeDate, onChangeCustomDate } = useFilterByDate({
    resetPaginationOnChange: true,
  });

  const currentPeriod = activeOption || "today";

  return (
    <PopoverFilterWrapper
      buttonProps={{
        endContent: <Icon icon={"solar:alt-arrow-down-linear"} />,
        startContent: <Icon icon={"solar:calendar-date-linear"} width={20} />,
        size: "sm",
        className: "w-full sm:w-auto",
      }}
      classNameContent="w-[calc(100vw-2rem)] max-w-none lg:max-w-[634px]"
      hasValue={!!startDate && !!endDate}
      placement="bottom-start"
      title="Período"
      onChange={({ date }) => {
        if (date?.period && date?.period !== "custom") {
          onChangeDate(date?.period);
        } else {
          onChangeCustomDate(date?.startDate ?? "", date?.endDate ?? "");
        }
      }}
      defaultValues={{
        date: {
          startDate: startDate ?? "",
          endDate: endDate ?? "",
          period: currentPeriod,
        },
      }}
      initialValue={{
        date: {
          startDate: "",
          endDate: "",
          period: "",
        },
      }}
    >
      <ConnectForm>
        {({ control }) => (
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <CalendarPicker
                activeOption={field?.value?.period ?? undefined}
                endDate={field?.value?.endDate ?? undefined}
                startDate={field?.value?.startDate ?? undefined}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </ConnectForm>
    </PopoverFilterWrapper>
  );
};
