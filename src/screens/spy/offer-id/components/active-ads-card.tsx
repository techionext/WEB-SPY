"use client";

import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCompactNumber } from "@/utils/formatNumber";

interface ActiveAdsCardProps {
  total: number;
  description: string;
}

export const ActiveAdsCard = ({ total, description }: ActiveAdsCardProps) => {
  return (
    <Card className="card h-full">
      <CardBody className="p-6 flex flex-col justify-between">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Icon icon="solar:course-up-bold" className="text-primary text-2xl" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-4xl font-bold text-primary">{formatCompactNumber(total)}</h3>
          <p className="text-sm text-default-500">anúncios ativos</p>
        </div>

        <div className="pt-4 border-t border-default-200/40">
          <p className="text-sm text-default-500">{description}</p>
        </div>
      </CardBody>
    </Card>
  );
};
