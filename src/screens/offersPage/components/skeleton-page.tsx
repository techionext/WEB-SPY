import { Card, CardBody, CardFooter, Skeleton, Chip } from "@heroui/react";

export const PageCardSkeleton = () => {
  return (
    <Card className="bg-content1 h-[300px]" shadow="none" radius="lg">
      <CardBody className="flex flex-col p-0 h-full relative">
        <Skeleton className="w-full h-full rounded-none" />

        <div className="absolute top-3 left-3 z-50">
          <Skeleton className="rounded-md">
            <Chip size="sm" radius="md" variant="flat">
              xxxxxxxxxxx
            </Chip>
          </Skeleton>
        </div>

        <div className="absolute top-2 right-2 z-50 flex gap-2">
          <Skeleton className="rounded-full w-8 h-8" />
          <Skeleton className="rounded-full w-8 h-8" />
        </div>
      </CardBody>

      <CardFooter className="px-4 py-6 bg-content2 h-[70px]">
        <div className="flex justify-between items-center w-full gap-2">
          <Skeleton className="h-4 w-2/3 rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="rounded-full w-8 h-8" />
            <Skeleton className="rounded-full w-8 h-8" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
