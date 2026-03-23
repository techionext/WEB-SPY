import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";

export const CreativeLabsCardsSkeleton = () => {
  return (
    <Card className="bg-default-100" shadow="none" radius="lg">
      <CardBody className="flex flex-col p-0 bg-content1">
        <Skeleton className="w-full h-[216px] rounded-none" />
      </CardBody>

      <CardFooter>
        <div className="flex justify-between w-full items-start gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-3/5 rounded-md" />
            <Skeleton className="h-3 w-2/5 rounded-md" />
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
