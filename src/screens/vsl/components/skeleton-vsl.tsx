"use client";
import { Card, CardBody, Skeleton } from "@heroui/react";

export const SkeletonVsl = () => {
  return (
    <Card className="border-1 border-transparent h-full">
      <CardBody className="p-0 overflow-visible">
        <Skeleton className="h-48 rounded-t-xl" />

        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>

          <div className="w-full h-[1px] bg-divider/50 my-1" />

          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </CardBody>
    </Card>
  );
};
