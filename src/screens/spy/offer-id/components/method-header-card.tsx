"use client";

import { ISpyOfferById } from "@/types/spy/spy-offers.type";
import { getFlagCode, getLanguageName } from "@/utils/languageUtils";
import { Button, Card, CardBody, Image, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MethodHeaderCardProps {
  data: ISpyOfferById | undefined;
}

export const MethodHeaderCard = ({ data }: MethodHeaderCardProps) => {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const shareableUrl = pathname
    ? `${process.env.NEXT_PUBLIC_APP_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
    : null;

  const handleCopy = async () => {
    if (!shareableUrl) return;
    await navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyTooltip = copied
    ? "Copiado!"
    : shareableUrl
      ? "Copiar link da oferta"
      : "Link indisponível para copiar";

  return (
    <Card className="card">
      <CardBody className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-default-200">
              <Image
                removeWrapper
                src={data?.image?.url}
                alt={data?.title}
                width={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-semibold truncate">{data?.title}</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-sm text-default-500">
                <span className="text-default-400">·</span>
                <span>{data?.category?.title}</span>
                <span className="text-default-400">·</span>
                <span>{data?.typeProduct}</span>
                <span className="text-default-400">·</span>
                <span>{data?.structure}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip content={copyTooltip}>
              <span className="inline-flex">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="h-6 w-6 min-w-0"
                  onPress={handleCopy}
                  color={copied ? "success" : "default"}
                  isDisabled={!shareableUrl}
                >
                  <Icon
                    icon={copied ? "solar:check-read-linear" : "solar:copy-linear"}
                    width={14}
                  />
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Info label="Tipo" value={data?.typeProduct ?? "-"} />
          <Info label="Estrutura" value={data?.structure ?? "-"} />
          <Info
            label="Idioma"
            value={
              data?.language ? (
                <Tooltip content={getLanguageName(data.language)}>
                  <span className="inline-flex">
                    <Icon
                      icon={`circle-flags:${getFlagCode(data.language)}`}
                      className="text-xl"
                      aria-label={getLanguageName(data.language)}
                    />
                  </span>
                </Tooltip>
              ) : (
                "-"
              )
            }
          />
          <Info label="Nicho" value={data?.category?.title ?? "-"} />
          <Info label="Tráfego" value={data?.trafficNetwork ?? "-"} />
        </div>
      </CardBody>
    </Card>
  );
};

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-content1/40 border border-content1/40 rounded-xl p-4 space-y-1">
    <p className="text-xs uppercase tracking-wider text-foreground-400">{label}</p>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);
