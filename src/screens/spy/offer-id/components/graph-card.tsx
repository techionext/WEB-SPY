"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardBody } from "@heroui/react";
import { useState, useMemo } from "react";
import { cn } from "@heroui/react";
import { useParams } from "next/navigation";
import { useGetSpyOfferByIdHistoryQuery } from "@/services/spy/spy-offers.service";

const RANGES = ["7D", "30D", "90D", "1A"] as const;
type RangeKey = (typeof RANGES)[number];

const RANGE_DAYS: Record<RangeKey, number> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1A": 365,
};

function formatDateForApi(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDateRange(range: RangeKey): { startDate: string; endDate: string } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - RANGE_DAYS[range]);
  start.setHours(0, 0, 0, 0);
  return {
    startDate: formatDateForApi(start),
    endDate: formatDateForApi(end),
  };
}

function formatAxisDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatTooltipDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type TooltipContent = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string | number;
};

function CustomTooltip({ active, payload, label }: TooltipContent) {
  if (!active || !payload?.length || label == null) return null;
  return (
    <div className="bg-default-100 border border-default-200/40 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-tiny text-foreground-400 mb-0.5">{formatTooltipDate(String(label))}</p>
      <p className="text-sm font-medium text-foreground">
        {payload[0].value} anúncio{Number(payload[0].value) !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export const GraphCard = () => {
  const [activeRange, setActiveRange] = useState<RangeKey>("7D");
  const { id } = useParams<{ id: string }>();

  const { startDate, endDate } = useMemo(() => getDateRange(activeRange), [activeRange]);

  const { data: historyData, isLoading: isLoadingHistory } = useGetSpyOfferByIdHistoryQuery(
    { id: id as string, startDate, endDate },
    { skip: !id },
  );

  const chartData = useMemo(() => {
    if (!historyData?.length) return [];
    return [...historyData]
      .map((item) => ({ date: item.date, value: item.quantity }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [historyData]);

  const isEmpty = !isLoadingHistory && chartData.length === 0;

  return (
    <Card className="card">
      <CardBody className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-tiny font-medium tracking-wider text-foreground-400 uppercase">
            Anúncios ao longo do tempo
          </h3>

          <div
            className="flex gap-1 bg-default-200/30 border border-default-200/50 p-1 rounded-xl"
            role="tablist"
            aria-label="Período do gráfico"
          >
            {RANGES.map((range) => (
              <button
                key={range}
                type="button"
                role="tab"
                aria-selected={activeRange === range}
                aria-label={`Últimos ${range === "1A" ? "1 ano" : range.replace("D", " dias")}`}
                onClick={() => setActiveRange(range)}
                className={cn(
                  "min-w-[2.5rem] cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                  activeRange === range
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground-500 hover:text-foreground hover:bg-default-200/50",
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[290px] relative">
          {isLoadingHistory ? (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-default-50/50"
              aria-busy="true"
              aria-label="Carregando gráfico"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : isEmpty ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-default-50/30 text-foreground-400"
              role="status"
            >
              <p className="text-sm font-medium">Nenhum dado no período</p>
              <p className="text-tiny mt-1">
                {formatAxisDate(startDate)} – {formatAxisDate(endDate)}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatAxisDate}
                />

                <YAxis
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />

                <Tooltip
                  content={(props) => <CustomTooltip {...(props as unknown as TooltipContent)} />}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  isAnimationActive={!isLoadingHistory}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
