"use client";
import { useState } from "react";
import {
  Card,
  CardBody,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import dayjs from "@/utils/dayjs-config";
import { VideoPlayer } from "@/components/videoplayer/video-player";

interface VslCardProps {
  vsl: ILabsVsl;
  onEdit?: () => void;
  onDelete?: () => void;
  onWatch?: () => void;
}

export const VslCard = ({ vsl, onEdit, onDelete, onWatch }: VslCardProps) => {
  const [playing, setPlaying] = useState(false);
  const isCompleted = vsl.processStatus === "COMPLETED";

  return (
    <Card
      isPressable
      as="div"
      onPress={onWatch}
      className="card hover:border-primary/50 border-1 border-transparent transition-all duration-300 hover:scale-[1.01] cursor-pointer h-full"
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
    >
      <CardBody className="p-0 overflow-visible">
        <div className="relative h-48 bg-black rounded-t-xl overflow-hidden group">
          {vsl.video?.url && isCompleted ? (
            <div className="w-full h-full bg-content1 flex items-center justify-center overflow-hidden rounded-t-xl z-0">
              <VideoPlayer
                url={vsl.video.url}
                type={vsl.video.mimeType || "video/mp4"}
                className="w-full h-full aspect-auto rounded-none bg-transparent"
                videoClassName="object-cover"
                playing={playing}
                muted={true}
                controls={false}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-content2 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon icon="solar:play-bold" width={24} />
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <Chip
              size="sm"
              variant="flat"
              className={
                isCompleted
                  ? "bg-success/20 text-success border-success/30 border-1 h-7 backdrop-blur-md"
                  : "bg-warning/20 text-warning border-warning/30 border-1 h-7 backdrop-blur-md"
              }
              startContent={
                isCompleted ? (
                  <Icon icon="solar:check-circle-bold" className="ml-1.5" width={14} />
                ) : (
                  <Spinner size="sm" color="warning" className="p-1" />
                )
              }
            >
              <span className="font-bold text-[10px] tracking-wide uppercase">
                {isCompleted ? "Concluído" : "Processando"}
              </span>
            </Chip>

            {vsl.transcriptionVsl && (
              <Chip
                size="sm"
                variant="flat"
                className="bg-primary/20 text-primary border-primary/30 border-1 h-7 backdrop-blur-md"
                startContent={
                  <Icon icon="solar:document-text-bold" className="ml-1.5" width={14} />
                }
              >
                <span className="font-bold text-[10px] tracking-wide uppercase">Transcrição</span>
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
                  className="bg-content2 hover:bg-content2/60 min-w-8 w-8 h-8 rounded-full backdrop-blur-md"
                >
                  <Icon icon="solar:menu-dots-bold" width={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Ações do VSL">
                <DropdownItem
                  key="edit"
                  onPress={onEdit}
                  startContent={<Icon icon="solar:pen-bold" className="rotate-90" width={18} />}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={onDelete}
                  startContent={<Icon icon="solar:trash-bin-trash-bold" className="text-lg" />}
                >
                  Excluir
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border-1 border-white/10 flex items-center gap-1.5">
            <Icon icon="solar:clapperboard-play-bold" className="text-white/70" width={14} />
            <span className="text-[10px] font-bold text-white/70 tracking-wider">VSL</span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold max-w-[200px] text-white truncate leading-tight">
                {vsl.title}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-default-400 bg-content2 px-2 py-1 rounded-md">
                  <Icon icon="solar:calendar-linear" width={14} className="mb-0.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {dayjs(vsl.createdAt).format("DD [de] MMM. [de] YYYY")}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-default-400 font-medium line-clamp-1 leading-relaxed">
              {vsl.description || "Sem descrição disponível"}
            </p>
          </div>

          <div className="w-full h-[1px] bg-divider/50 my-1" />

          <Button
            onPress={onWatch}
            variant="bordered"
            className="w-full border-1 border-divider hover:border-primary/50 hover:bg-primary/5 font-bold transition-all duration-300"
            startContent={<Icon icon="solar:play-bold" className="text-lg" />}
          >
            Assistir VSL
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
