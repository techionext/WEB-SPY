import { Button, Card, CardBody, Image } from "@heroui/react";

export const SpyCommunity = () => {
  return (
    <div className="relative ">
      <div className="flex flex-col   max-w-[368px]   w-full gap-4 sticky top-[60px] ">
        <Card className=" min-w-[368px] h-[148px] card" radius="lg">
          <CardBody className="flex flex-row items-center justify-center gap-4 p-0">
            <Image
              removeWrapper
              className="w-full h-full object-cover"
              src="/extesion.png"
              alt="Community"
            />
          </CardBody>
        </Card>
        <Card className=" min-w-[368px] h-full max-h-[580px] min-h-[580px] grow card" radius="lg">
          <CardBody className="flex flex-col items-center justify-center gap-6  p-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-foreground-600">32</p>
              <p className="text-sm text-foreground-500">Tokens</p>
            </div>
            <div className="flex flex-col  gap-2 grow w-full">
              <p className="text-sm text-foreground-500"> ultimo desbloqueio</p>
              <div className="flex flex-col gap-2 grow">
                <div className="flex items-center justify-between grow bg-default-200 rounded-lg p-2 flex-1 w-full h-full" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button isIconOnly />
                    <Button isIconOnly />
                  </div>
                  <Button>Ver mais</Button>
                </div>
              </div>
            </div>
            <Button fullWidth>Solicitar quebra</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
