"use client";

import React from "react";
import { Button, Card, CardBody, Chip, Skeleton, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import { useGetLabsVSLSQuery } from "@/services/labs/vsls/labs-vsls.service";
import { useFileSignedUrlMutation } from "@/services/file/file.service";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import dayjs from "@/utils/dayjs-config";
import { useParams } from "next/navigation";

const LIST_PAGE_SIZE = 100;

type VslCardProps = {
  /** Lista fixa (não chama API). */
  items?: ILabsVsl[];
  /** Um único VSL (não chama API). */
  vsl?: ILabsVsl;
};

function statusChip(processStatus: ILabsVsl["processStatus"]) {
  switch (processStatus) {
    case "COMPLETED":
      return (
        <Chip color="success" size="sm" variant="flat">
          Concluído
        </Chip>
      );
    case "PROCESSING":
      return (
        <Chip color="warning" size="sm" variant="flat">
          Processando
        </Chip>
      );
    case "UPLOADING":
      return (
        <Chip size="sm" variant="flat">
          Enviando
        </Chip>
      );
    default:
      return null;
  }
}

function VslSlide({ vsl }: { vsl: ILabsVsl }) {
  const isCompleted = vsl.processStatus === "COMPLETED";
  const [fileSignedUrl, { isLoading: isDownloading }] = useFileSignedUrlMutation();

  const handleDownloadVideo = async () => {
    if (vsl.video?.id) {
      await fileSignedUrl({ id: vsl.video.id })
        .unwrap()
        .then(({ url }) => {
          window.open(url, "_blank");
        });
    }
  };

  const handleDownloadTranscription = () => {
    if (vsl.transcriptionVsl?.url) {
      window.open(vsl.transcriptionVsl.url, "_blank");
    }
  };

  return (
    <div className="grid min-h-[280px] grid-cols-1 lg:min-h-[360px] lg:grid-cols-2">
      <div className="relative aspect-video w-full bg-black lg:aspect-auto lg:min-h-[360px]">
        {!isCompleted || !vsl.video?.url ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black">
            <Spinner color="primary" size="lg" />
            <div className="px-4 text-center">
              <p className="text-lg font-bold text-white">Processando vídeo...</p>
              <p className="mt-1 text-sm text-default-400">
                O VSL estará disponível assim que o processamento for concluído.
              </p>
            </div>
          </div>
        ) : (
          <VideoPlayer
            key={vsl.id}
            autoPlay={false}
            className="h-full w-full"
            controls={true}
            muted={true}
            type={vsl.video.mimeType || "video/mp4"}
            url={vsl.video.url}
            videoClassName="object-contain"
          />
        )}
      </div>

      <div className="flex min-h-[280px] min-w-0 flex-col gap-5 p-5 lg:min-h-[360px] lg:p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold leading-tight text-foreground lg:text-2xl">
            {vsl.title}
          </h2>
          <p className="text-sm leading-relaxed text-default-400">
            {vsl.description || "Sem descrição disponível"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-default-400">
              <Icon height={16} icon="solar:calendar-linear" width={16} />
              <span className="text-xs font-medium">
                {dayjs(vsl.createdAt).format("DD [de] MMM [de] YYYY")}
              </span>
            </div>
            {statusChip(vsl.processStatus)}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-default-500">
            Transcrição
          </p>
          <div className="max-h-[200px] overflow-y-auto rounded-xl border border-white/5 bg-content2/30 p-4 lg:max-h-[220px]">
            <p className="text-sm leading-7 text-default-400">
              {vsl.transcriptionVsl?.text || "Transcrição não disponível para este VSL."}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            className="font-semibold"
            startContent={<Icon icon="solar:videocamera-record-bold" width={18} />}
            variant="bordered"
            isLoading={isDownloading}
            onPress={handleDownloadVideo}
            isDisabled={!vsl.video?.id || !isCompleted}
          >
            Baixar VSL
          </Button>
          <Button
            className="font-semibold"
            color="primary"
            startContent={<Icon icon="solar:download-bold" width={18} />}
            variant="flat"
            onPress={handleDownloadTranscription}
            isDisabled={!vsl.transcriptionVsl?.url}
          >
            Baixar transcrição
          </Button>
        </div>
      </div>
    </div>
  );
}

export const VslCard = ({ items: itemsProp, vsl }: VslCardProps) => {
  const { id } = useParams();
  const skipQuery = Boolean(itemsProp) || Boolean(vsl) || !id;

  const { data, isLoading } = useGetLabsVSLSQuery(
    { offerId: id as string, page: 1, pageSize: LIST_PAGE_SIZE },
    { skip: skipQuery },
  );

  const list = React.useMemo(() => {
    if (itemsProp?.length) return itemsProp;
    if (vsl) return [vsl];
    return data?.data ?? [];
  }, [itemsProp, vsl, data?.data]);

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setIndex(0);
  }, [list]);

  const total = list.length;
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const current = list[safeIndex] ?? null;

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));

  React.useEffect(() => {
    if (index > 0 && index >= total) setIndex(Math.max(0, total - 1));
  }, [index, total]);

  if (!itemsProp && !vsl && !id) {
    return null;
  }

  if (!skipQuery && isLoading) {
    return (
      <Card className="card w-full min-w-0 overflow-hidden border border-default-200/60 dark:border-default-100">
        <div className="flex items-center justify-between border-b border-divider px-4 py-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <CardBody className="gap-0 p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Skeleton className="aspect-video w-full lg:aspect-auto lg:min-h-[360px]" />
            <div className="flex flex-col gap-4 p-6">
              <Skeleton className="h-8 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card className="card w-full min-w-0 overflow-hidden border border-default-200/60 dark:border-default-100">
        <CardBody className="flex min-h-[200px] items-center justify-center px-6 py-10">
          <p className="text-center text-small text-default-500">
            Nenhum VSL cadastrado para esta oferta.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">VSL</h3>
        {total > 1 ? (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              aria-label="VSL anterior"
              isIconOnly
              size="sm"
              variant="light"
              isDisabled={safeIndex === 0}
              onPress={goPrev}
            >
              <Icon height={20} icon="solar:alt-arrow-left-linear" width={20} />
            </Button>
            <span className="min-w-[3.25rem] text-center text-small tabular-nums text-default-500">
              {safeIndex + 1} / {total}
            </span>
            <Button
              aria-label="Próximo VSL"
              isIconOnly
              size="sm"
              variant="light"
              isDisabled={safeIndex >= total - 1}
              onPress={goNext}
            >
              <Icon height={20} icon="solar:alt-arrow-right-linear" width={20} />
            </Button>
          </div>
        ) : null}
      </div>
      <Card className="card w-full min-w-0 overflow-hidden ">
        <CardBody className="gap-0 p-0">
          {current ? <VslSlide key={current.id} vsl={current} /> : null}
        </CardBody>
      </Card>
    </div>
  );
};
