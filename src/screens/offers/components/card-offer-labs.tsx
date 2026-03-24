"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Image,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";
import { ISpyOffer } from "@/types/spy/spy-offers.type";
import { trafficNetworkValues } from "@/types/offer/offer.type";
import dayjs from "@/utils/dayjs-config";

import { languages } from "@/components/select-language/countries";
import { formatViews } from "@/utils/formatViews";
type Props = {
  data: ISpyOffer;
  onFavorite: (id: string) => void;
  isFavoriting?: boolean;
  onRemove: (id: string) => void;
};

export const CardOfferLabs = ({ data, onFavorite, onRemove }: Props) => {
  const router = useRouter();
  const { user } = useSession();
  const canEdit = user?.platformRole === "ROOT" || user?.platformRole === "ADMIN";
  const trafficConfig = trafficNetworkValues[data.trafficNetwork];
  const country = languages.find((l) => l.value === data.language.toLowerCase());
 
  return (
    <Card
      isPressable
      as="div"
      onPress={() => router.push(`/offers/${data.id}`)}
      className="card hover:border-primary/50 border-1 border-transparent transition-all duration-300 hover:scale-[1.01] cursor-pointer"
      shadow="sm"
    >
      <CardHeader className="p-0 relative h-[200px] rounded-b-none overflow-hidden">
        <Image
          src={data?.image?.url ?? "https://placehold.co/600x400"}
          alt={data.title}
          radius="none"
          className="w-full h-full object-cover rounded-t-xl z-0"
          removeWrapper
        />

        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {trafficConfig && (
            <Chip
              size="sm"
              variant="flat"
              startContent={<Icon icon={trafficConfig.icon} width={14} className="ml-1.5" />}
              className={`${trafficConfig.bgColor} ${trafficConfig.color} ${trafficConfig.borderColor} border-1 h-7 backdrop-blur-md gap-1`}
            >
              <span className="font-bold text-[10px] tracking-wide">{trafficConfig.label}</span>
            </Chip>
          )}

          {data.isClimbing && (
            <Chip
              size="sm"
              variant="flat"
              className="bg-[#1c3a2f]/80 text-[#10b981] border-[#10b981]/30 border-1 h-7 backdrop-blur-md"
              startContent={<Icon icon="solar:graph-up-bold" className="ml-1.5" width={14} />}
            >
              <span className="font-bold text-[10px] tracking-wide">Escalando</span>
            </Chip>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-content2 hover:bg-content2/60 min-w-8 w-8 h-8 rounded-full backdrop-blur-md"
              >
                <Icon icon="solar:menu-dots-bold" className="rotate-90" width={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ações da oferta">
              <DropdownItem
                key="favorite"
                onPress={() => onFavorite(data.id)}
                startContent={
                  <Icon
                    icon={data.isFavorite ? "solar:heart-bold" : "solar:heart-linear"}
                    className={data.isFavorite ? "text-danger" : ""}
                  />
                }
              >
                {data.isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </DropdownItem>
              <DropdownItem
                key="edit"
                isDisabled={!canEdit}
                onPress={() => router.push(`/offers/${data.id}/edit`)}
                startContent={<Icon icon="solar:pen-bold" />}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                key="delete"
                isDisabled={!canEdit}
                color="danger"
                className="text-danger"
                onPress={() => onRemove(data.id)}
                startContent={<Icon icon="solar:trash-bin-trash-bold" />}
              >
                Excluir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          {data.isCloaker && (
            <Chip
              size="sm"
              variant="flat"
              className="bg-content1/80 text-white/90 border-white/10 border-1 h-6 backdrop-blur-md"
              startContent={<Icon icon="solar:shield-check-bold" className="ml-1" width={12} />}
            >
              <span className="font-bold text-[10px] tracking-wide">Cloaker</span>
            </Chip>
          )}
        </div>
      </CardHeader>

      <CardBody className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1 min-h-[48px]">
          <h3 className="text-lg font-bold text-foreground truncate">{data.title}</h3>
          <p className="text-xs text-default-400 line-clamp-2">{data.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-default-400">
            {country ? (
              <Image
                src={country.flag}
                alt={country.label}
                width={16}
                height={12}
                className="w-4 h-3 min-w-4 object-cover rounded-xs"
                removeWrapper
              />
            ) : (
              <Icon icon="solar:global-bold" width={14} />
            )}
            <span className="text-xs font-medium uppercase">{data.language}</span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:tag-bold" width={14} />
            <span className="text-xs font-medium truncate max-w-[100px]">
              {data?.category?.title || "Sem Categoria"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400 ml-auto">
            <Icon icon="solar:calendar-linear" width={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {dayjs(data.createdAt).format("DD [de] MMM. [de] YYYY")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider">
            <span className="text-xl font-bold text-foreground leading-none">
              {formatViews(data.adQuantity || 0)}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Anúncios
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider">
            <span className="text-xl font-bold text-foreground leading-none">
              {formatViews(data.viewsQuantity || 0)}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Views
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider">
            <span className="text-sm font-bold text-foreground leading-none font-mono">
              {data.pitch || "00:00:00"}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Pitch
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
