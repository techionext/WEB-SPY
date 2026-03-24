
import { useGetSpyOfferByIdQuery } from "@/services/spy/spy-offers.service";
import { TrafficNetwork, trafficNetworkLabelsPt } from "@/types/offer/offer.type";
import { Avatar, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";

const isTrafficNetwork = (v: string): v is TrafficNetwork =>
  Object.values(TrafficNetwork).includes(v as TrafficNetwork);

function labelTrafficNetworkPt(value: string | undefined) {
  if (!value) return "";
  if (isTrafficNetwork(value)) return trafficNetworkLabelsPt[value];
  return value;
}

/** Valores tipo `DROPSHIPPING` ou `INFO_PRODUTO` → texto legível. */
function labelEnumLikePt(value: string | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!/^[A-Z0-9]+(?:_[A-Z0-9]+)*$/.test(trimmed)) return value;

  return trimmed
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export const CardOffer = () => {
  const { id } = useParams();
  const data = useGetSpyOfferByIdQuery({ id: id as string }, { skip: !id });

  return (
    <Card className="card flex h-full min-h-0 flex-col p-4">
      <CardHeader className="flex shrink-0 items-center gap-3">
        <Avatar
          alt="Imagem da oferta"
          classNames={{
            base: "shrink-0",
            img: "object-cover",
          }}
          radius="lg"
          size="lg"
          src={data.data?.image.url}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-lg font-bold truncate">{data.data?.title}</h1>
          <p className="text-sm text-gray-500 line-clamp-2">{data.data?.description}</p>
        </div>
      </CardHeader>
      <CardBody className="flex flex-1 flex-col gap-4">
        <div className="flex gap-2">
          <Chip size="sm" variant="flat" color="primary">
            {data.data?.category.title}
          </Chip>
          <Chip size="sm" variant="flat" color="primary">
            {labelEnumLikePt(data.data?.typeProduct)}
          </Chip>

          <Chip size="sm" variant="flat" color="primary">
            {labelTrafficNetworkPt(data.data?.trafficNetwork)}
          </Chip>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <Icon icon="solar:heart-linear" width={14} height={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">
              {data.data?.isFavorite ? "Favorito" : "Não favorito"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="solar:calendar-linear" width={14} height={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">
              {dayjs(data.data?.createdAt).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="solar:eye-linear" width={14} height={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">{data.data?.viewsQuantity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="solar:advertisement-bold"
              width={14}
              height={12}
              className="text-gray-500"
            />
            <span className="text-xs text-gray-500">{labelEnumLikePt(data.data?.structure)}</span>
          </div>
        </div>
        <div className="mt-auto grid w-full grid-cols-5 gap-2">
          <div className="flex min-w-0 flex-col items-center gap-1 bg-content2 py-2 px-2 rounded-lg border-1 border-divider">
            <span className="text-xs font-bold">{data.data?.adQuantity}</span>
            <p className="text-center text-[10px] text-gray-500 uppercase">Anuncios:</p>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1 bg-content2 py-2 px-2 rounded-lg border-1 border-divider">
            <span className="text-xs font-bold">{data.data?.viewsQuantity}</span>
            <p className="text-center text-[10px] text-gray-500 uppercase">Visualizações:</p>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1 bg-content2 py-2 px-2 rounded-lg border-1 border-divider">
            <span className="text-xs font-bold">{data.data?.totalCreative}</span>
            <p className="text-center text-[10px] text-gray-500 uppercase">Criativos:</p>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1 bg-content2 py-2 px-2 rounded-lg border-1 border-divider">
            <span className="text-xs font-bold">{data.data?.totalVsl}</span>
            <p className="text-center text-[10px] text-gray-500 uppercase">VSLs:</p>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1 bg-content2 py-2 px-2 rounded-lg border-1 border-divider">
            <span className="text-xs font-bold">{data.data?.totalPage}</span>
            <p className="text-center text-[10px] text-gray-500 uppercase">Páginas:</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
