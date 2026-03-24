import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import { useDeleteLabsVSLMutation } from "@/services/labs/vsls/labs-vsls.service";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import { Button, Card, CardBody, CardFooter, Chip, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { EditVSL } from "./modal/edit-vsl";
import { useFileSignedUrlMutation } from "@/services/file/file.service";
import { IUser } from "@/types/user.type";

type CardVSLProps = {
  data: ILabsVsl;
  user?: IUser | null;
};

const statusEnum = {
  UPLOADING: {
    label: "Enviando",
    color: "warning",
  },
  PROCESSING: {
    label: "Processando",
    color: "warning",
  },
  COMPLETED: {
    label: "Completo",
    color: "success",
  },
};

export const CardVSL = ({ data, user }: CardVSLProps) => {
  const [removeVSLId, setRemoveVSLId] = useState<string>("");
  const [editVSL, setEditVSL] = useState<ILabsVsl | null>(null);
  const [deleteLabsVSL, { isLoading }] = useDeleteLabsVSLMutation();
  const [fileSignedUrl] = useFileSignedUrlMutation();
  return (
    <>
      <Card className="bg-content1 h-[300px]" shadow="none" radius="lg">
        <CardBody className="flex flex-col p-0">
          <div className="relative flex-shrink-0 w-full h-full rounded-lg bg-default-100 overflow-hidden">
            {data.video?.url ? (
              <div className="w-full h-full">
                <VideoPlayer url={data.video.url} type="video" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-content1">
                <Icon
                  icon="solar:videocamera-record-bold-duotone"
                  className="text-4xl text-default-400"
                />
              </div>
            )}
            {user?.platformRole !== "USER" && (
              <div className="absolute top-3 right-3">
                <Chip
                  size="sm"
                  variant="solid"
                  color={statusEnum[data.processStatus].color as "warning" | "success"}
                >
                  <Tooltip content="Status do processamento do vídeo" className="p-2 bg-content2">
                    <div className="flex items-center gap-1">
                      {statusEnum[data.processStatus].label}
                      <Icon icon="solar:info-circle-bold" width={14} />
                    </div>
                  </Tooltip>
                </Chip>
              </div>
            )}
          </div>
        </CardBody>
        <CardFooter className="p-4 bg-content2 h-[80px]">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{data.title}</p>
              <Tooltip
                content={
                  <p className="max-w-[280px] break-words text-sm text-foreground-500">
                    {data.description}
                  </p>
                }
                className="p-4"
              >
                <p className="truncate w-[180px]">{data.description}</p>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {data.transcriptionVsl?.id && (
                  <Tooltip content="Download do transcrição" className="p-2">
                    <Button
                      isIconOnly
                      variant="light"
                      radius="full"
                      onPress={() => {
                        fileSignedUrl({ id: data.transcriptionVsl!.id })
                          .unwrap()
                          .then((res) => {
                            window.open(res.url, "_blank");
                          });
                      }}
                    >
                      <Icon icon="solar:document-text-bold-duotone" width={16} />
                    </Button>
                  </Tooltip>
                )}
                {data.video?.id && (
                  <Tooltip content="Download do vídeo" className="p-2">
                    <Button
                      isIconOnly
                      variant="light"
                      radius="full"
                      onPress={() => {
                        fileSignedUrl({ id: data.video.id })
                          .unwrap()
                          .then((res) => {
                            window.open(res.url, "_blank");
                          });
                      }}
                    >
                      <Icon icon="solar:file-download-bold-duotone" width={16} />
                    </Button>
                  </Tooltip>
                )}
                <Button isIconOnly variant="light" radius="full" onPress={() => setEditVSL(data)}>
                  <Icon icon="solar:pen-bold-duotone" width={16} />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  onPress={() => setRemoveVSLId(data.id)}
                  color="danger"
                >
                  <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      {!!removeVSLId && (
        <ModalRemove
          isOpen={!!removeVSLId}
          onOpenChange={() => setRemoveVSLId("")}
          onRemove={() =>
            deleteLabsVSL({ id: removeVSLId })
              .unwrap()
              .then(() => setRemoveVSLId(""))
          }
          title="Excluir VSL"
          text="Tem certeza que deseja excluir o VSL?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isLoading}
        />
      )}
      {editVSL && <EditVSL vsl={editVSL} setEditVSL={setEditVSL} />}
    </>
  );
};
