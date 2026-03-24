"use client";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export const SkeletonPages = () => {
  return (
    <Card className="h-full border-1 border-divider" shadow="sm">
      <CardHeader className="p-0 relative h-[200px] rounded-b-none overflow-hidden bg-content1">
        <Skeleton className="w-full h-full object-cover rounded-t-xl" />
      </CardHeader>

      <CardBody className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1 min-h-[48px]">
          <Skeleton className="w-3/4 h-6 rounded-lg" />
          <Skeleton className="w-full h-4 rounded-lg mt-1" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Skeleton className="w-20 h-4 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-full" />
          <Skeleton className="w-24 h-4 rounded-full ml-auto" />
        </div>

        <Skeleton className="w-1/2 h-3 rounded-lg" />

        <Skeleton className="w-full h-11 rounded-xl" />

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-content2 border-1 border-divider">
            <Skeleton className="w-8 h-6 rounded-lg" />
            <Skeleton className="w-12 h-2 rounded-lg mt-2" />
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-content2 border-1 border-divider">
            <Skeleton className="w-8 h-6 rounded-lg" />
            <Skeleton className="w-12 h-2 rounded-lg mt-2" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
