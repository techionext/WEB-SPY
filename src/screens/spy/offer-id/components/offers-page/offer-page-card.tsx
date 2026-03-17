"use client";

import { ISpyPage } from "@/types/spy/spy-pages.type";
import { Card, Tooltip, CardBody, Image, Skeleton, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export type PageCardProps = {
  data: ISpyPage;
};

export const PageOfferCardLoading = () => {
  return (
    <Card className="card" shadow="none" radius="lg">
      <CardBody className="p-0 flex flex-col">
        <div className="h-6 px-2 flex items-center justify-between bg-default-50/60">
          <div className="flex items-center gap-1">
            <Skeleton className="size-1.5 rounded-full" />
            <Skeleton className="size-1.5 rounded-full" />
            <Skeleton className="size-1.5 rounded-full" />
          </div>

          <Skeleton className="h-3 w-16 rounded-full" />

          <div className="w-4" />
        </div>

        <Skeleton className="w-full h-[150px] rounded-none" />

        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex flex-col gap-1 min-w-0">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-2 w-16 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>{" "}
        </div>
      </CardBody>
    </Card>
  );
};

export const PageOfferCard = ({ data }: PageCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data.url) return;
    await navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyTooltip = copied
    ? "Copiado!"
    : data.url
      ? "Copiar link"
      : "Link indisponível para copiar";
  const downloadTooltip =
    data?.file?.url !== null ? "Baixar arquivo" : "Arquivo indisponível para download";

  const handleDownload = () => {
    if (!data.file?.url) return;

    const ext = data.file.mimeType?.includes("png")
      ? "png"
      : data.file.mimeType?.includes("jpeg") || data.file.mimeType?.includes("jpg")
        ? "jpg"
        : "png";
    const link = document.createElement("a");
    link.href = data.file.url;
    link.download = `${data.title}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      isPressable
      onPress={() => {
        window.open(data.url, "_blank");
      }}
      shadow="none"
      className="card overflow-hidden transition"
    >
      <CardBody className="p-0 flex flex-col">
        <div className="h-6 px-2 flex items-center justify-between bg-default-50/60">
          <div className="flex items-center gap-1">
            <div className="size-1.5 bg-danger rounded-full" />
            <div className="size-1.5 bg-warning rounded-full" />
            <div className="size-1.5 bg-success rounded-full" />
          </div>

          <Tooltip content={data.title}>
            <p className="text-[10px] text-default-500 truncate max-w-[90px]">{data.title}</p>
          </Tooltip>

          <div className="w-4" />
        </div>

        <Image
          removeWrapper
          src={data.screenshot?.url ?? "https://placehold.co/600x400"}
          alt={data.title}
          className="w-full h-[150px] object-cover rounded-none"
        />

        <div className="flex items-center justify-between px-3 py-2 text-xs">
          <div className="min-w-0">
            <Tooltip content={data.title}>
              <p className="font-medium truncate max-w-[140px]">{data.title}</p>
            </Tooltip>
            <span className="text-default-400">{data.type}</span>
          </div>

          <div className="flex items-center gap-1.5 text-default-500">
            <Tooltip content={copyTooltip}>
              <span className="inline-flex">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="h-6 w-6 min-w-0"
                  onPress={handleCopy}
                  color={copied ? "success" : "default"}
                  isDisabled={!data.url}
                >
                  <Icon
                    icon={copied ? "solar:check-read-linear" : "solar:copy-linear"}
                    width={14}
                  />
                </Button>
              </span>
            </Tooltip>

            <Tooltip content={downloadTooltip}>
              <span className="inline-flex">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="h-6 w-6 min-w-0"
                  onPress={handleDownload}
                  isDisabled={!data.file?.url}
                >
                  <Icon icon="solar:download-linear" width={14} />
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
