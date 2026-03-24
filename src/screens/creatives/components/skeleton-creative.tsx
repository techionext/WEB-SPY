"use client";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export const SkeletonCreative = () => {
  return (
    <Card className="card border-1 border-transparent" shadow="sm">
      <CardHeader className="p-0 relative h-[200px] rounded-b-none overflow-hidden">
        <Skeleton className="w-full h-full rounded-t-xl" />
      </CardHeader>

      <CardBody className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2 min-h-[48px]">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Skeleton className="h-4 w-16 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-16 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-lg ml-auto" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider gap-2">
            <Skeleton className="h-6 w-8 rounded-lg" />
            <Skeleton className="h-2 w-12 rounded-lg" />
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider gap-2">
            <Skeleton className="h-6 w-12 rounded-lg" />
            <Skeleton className="h-2 w-16 rounded-lg" />
          </div>
        </div>

        <Skeleton className="w-full h-11 rounded-xl" />
      </CardBody>
    </Card>
  );
};
