import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { useDeleteLabsCreativeMutation } from "@/services/creative/creative.service";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useState } from "react";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import { useFileSignedUrlMutation } from "@/services/file/file.service";
import { EditModal } from "@/screens/creatives/components/edit-modal/edit-modal";

type CreativeLabsCardsProps = {
  data: ILabsCreative;
};

export const CreativeLabsCards = ({ data }: CreativeLabsCardsProps) => {
  const [removeCreative, { isLoading }] = useDeleteLabsCreativeMutation();
  const [removeCreativeId, setRemoveCreativeId] = useState<string>("");
  const [editCreative, setEditCreative] = useState<ILabsCreative | null>(null);
  const [fileSignedUrl] = useFileSignedUrlMutation();

  return (
    <>
      <Card className="bg-default-100" shadow="none" radius="lg">
        <CardBody className="flex flex-col p-0 h-full relative">
          {data?.image?.url ? (
            data.image.mimeType.startsWith("video") ? (
              <div className="w-full h-[216px] bg-content1 flex items-center justify-center overflow-hidden">
                <VideoPlayer url={data.image.url} />
              </div>
            ) : (
              <div className="w-full h-[216px] bg-content1 flex items-center justify-center overflow-hidden">
                <Image
                  src={data.image.url}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          ) : (
            <div className="w-full h-full bg-content1 flex items-center justify-center p-4">
              <Icon icon="solar:gallery-bold-duotone" width={100} height={100} />
            </div>
          )}
        </CardBody>
        <CardFooter>
          <div className="flex justify-between w-full">
            <div className="flex flex-col">
              <p className="text-sm font-medium">{data.title}</p>
              <div className="flex gap-2">
                <p className="text-sm text-default-500">Criado em:</p>
                <p className="text-sm text-default-500">
                  {dayjs(data.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {data.image?.id && (
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  onPress={() => {
                    fileSignedUrl({ id: data.image.id })
                      .unwrap()
                      .then((res) => {
                        window.open(res.url, "_blank");
                      });
                  }}
                >
                  <Icon icon="solar:file-download-bold-duotone" width={16} />
                </Button>
              )}
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={() => setEditCreative(data)}
              >
                <Icon icon="solar:pen-bold-duotone" width={16} />
              </Button>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={() => setRemoveCreativeId(data.id)}
                color="danger"
              >
                <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      {!!removeCreativeId && (
        <ModalRemove
          isOpen={!!removeCreativeId}
          onOpenChange={() => setRemoveCreativeId("")}
          onRemove={() => removeCreative({ id: removeCreativeId }).unwrap()}
          title="Excluir criativo"
          text="Tem certeza que deseja excluir o criativo?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isLoading}
        />
      )}
      {editCreative && (
        <EditModal
          creative={editCreative}
          isOpen={!!editCreative}
          onClose={() => setEditCreative(null)}
        />
      )}
    </>
  );
};
