import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";

export const CardVSLSkeleton = () => {
  return (
    <Card className="bg-content1 h-[300px]" shadow="none" radius="lg">
      <CardBody className="flex flex-col p-0">
        <div className="relative flex-shrink-0 w-full h-full rounded-lg bg-default-100 overflow-hidden">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      </CardBody>

      <CardFooter className="p-4 bg-content2 h-[80px]">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-3 w-full max-w-[280px] rounded-md" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
