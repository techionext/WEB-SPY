import { usePostSpyOfferFavoriteMutation } from "@/services/spy/spy-offers.service";
import { ISpyOffer } from "@/types/spy/spy-offers.type";
import { CardBody, Card, Chip, Image, Skeleton } from "@heroui/react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export type OffersCardProps = {
  data: ISpyOffer;
};

export const OffersCardLoading = () => {
  return (
    <Card className="card" radius="lg">
      <CardBody className="flex flex-col gap-2 relative overflow-hidden">
        <div className="flex h-fit items-center  p-4 py-3 z-50 justify-between absolute inset-0 w-full">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="size-6 w-6 min-w-6 rounded-full" />
        </div>
        <Skeleton className="w-full h-54 object-cover" />
        <div className="flex items-center justify-between p-1 gap-3">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-24 mb-2 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="size-4 rounded-full" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const OffersCard = ({ data }: OffersCardProps) => {
  const [favorite, { isLoading }] = usePostSpyOfferFavoriteMutation();
  const value = data.trafficNetwork === "FACEBOOK" ? data.adQuantity : data.viewsQuantity;
  const router = useRouter();
  const label =
    data.trafficNetwork === "FACEBOOK"
      ? `${data.adQuantity} Quantidade de anúncios`
      : `${data.viewsQuantity} Quantidade de visualizações`;

  return (
    <Card
      as="div"
      isPressable
      onPress={() => {
        router.push(`/spy/offer/${data.id}`);
      }}
      shadow="sm"
      radius="lg"
      className="card transition-colors cursor-pointer"
    >
      <CardBody className="flex flex-col gap-2 relative overflow-hidden">
        <div className="flex h-fit items-center p-4 py-3 z-50 justify-between absolute inset-0 w-full">
          <Tooltip content={label}>
            <Chip color="default" className="dark text-tiny" size="sm">
              {value}
            </Chip>
          </Tooltip>
          <Tooltip content={data?.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <Button
              onPress={() => {
                favorite({ id: data.id }).unwrap();
              }}
              isLoading={isLoading}
              color="default"
              isIconOnly
              size="sm"
              radius="full"
              className="h-6 w-6 min-w-6"
            >
              <Icon
                icon="solar:heart-bold"
                className={data?.isFavorite ? "text-red-500" : "text-gray-200"}
              />
            </Button>
          </Tooltip>
        </div>
        <Image
          removeWrapper
          className="w-full h-54 object-cover"
          src={data?.image?.url ?? "https://placehold.co/54x54"}
          alt={data?.title ?? "Spy"}
        />
        <div className="flex items-center justify-between p-1 gap-3">
          <div className="min-w-0 flex-1">
            <Tooltip content={data?.title}>
              <p className="text-sm font-medium truncate">{data?.title}</p>
            </Tooltip>
            <Tooltip content={data?.category?.title}>
              <p className="text-xs text-gray-500 truncate max-w-[100px]">
                {data?.category?.title}
              </p>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Icon icon={`circle-flags:${data?.language?.toLowerCase()}`} />
            <Icon icon={`simple-icons:${data?.trafficNetwork?.toLowerCase()}`} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
