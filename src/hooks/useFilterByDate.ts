import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

import { useBuildQueryString } from "@/hooks/useQueryString";

export type OptionsDay =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "custom";

export const optionsDayList = [
  { value: "today", label: "Hoje" },
  { value: "yesterday", label: "Ontem" },
  { value: "last7days", label: "Últimos 7 dias" },
  { value: "last30days", label: "Últimos 30 dias" },
  { value: "thisWeek", label: "Esta semana" },
  { value: "lastWeek", label: "Semana passada" },
  { value: "thisMonth", label: "Este mês" },
  { value: "lastMonth", label: "Mês passado" },
  { value: "thisYear", label: "Este ano" },
  { value: "lastYear", label: "Ano passado" },
  { value: "custom", label: "Personalizado" },
] as const;

type UseDashboardDateFilterProps = {
  resetPaginationOnChange?: boolean;
};

export const useFilterByDate = ({
  resetPaginationOnChange = true,
}: UseDashboardDateFilterProps) => {
  const { createQueryString } = useBuildQueryString();
  const { push } = useRouter();
  const searchParams = useSearchParams();

  // const today = dayjs().format("YYYY-MM-DD");

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const optionParam = searchParams.get("period") as OptionsDay | null;

  const isValidStart = dayjs(startDateParam, "YYYY-MM-DD", true).isValid();
  const isValidEnd = dayjs(endDateParam, "YYYY-MM-DD", true).isValid();

  const startDate = isValidStart ? startDateParam! : undefined;
  const endDate = isValidEnd ? endDateParam! : undefined;

  const activeOption: OptionsDay =
    optionParam && optionsDayList.find((o) => o.value === optionParam) ? optionParam : "custom";

  const optionsSelected = optionParam
    ? optionsDayList.filter((o) => o.value === optionParam)
    : {
        value: "custom",
        label: "Customizado",
      };

  const onChangeDate = (option: OptionsDay) => {
    const now = dayjs();
    let newStartDate: string | undefined = "";
    let newEndDate: string | undefined = "";

    switch (option) {
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
        newStartDate = startDate;
        newEndDate = endDate;
        break;
    }

    const params: Record<string, string | undefined> = {
      ...Object.fromEntries(searchParams.entries()),
      startDate: newStartDate,
      endDate: newEndDate,
      period: option,
    };

    if (resetPaginationOnChange) {
      params.page = "1";
      params.pageSize = params.pageSize ?? "10";
    }

    const url = createQueryString(
      [
        { key: "startDate", value: params.startDate },
        { key: "endDate", value: params.endDate },
        { key: "period", value: params.period },
        { key: "page", value: params.page },
        { key: "pageSize", value: params.pageSize },
      ],
      false,
    );

    push(url);
  };

  const onChangeCustomDate = (start: string, end: string) => {
    const params: Record<string, string> = {
      ...Object.fromEntries(searchParams.entries()),
      startDate: start,
      endDate: end,
      period: !start && !end ? "" : "custom",
    };

    if (resetPaginationOnChange) {
      params.page = "1";
      params.pageSize = params.pageSize ?? "10";
    }

    const url = createQueryString(
      [
        { key: "startDate", value: params.startDate },
        { key: "endDate", value: params.endDate },
        { key: "period", value: params.period },
        { key: "page", value: params.page },
        { key: "pageSize", value: params.pageSize },
      ],
      false,
    );

    push(url);
  };

  return {
    startDate,
    endDate,
    activeOption,
    onChangeDate,
    onChangeCustomDate,
    optionsSelected,
    optionParam,
  };
};
