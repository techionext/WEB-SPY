import { Modal, ModalContent, ModalBody, Button, ScrollShadow, Spinner, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import dayjs from "@/utils/dayjs-config";
import { trafficNetworkValues } from "@/types/offer/offer.type";

import { useFileSignedUrlMutation } from "@/services/file/file.service";

interface ModalViewProps {
  creative: ILabsCreative | null;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const ModalView = ({ creative, isOpen, onOpenChange }: ModalViewProps) => {
  const [fileSignedUrl, { isLoading: isDownloading }] = useFileSignedUrlMutation();

  if (!creative) return null;

  const handleDownloadFile = async () => {
    if (creative.image?.id) {
      await fileSignedUrl({ id: creative.image.id })
        .unwrap()
        .then(({ url }) => {
          window.open(url, "_blank");
        });
    }
  };

  const isVideo = creative.image?.mimeType?.startsWith("video/");
  const trafficConfig = trafficNetworkValues[creative.trafficNetwork];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      className="bg-content1 border border-default-100"
      hideCloseButton
    >
      <ModalContent className="p-0 overflow-hidden">
        {(onClose) => (
          <>
            <ModalBody className="p-0 gap-0">
              <div className="relative group aspect-video bg-black/50 flex items-center justify-center overflow-hidden">
                {!creative.image?.url ? (
                  <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" color="primary" />
                    <p className="text-default-400 text-sm font-medium">Carregando conteúdo...</p>
                  </div>
                ) : isVideo ? (
                  <VideoPlayer
                    url={creative.image.url}
                    type={creative.image.mimeType}
                    className="w-full h-full"
                    videoClassName="object-contain"
                    controls={true}
                    muted={true}
                    autoPlay={false}
                  />
                ) : (
                  <Image
                    src={creative.image.url}
                    alt={creative.title}
                    className="w-full h-full object-contain"
                    radius="none"
                  />
                )}
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={onClose}
                  className="absolute top-4 right-4 z-50 bg-content1/40 hover:bg-content1/60 backdrop-blur-md text-white"
                >
                  <Icon icon="solar:close-circle-bold" width={20} />
                </Button>
              </div>

              <ScrollShadow className="p-6 flex flex-col gap-6 max-h-[400px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight">{creative.title}</h2>
                    {creative.image?.id && (
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="font-bold"
                        isLoading={isDownloading}
                        onPress={handleDownloadFile}
                        startContent={<Icon icon="solar:download-bold" />}
                      >
                        Baixar Arquivo
                      </Button>
                    )}
                  </div>
                  <p className="text-default-400 text-sm leading-relaxed">
                    {creative.description || "Sem descrição disponível"}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-default-400">
                      <Icon icon="solar:calendar-linear" width={16} />
                      <span className="text-xs font-medium">
                        {dayjs(creative.createdAt).format("DD [de] MMM. [de] YYYY, HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-default-400 border-l border-white/10 pl-4">
                      <Icon icon="solar:file-text-linear" width={16} />
                      <span className="text-xs font-medium uppercase">
                        {creative.image?.mimeType || "image/png"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
                      <Icon icon="solar:target-bold-duotone" className="text-primary text-xl" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-default-400 tracking-wider">
                        Ângulo de Venda
                      </span>
                      <p className="text-sm font-medium text-white truncate">
                        {creative.salesAngle || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border-1 border-orange-500/20">
                      <Icon
                        icon="solar:translation-bold-duotone"
                        className="text-orange-500 text-xl"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-default-400 tracking-wider">
                        Idioma
                      </span>
                      <p className="text-sm font-medium text-white">{creative.language}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${trafficConfig?.bgColor || "bg-success/10"} flex items-center justify-center border-1 ${trafficConfig?.borderColor || "border-success/20"}`}
                    >
                      <Icon
                        icon={trafficConfig?.icon || "solar:global-bold-duotone"}
                        className={`${trafficConfig?.color || "text-success"} text-xl`}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-default-400 tracking-wider">
                        Rede de Tráfego
                      </span>
                      <p className="text-sm font-medium text-white truncate">
                        {trafficConfig?.label || creative.trafficNetwork}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollShadow>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
