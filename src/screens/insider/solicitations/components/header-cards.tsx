"use client";

import { Card, CardBody } from "@heroui/react";

const cards = [
  {
    title: "Pendentes",
    value: 10,
    icon: "solar:list-bold",
    total: 10,
    color: "primary",
  },
  {
    title: "Em análise",
    value: 5,
    icon: "solar:list-bold",
    total: 10,
    color: "warning",
  },
  {
    title: "Recusado",
    value: 10,
    icon: "solar:list-bold",
    total: 10,
    color: "success",
  },
  {
    title: "Finalizado",
    value: 2,
    icon: "solar:list-bold",
    total: 10,
    color: "warning",
  },
];

type CircularRingProps = {
  value: number;
  progressPercent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

function CircularRing({
  value,
  progressPercent,
  size = 56,
  strokeWidth = 6,
  color = "primary",
}: CircularRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progressPercent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--heroui-default-300))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`hsl(var(--heroui-${color}-500))`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute text-lg font-bold text-${color}-500`}>{value}</span>
    </div>
  );
}

export const HeaderCards = () => {
  const total = cards.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="grid w-full min-w-0 grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="card h-fit min-w-0 shadow-none p-2">
          <CardBody className="flex items-start justify-between gap-4">
            <div className="flex items-center justify-between gap-4">
              <CircularRing
                value={card.value}
                progressPercent={total > 0 ? (card.value / total) * 100 : 0}
                color={card.color}
              />
              <div className="flex flex-col">
                <h3 className=" font-bold">{card.title}</h3>
                <p className="text-xs text-default-400">{card.value} de {card.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
