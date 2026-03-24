"use client";

import React, { useMemo, useState } from "react";
import { Card, Skeleton, Tab, Tabs } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGetSpyOfferByIdGraphQuery } from "@/services/spy/spy-offers.service";
import dayjs from "@/utils/dayjs-config";
import { useParams } from "next/navigation";

const GRAPH_RANGE_TABS = ["6-months", "3-months", "30-days", "7-days"] as const;
type GraphRangeTab = (typeof GRAPH_RANGE_TABS)[number];

function getGraphDateRange(tab: GraphRangeTab) {
  const end = dayjs().endOf("day");
  let start = end;

  switch (tab) {
    case "7-days":
      start = end.subtract(7, "day").startOf("day");
      break;
    case "30-days":
      start = end.subtract(30, "day").startOf("day");
      break;
    case "3-months":
      start = end.subtract(3, "month").startOf("day");
      break;
    case "6-months":
      start = end.subtract(6, "month").startOf("day");
      break;
    default:
      start = end.subtract(30, "day").startOf("day");
  }

  return {
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
  };
}

type ChartData = {
  month: string;
  date: string;
  value: number;
};

/** Ex.: "Sem 12/28" → mês/dia no ano corrente. */
const parseWeekLabelToDate = (input: string) => {
  const match = input.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  if (!month || !day) return null;

  const year = new Date().getFullYear();
  const parsedDate = new Date(year, month - 1, day);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatValue = (value: number, type: string | undefined) => {
  if (type === "number") {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }

    return value.toLocaleString("pt-BR");
  }
  if (type === "percentage") return `${value}%`;

  return String(value);
};

const formatMonth = (input: string) => {
  const parsed = parseWeekLabelToDate(input);
  const date = parsed ?? new Date(input);

  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  }

  return input;
};

const formatYTick = (v: number) => {
  if (v >= 1000) return `${Math.round(v / 1000)}k`;
  return String(Math.round(v));
};

export default function Graph() {
  const gradientId = React.useId().replace(/:/g, "");
  const { id } = useParams();
  const [rangeTab, setRangeTab] = useState<GraphRangeTab>("30-days");

  const { startDate, endDate } = useMemo(() => getGraphDateRange(rangeTab), [rangeTab]);

  const {
    data: graphEvents,
    isFetching,
    isLoading,
  } = useGetSpyOfferByIdGraphQuery(
    { id: id as string, type: "GRAPH", startDate, endDate },
    { skip: !id },
  );

  const chartData = React.useMemo<ChartData[]>(() => {
    return (graphEvents?.data ?? []).map((item) => {
      const parsed = parseWeekLabelToDate(item.date);

      return {
        month:
          parsed?.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          }) ??
          (item.date.replace(/^Sem\s+/i, "").trim() || item.date),
        date: item.date,
        value: Number(item.quantity ?? 0),
      };
    });
  }, [graphEvents]);

  const color = "primary";
  const type = "number";
  const showSkeleton = isLoading || (!graphEvents && !isFetching);

  return (
    <Card as="dl" className="w-full min-w-0 overflow-hidden card shadow-sm ">
      <section className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between px-5 pb-4 pt-5 ">
          <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-foreground">Histórico semanal</h3>
          <p className="text-sm text-gray-500">Evolução semanal da quantidade registrada</p>
          </div>
          <Tabs
            color="primary"
            radius="lg"
            selectedKey={rangeTab}
            size="sm"
            variant="solid"
            onSelectionChange={(key) => {
              const k = String(key) as GraphRangeTab;
              if (GRAPH_RANGE_TABS.includes(k)) setRangeTab(k);
            }}
          >
            <Tab key="6-months" title="6 meses" />
            <Tab key="3-months" title="3 meses" />
            <Tab key="30-days" title="30 dias" />
            <Tab key="7-days" title="7 dias" />
          </Tabs>
        </div>

        <div className="relative px-4 pb-5 pt-4">
          {showSkeleton ? (
            <Skeleton className="h-[268px] w-full rounded-lg" />
          ) : !id ? (
            <div className="flex h-[268px] items-center justify-center text-small text-default-500">
              —
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-[268px] items-center justify-center rounded-lg border border-dashed border-default-300 bg-content2/30 px-4 text-center text-small text-default-500">
              Nenhum dado no período selecionado.
            </div>
          ) : (
            <>
              {isFetching ? (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/40 backdrop-blur-[1px]" />
              ) : null}
              <div className="h-[200px] w-full min-w-0 [&_.recharts-surface]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      top: 18,
                      right: 8,
                      left: 4,
                      bottom: 4,
                    }}
                  >
                    <defs>
                      <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={`hsl(var(--heroui-${color}-400))`}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="55%"
                          stopColor={`hsl(var(--heroui-${color}-500))`}
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="100%"
                          stopColor={`hsl(var(--heroui-${color}-600))`}
                          stopOpacity={0.06}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="hsl(var(--heroui-default-200) / 0.65)"
                      strokeDasharray="4 6"
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey="month"
                      dy={16}
                      interval={2}
                      minTickGap={28}
                      padding={{ left: 12, right: 12 }}
                      tick={{ fill: "hsl(var(--heroui-default-500))", fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      domain={[0, (max: number) => (max > 0 ? Math.ceil(max * 1) : 1)]}
                      tick={{ fill: "hsl(var(--heroui-default-500))", fontSize: 11 }}
                      tickFormatter={formatYTick}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      content={({ payload }) => {
                        const row = payload?.[0]?.payload as ChartData | undefined;
                        if (!row) return null;

                        return (
                          <div className="rounded-medium border border-default-200/70 bg-content1/55 px-3 py-5 shadow-lg shadow-default-500/10 backdrop-blur-xl backdrop-saturate-100 dark:border-default-100/40 dark:bg-content1/35 dark:shadow-black/20">
                            <p className="text-tiny font-medium text-default-500 text-center">
                              {formatMonth(row.date)}
                            </p>
                            <p className="mt-1 text-small font-semibold text-foreground text-center">
                              {formatValue(row.value, type)}{" "}
                              <span className="font-normal text-default-500">anúncios</span>
                            </p>
                          </div>
                        );
                      }}
                      cursor={{ stroke: "hsl(var(--heroui-default-300))", strokeWidth: 1 }}
                    />
                    <Area
                      activeDot={{
                        stroke: `hsl(var(--heroui-${color}-400))`,
                        strokeWidth: 2,
                        fill: "hsl(var(--heroui-background))",
                        r: 5,
                      }}
                      animationDuration={600}
                      animationEasing="ease-out"
                      dataKey="value"
                      fill={`url(#${gradientId})`}
                      stroke={`hsl(var(--heroui-${color}-400))`}
                      strokeWidth={2.5}
                      type="monotone"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </section>
    </Card>
  );
}
