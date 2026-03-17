"use client";

import React from "react";
import { Button, DateValue, RangeCalendar, ScrollShadow, TimeInput } from "@heroui/react";
import { parseDate, Time } from "@internationalized/date";
import dayjs from "dayjs";

import { optionsDayList, type OptionsDay } from "@/hooks/useFilterByDate";

type CalendarPickerProps = {
  startDate?: string;
  endDate?: string;
  activeOption?: OptionsDay;
  onChange: (data: { startDate: string; endDate: string; period?: OptionsDay }) => void;
};

export const CalendarPicker = ({
  startDate,
  endDate,
  activeOption,
  onChange,
}: CalendarPickerProps) => {
  const parseDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return { date: null, time: null };

    if (dateTimeStr.includes("T")) {
      const dateTime = dayjs(dateTimeStr);
      const date = dateTime.format("YYYY-MM-DD");
      const time = dateTime.format("HH:mm:ss");
      return { date, time };
    }

    return { date: dateTimeStr, time: null };
  };

  const startDateTime = parseDateTime(startDate);
  const endDateTime = parseDateTime(endDate);

  const parseTimeFromString = (timeStr: string | null): Time | null => {
    if (!timeStr) return null;
    try {
      const [hours, minutes, seconds] = timeStr.split(":").map(Number);
      return new Time(hours, minutes, seconds || 0);
    } catch {
      return null;
    }
  };

  const [startTime, setStartTime] = React.useState<Time>(
    parseTimeFromString(startDateTime.time) || new Time(0, 0, 0),
  );
  const [endTime, setEndTime] = React.useState<Time>(
    parseTimeFromString(endDateTime.time) || new Time(23, 59, 59),
  );

  React.useEffect(() => {
    const currentStartDateTime = parseDateTime(startDate);
    const currentEndDateTime = parseDateTime(endDate);
    const newStartTime = parseTimeFromString(currentStartDateTime.time);
    const newEndTime = parseTimeFromString(currentEndDateTime.time);

    if (newStartTime) setStartTime(newStartTime);
    if (newEndTime) setEndTime(newEndTime);
  }, [startDate, endDate]);

  const combineDateTime = (dateStr: string | null, time: Time | null): string => {
    if (!dateStr) return "";

    const timeToUse =
      time || (dateStr === startDateTime.date ? new Time(0, 0, 0) : new Time(23, 59, 59));

    const timeStr = `${String(timeToUse.hour).padStart(2, "0")}:${String(timeToUse.minute).padStart(2, "0")}:${String(timeToUse.second).padStart(2, "0")}`;

    const dateTime = dayjs(`${dateStr}T${timeStr}`);
    const offset = dateTime.format("Z");

    return `${dateTime.format("YYYY-MM-DDTHH:mm:ss")}.000${offset}`;
  };

  const handlePeriodChange = (value: OptionsDay) => {
    const now = dayjs();
    let newStartDate = now.format("YYYY-MM-DD");
    let newEndDate = now.format("YYYY-MM-DD");

    switch (value) {
      case "today":
        newStartDate = now.format("YYYY-MM-DD");
        newEndDate = now.format("YYYY-MM-DD");
        break;

      case "yesterday":
        newStartDate = now.subtract(1, "day").format("YYYY-MM-DD");
        newEndDate = newStartDate;
        break;

      case "last7days":
        newStartDate = now.subtract(7, "day").format("YYYY-MM-DD");
        newEndDate = now.format("YYYY-MM-DD");
        break;

      case "last30days":
        newStartDate = now.subtract(30, "day").format("YYYY-MM-DD");
        newEndDate = now.format("YYYY-MM-DD");
        break;

      case "thisWeek":
        newStartDate = now.startOf("week").add(1, "day").format("YYYY-MM-DD");
        newEndDate = now.format("YYYY-MM-DD");
        break;

      case "lastWeek":
        newStartDate = now.subtract(1, "week").startOf("week").add(1, "day").format("YYYY-MM-DD");
        newEndDate = now.subtract(1, "week").endOf("week").add(1, "day").format("YYYY-MM-DD");
        break;

      case "thisMonth":
        newStartDate = now.startOf("month").format("YYYY-MM-DD");
        newEndDate = now.format("YYYY-MM-DD");
        break;

      case "lastMonth":
        newStartDate = now.subtract(1, "month").startOf("month").format("YYYY-MM-DD");
        newEndDate = now.subtract(1, "month").endOf("month").format("YYYY-MM-DD");
        break;

      case "thisYear":
        newStartDate = now.startOf("year").format("YYYY-MM-DD");
        newEndDate = now.format("YYYY-MM-DD");
        break;

      case "lastYear":
        newStartDate = now.subtract(1, "year").startOf("year").format("YYYY-MM-DD");
        newEndDate = now.subtract(1, "year").endOf("year").format("YYYY-MM-DD");
        break;

      case "custom":
      default:
        newStartDate = startDateTime.date || now.format("YYYY-MM-DD");
        newEndDate = endDateTime.date || now.format("YYYY-MM-DD");
        break;
    }

    const defaultStartTime = new Time(0, 0, 0);
    const defaultEndTime = new Time(23, 59, 59);

    setStartTime(defaultStartTime);
    setEndTime(defaultEndTime);

    onChange({
      startDate: combineDateTime(newStartDate, defaultStartTime),
      endDate: combineDateTime(newEndDate, defaultEndTime),
      period: value,
    });
  };

  const handleCalendarChange = (range: { start: DateValue | null; end: DateValue | null }) => {
    if (range.start && range.end) {
      const newStartDate = dayjs(range.start.toString()).format("YYYY-MM-DD");
      const newEndDate = dayjs(range.end.toString()).format("YYYY-MM-DD");

      onChange({
        startDate: combineDateTime(newStartDate, startTime),
        endDate: combineDateTime(newEndDate, endTime),
        period: "custom",
      });
    }
  };

  const handleStartTimeChange = (time: Time | null) => {
    if (!time) return;
    setStartTime(time);
    if (startDateTime.date) {
      onChange({
        startDate: combineDateTime(startDateTime.date, time),
        endDate: endDate || combineDateTime(endDateTime.date || null, endTime),
        period: "custom",
      });
    }
  };

  const handleEndTimeChange = (time: Time | null) => {
    if (!time) return;
    setEndTime(time);
    if (endDateTime.date) {
      onChange({
        startDate: startDate || combineDateTime(startDateTime.date || null, startTime),
        endDate: combineDateTime(endDateTime.date, time),
        period: "custom",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <RangeCalendar
          calendarWidth="372px"
          className="shadow-none dark:bg-transparent"
          classNames={{
            headerWrapper: "bg-transparent px-3 pt-1.5 pb-3",
            title: "text-default-700 text-small font-semibold",
            gridHeader: "bg-transparent shadow-none",
            gridHeaderCell: "text-default-400 w-full p-0 text-xs font-medium",
            gridHeaderRow: "px-3 pb-3",
            gridBodyRow: "mb-1 gap-x-1 px-3 first:mt-4 last:mb-0",
            gridWrapper: "pb-3",
            cell: "w-full p-1.5",
            cellButton:
              "rounded-medium data-[selected]:shadow-primary-300 text-small h-9 w-full font-medium data-[selected]:shadow-[0_2px_12px_0]",
          }}
          value={
            startDateTime.date && endDateTime.date
              ? ({
                  start: parseDate(startDateTime.date),
                  end: parseDate(endDateTime.date),
                } as any)
              : null
          }
          weekdayStyle="short"
          onChange={handleCalendarChange}
        />

        <ScrollShadow className="h-[366px]">
          <div className="min-w-[198px] flex flex-col gap-1">
            {optionsDayList.map((item) => (
              <Button
                key={item.value}
                className="w-full text-xs font-semibold"
                color={activeOption === item.value ? "primary" : "default"}
                variant={activeOption === item.value ? "solid" : "flat"}
                onPress={() => handlePeriodChange(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </ScrollShadow>
      </div>

      <div className="flex gap-4 px-1">
        <div className="flex-1">
          <TimeInput
            label="Hora de início"
            size="sm"
            value={startTime}
            onChange={handleStartTimeChange}
            granularity="second"
            hourCycle={24}
            classNames={{
              base: "w-full",
              label: "text-default-600 text-small font-medium",
            }}
          />
        </div>
        <div className="flex-1">
          <TimeInput
            label="Hora de fim"
            size="sm"
            value={endTime}
            onChange={handleEndTimeChange}
            granularity="second"
            hourCycle={24}
            classNames={{
              base: "w-full",
              label: "text-default-600 text-small font-medium",
            }}
          />
        </div>
      </div>
    </div>
  );
};
