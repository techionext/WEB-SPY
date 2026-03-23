"use client";
import { useState } from "react";
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
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { trafficNetworkValues } from "@/types/offer/offer.type";
import dayjs from "@/utils/dayjs-config";

import { VideoPlayer } from "@/components/videoplayer/video-player";

interface CardCreativeProps {
  creative: ILabsCreative;
}

export const CardCreative = ({ creative }: CardCreativeProps) => {
  const [playing, setPlaying] = useState(false);
  const trafficConfig = trafficNetworkValues[creative.trafficNetwork];

  return (
    <Card
      className="card hover:border-primary/50 border-1 border-transparent transition-all duration-300 hover:scale-[1.01] cursor-pointer"
      shadow="sm"
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
    >
      <CardHeader className="p-0 relative h-[200px] rounded-b-none overflow-hidden">
        {creative.image.mimeType.startsWith("video") ? (
          <div className="w-full h-full bg-content1 flex items-center justify-center overflow-hidden rounded-t-xl z-0">
            <VideoPlayer
              url={creative.image.url}
              type={creative.image.mimeType}
              className="w-full h-full aspect-auto rounded-none bg-transparent"
              videoClassName="object-cover"
              playing={playing}
              muted={true}
              controls={false}
            />
          </div>
        ) : (
          <Image
            src={creative.image.url}
            alt={creative.title}
            radius="none"
            className="w-full h-full object-cover rounded-t-xl z-0"
            removeWrapper
          />
        )}

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

          {creative.isClimbing && (
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

        <div className="absolute top-3 right-3 z-10">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-black/40 text-white hover:bg-black/60 min-w-8 w-8 h-8 rounded-full backdrop-blur-md"
              >
                <Icon icon="solar:menu-dots-bold" className="rotate-90" width={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="edit" startContent={<Icon icon="solar:pen-bold" />}>
                Editar
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                startContent={<Icon icon="solar:trash-bin-trash-bold" />}
              >
                Excluir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <Chip
            size="sm"
            variant="flat"
            className="bg-black/60 text-white border-white/20 border-1 h-6 text-[10px] uppercase font-bold backdrop-blur-sm"
          >
            {creative.image.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1 min-h-[48px]">
          <h3 className="text-lg font-bold text-foreground truncate">{creative.title}</h3>
          <p className="text-xs text-default-400 truncate">{creative.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:global-outline" width={14} />
            <span className="text-xs font-medium uppercase">{creative.language}</span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:target-outline" width={14} />
            <span className="text-xs font-medium whitespace-nowrap">{creative.salesAngle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:megaphone-outline" width={14} />
            <span className="text-xs font-medium whitespace-nowrap">
              {creative.creationType === "AUTOMATIC" ? "Automático" : "Manual"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400 ml-auto">
            <Icon icon="solar:calendar-outline" width={14} />
            <span className="text-xs font-medium whitespace-nowrap uppercase">
              {dayjs(creative.createdAt).format("DD [DE] MMM. [DE] YYYY")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider">
            <span className="text-xl font-bold text-foreground leading-none">
              {creative.adQuantity}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Anúncios
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1c1c1e] border-1 border-divider">
            <span className="text-xl font-bold text-foreground leading-none">
              {creative.viewsQuantity}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Visualizações
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <Button
          fullWidth
          variant="flat"
          className="bg-content2 text-default-500 font-semibold h-11 rounded-xl"
          startContent={<Icon icon="solar:history-bold" width={18} />}
        >
          Ver histórico
        </Button>
      </CardBody>
    </Card>
  );
};
