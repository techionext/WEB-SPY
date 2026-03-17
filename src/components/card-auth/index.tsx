/* eslint-disable @next/next/no-img-element */
import { Card, CardBody } from "@heroui/react";

export const CardAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="flex flex-col gap-6">
      <CardBody className="p-0 overflow-hidden min-h-[488px] flex-row  grid  md:grid-cols-2">
        <div className="flex flex-col gap-6 p-6 md:p-8">{children}</div>
        <div className="relative hidden bg-muted md:block">
          <img
            src="/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardBody>
    </Card>
  );
};
