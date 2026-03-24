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
  onEdit: (tab?: "edit" | "history") => void;
  onDelete: () => void;
  onView: () => void;
}

export const CardCreative = ({ creative, onEdit, onDelete, onView }: CardCreativeProps) => {
  const [playing, setPlaying] = useState(false);
  const trafficConfig = trafficNetworkValues[creative.trafficNetwork];

  return (
    <Card
      isPressable
      onPress={onView}
      className="card hover:border-primary/50 border-1 border-transparent transition-all duration-300 hover:scale-[1.01] cursor-pointer"
      shadow="sm"
      as="div"
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

          {creative?.creationType && (
            <Chip
              size="sm"
              variant="flat"
              className="bg-secondary/20 text-secondary border-secondary/30 border-1 h-7 backdrop-blur-md"
              startContent={<Icon icon="solar:settings-bold" className="ml-1.5" width={14} />}
            >
              <span className="font-bold text-[10px] tracking-wide">
                {creative.creationType === "AUTOMATIC" ? "Automático" : "Manual"}
              </span>
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
            <DropdownMenu aria-label="Ações do criativo">
              <DropdownItem
                key="view"
                onPress={onView}
                startContent={<Icon icon="solar:eye-bold" />}
              >
                Visualizar
              </DropdownItem>
              <DropdownItem
                key="history"
                onPress={() => onEdit("history")}
                startContent={<Icon icon="solar:history-bold" />}
              >
                Histórico
              </DropdownItem>
              <DropdownItem
                key="edit"
                onPress={() => onEdit("edit")}
                startContent={<Icon icon="solar:pen-bold" />}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                onPress={onDelete}
                startContent={<Icon icon="solar:trash-bin-trash-bold" />}
              >
                Excluir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <Chip size="sm" variant="flat">
            {creative.image.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1 min-h-[48px]">
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-foreground truncate max-w-[200px]">
              {creative.title}
            </h3>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1.5 text-default-400 bg-content2 px-2 py-1 rounded-md">
                <Icon icon="solar:calendar-linear" width={14} className="mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {dayjs(creative.createdAt).format("DD [de] MMM. [de] YYYY")}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-default-400 truncate">{creative.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:global-bold" width={14} />
            <span className="text-xs font-medium uppercase">{creative.language}</span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:target-bold" width={14} />
            <span className="text-xs font-medium whitespace-nowrap">{creative.salesAngle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:document-text-bold" width={14} />
            <span className="text-xs font-medium whitespace-nowrap">{creative.category.title}</span>
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

        <div onClick={(e) => e.stopPropagation()}>
          <Button
            fullWidth
            variant="flat"
            className="bg-content2 text-default-500 font-semibold h-11 rounded-xl"
            startContent={<Icon icon="solar:history-bold" width={18} />}
            onPress={() => onEdit("history")}
          >
            Visualizar Histórico
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
