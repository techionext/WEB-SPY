import { Modal, ModalContent, ModalBody, Button, ScrollShadow, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import dayjs from "@/utils/dayjs-config";

import { useFileSignedUrlMutation } from "@/services/file/file.service";

interface ModalPlayerProps {
  vsl: ILabsVsl;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const ModalPlayer = ({ vsl, isOpen, onOpenChange }: ModalPlayerProps) => {
  const isCompleted = vsl.processStatus === "COMPLETED";
  const [fileSignedUrl, { isLoading: isDownloading }] = useFileSignedUrlMutation();

  const handleDownloadTranscription = () => {
    if (vsl.transcriptionVsl?.url) {
      window.open(vsl.transcriptionVsl.url, "_blank");
    }
  };

  const handleDownloadVideo = async () => {
    if (vsl.video?.id) {
      await fileSignedUrl({ id: vsl.video.id })
        .unwrap()
        .then(({ url }) => {
          window.open(url, "_blank");
        });
    }
  };

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
              <div className="relative group aspect-video">
                {!isCompleted || !vsl.video?.url ? (
                  <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4 z-10">
                    <Spinner size="lg" color="primary" />
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-white font-bold text-lg">Processando vídeo...</p>
                      <p className="text-default-400 text-sm">
                        O VSL estará disponível assim que o processamento for concluído.
                      </p>
                    </div>
                  </div>
                ) : (
                  <VideoPlayer
                    url={vsl.video.url}
                    type={vsl.video.mimeType || "video/mp4"}
                    className="w-full h-full rounded-none"
                    videoClassName="object-contain"
                    controls={true}
                    muted={true}
                    autoPlay={false}
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
                  <h2 className="text-2xl font-bold leading-tight">{vsl.title}</h2>
                  <p className="text-default-400 text-sm leading-relaxed">
                    {vsl.description || "Sem descrição disponível"}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-default-400">
                      <Icon icon="solar:calendar-linear" width={16} />
                      <span className="text-xs font-medium">
                        {dayjs(vsl.createdAt).format("DD [de] MMM. [de] YYYY, HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-default-400 border-l border-white/10 pl-4">
                      <Icon icon="solar:videocamera-record-linear" width={16} />
                      <span className="text-xs font-medium uppercase">
                        {vsl.video?.mimeType?.replace("video/", "") || "m3u8"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon icon="solar:document-text-bold" width={20} />
                      <h3 className="font-bold tracking-wide uppercase text-xs">Transcrição</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {vsl.video?.id && isCompleted && (
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          className="font-bold"
                          isLoading={isDownloading}
                          onPress={handleDownloadVideo}
                          startContent={<Icon icon="solar:videocamera-record-bold" />}
                        >
                          Baixar Vídeo
                        </Button>
                      )}
                      {vsl.transcriptionVsl && (
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          className="font-bold"
                          onPress={handleDownloadTranscription}
                          startContent={<Icon icon="solar:download-bold" />}
                        >
                          Baixar Transcrição
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="bg-content2/30 rounded-xl p-5 border-1 border-white/5">
                    <p className="text-default-400 text-sm leading-7 italic">
                      {vsl.transcriptionVsl?.text || "Transcrição não disponível para este VSL."}
                    </p>
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
