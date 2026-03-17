"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import dayjs from "dayjs";
import { ISpyVSL } from "@/types/spy/spy-offers.type";
import { useState } from "react";
import { useLazyGetSpyVslDownloadQuery } from "@/services/spy/spy-offers.service";

interface CardVslProps {
  data: ISpyVSL;
}

export const CardOfferVSL = ({ data }: CardVslProps) => {
  const formatDate = (dateString: string) => {
    const months = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];
    const date = dayjs(dateString);
    return `${date.format("DD")} ${months[date.month()]} ${date.format("YYYY")}`;
  };

  const [getDownloadUrl, { isLoading: isDownloading }] = useLazyGetSpyVslDownloadQuery();

  const hasTranscription = !!data.transcriptionVsl?.url;

  const [selectedVsl, setSelectedVsl] = useState<ISpyVSL | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDownload = async (vsl: ISpyVSL) => {
    try {
      const result = await getDownloadUrl({ id: vsl.id }).unwrap();
      if (result?.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }
    } catch {}
  };

  const handleWatch = (vsl: ISpyVSL) => {
    setSelectedVsl(vsl);
    setIsPlaying(true);
  };

  const handleScript = (vsl: ISpyVSL) => {
    if (vsl.transcriptionVsl?.url) {
      window.open(vsl.transcriptionVsl.url, "_blank");
    }
  };

  return (
    <>
      {isPlaying && selectedVsl ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{selectedVsl.title}</h3>
            <button
              onClick={() => setIsPlaying(false)}
              className="text-default-500 hover:text-foreground"
            >
              <Icon icon="solar:close-circle-bold" className="text-2xl" />
            </button>
          </div>
          <VideoPlayer url={selectedVsl.url || ""} />
          <p className="text-sm text-default-500">{selectedVsl.description}</p>
        </div>
      ) : (
        <Card className="card" shadow="none">
          <CardBody className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-shrink-0 w-60 h-32 rounded-lg bg-default-100 overflow-hidden">
                {data?.url ? (
                  <div className="w-full h-full">
                    <VideoPlayer url={data.url} type="video" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="solar:videocamera-record-bold-duotone"
                      className="text-4xl text-default-400"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-foreground">{data.title}</h3>
                <p className="text-sm text-default-500 line-clamp-2">
                  {data.description || "Não possui descrição"}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Icon icon="solar:clock-circle-bold-duotone" className="text-lg" />
                    <span>{formatDate(data.createdAt)}</span>
                  </div>
                  {hasTranscription && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Icon icon="solar:document-text-bold-duotone" className="text-lg" />
                      <span>Transcrição disponível</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button
                  className="bg-gradient-to-r from-primary to-blue-400 text-white font-semibold min-w-32"
                  radius="lg"
                  startContent={<Icon icon="solar:play-bold" />}
                  onPress={() => handleWatch(data)}
                >
                  Assistir
                </Button>
                <Button
                  variant="flat"
                  className="bg-default-200 dark:bg-default-100 text-foreground min-w-32"
                  radius="lg"
                  startContent={<Icon icon="solar:download-bold" />}
                  isLoading={isDownloading}
                  isDisabled={isDownloading}
                  onPress={() => handleDownload(data)}
                >
                  Download
                </Button>
                {hasTranscription && (
                  <Button
                    variant="flat"
                    className="bg-default-200 dark:bg-default-100 text-foreground min-w-32"
                    radius="lg"
                    startContent={<Icon icon="solar:document-text-bold-duotone" />}
                    onPress={() => handleScript(data)}
                  >
                    Script
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};
