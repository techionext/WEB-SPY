"use client";

import type { ReactNode } from "react";
import { Button, ScrollShadow, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import dayjs from "@/utils/dayjs-config";
import { cn } from "@heroui/theme";

export type VslPlayerContentProps = {
  vsl: ILabsVsl;
  /** Ex.: botão fechar sobre o vídeo (modal). */
  topRightSlot?: ReactNode;
  className?: string;
  videoSectionClassName?: string;
  videoPlayerClassName?: string;
};

export function VslPlayerContent({
  vsl,
  topRightSlot,
  className,
  videoSectionClassName,
  videoPlayerClassName,
}: VslPlayerContentProps) {
  const isCompleted = vsl.processStatus === "COMPLETED";

  const handleDownloadTranscription = () => {
    if (vsl.transcriptionVsl?.url) {
      window.open(vsl.transcriptionVsl.url, "_blank");
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("relative aspect-video bg-black", videoSectionClassName)}>
        {!isCompleted || !vsl.video?.url ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black">
            <Spinner color="primary" size="lg" />
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <p className="text-lg font-bold text-white">Processando vídeo...</p>
              <p className="text-sm text-default-400">
                O VSL estará disponível assim que o processamento for concluído.
              </p>
            </div>
          </div>
        ) : (
          <VideoPlayer
            autoPlay={false}
            className={cn("h-full w-full", videoPlayerClassName)}
            controls={true}
            muted={true}
            type={vsl.video.mimeType || "video/mp4"}
            url={vsl.video.url}
            videoClassName="object-contain"
          />
        )}
        {topRightSlot ? <div className="absolute right-4 top-4 z-50">{topRightSlot}</div> : null}
      </div>

      <ScrollShadow className="flex max-h-[400px] flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold leading-tight">{vsl.title}</h2>
          <p className="text-sm leading-relaxed text-default-400">
            {vsl.description || "Sem descrição disponível"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-default-400">
              <Icon height={16} icon="solar:calendar-linear" width={16} />
              <span className="text-xs font-medium">
                {dayjs(vsl.createdAt).format("DD [de] MMM. [de] YYYY, HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-4 text-default-400">
              <Icon height={16} icon="solar:videocamera-record-linear" width={16} />
              <span className="text-xs font-medium uppercase">
                {vsl.video?.mimeType?.replace("video/", "") || "m3u8"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Icon height={20} icon="solar:document-text-bold" width={20} />
              <h3 className="text-xs font-bold uppercase tracking-wide">Transcrição</h3>
            </div>
            {vsl.transcriptionVsl ? (
              <Button
                className="font-bold"
                color="primary"
                size="sm"
                startContent={<Icon icon="solar:download-bold" />}
                variant="flat"
                onPress={handleDownloadTranscription}
              >
                Baixar
              </Button>
            ) : null}
          </div>

          <div className="rounded-xl border-1 border-white/5 bg-content2/30 p-5">
            <p className="text-sm italic leading-7 text-default-400">
              {vsl.transcriptionVsl?.text || "Transcrição não disponível para este VSL."}
            </p>
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
}
