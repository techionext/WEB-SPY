import { Card, CardBody, CardHeader, CardFooter, Skeleton } from "@heroui/react";

export const CardOfferLabsSkeleton = () => {
  return (
    <Card className="card">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-[220px] rounded-t-lg" />
      </CardHeader>

      <CardBody className="gap-3">
        <Skeleton className="w-3/4 h-4 rounded-md" />

        <div className="flex gap-2">
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-content2">
              <Skeleton className="w-4 h-4 rounded-full" />

              <div className="flex flex-col gap-1 w-full">
                <Skeleton className="w-16 h-3 rounded" />
                <Skeleton className="w-10 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardBody>

      <CardFooter>
        <Skeleton className="w-full h-8 rounded-full" />
      </CardFooter>
    </Card>
  );
};
