"use client";

import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: string;
}

export const MetricCard = ({ title, value, icon }: MetricCardProps) => {
  return (
    <Card className="card">
      <CardBody className="p-4 flex items-start flex-row gap-4">
        <Icon icon={icon} className="text-primary/80" width={24} height={24} />
        <div className="flex flex-col gap-0.5">
          <p className="text-xs uppercase tracking-wider text-foreground-500">{title}</p>
          <p className="text-xl font-semibold tracking-tight text-foreground-700">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
};
