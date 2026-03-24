import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { useDeleteLabsPageMutation } from "@/services/labs/page/labs-page.service";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { EditPage } from "./modal/edit-page";
import { useFileSignedUrlMutation } from "@/services/file/file.service";

type PageCardProps = {
  data: ILabsPage;
};

export const PageCard = ({ data }: PageCardProps) => {
  const [removePage, { isLoading: isRemovingPage }] = useDeleteLabsPageMutation();
  const [removePageId, setRemovePageId] = useState<string>("");
  const [editPage, setEditPage] = useState<ILabsPage | null>(null);
  const [fileSignedUrl] = useFileSignedUrlMutation();
  return (
    <>
      <Card className="bg-content1 h-[300px] flex flex-col" shadow="none" radius="lg">
        <CardHeader className="flex items-center justify-between bg-content2 h-[56px]">
          <Chip size="sm" radius="md" variant="flat" color="primary">
            {data.type}
          </Chip>
          <div className="flex items-center gap-2">
            {data.url && (
              <Tooltip content="Abrir URL">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  onPress={() => window.open(data.url, "_blank")}
                >
                  <Icon icon="solar:link-linear" width={16} height={16} />
                </Button>
              </Tooltip>
            )}
            {data?.file?.id && (
              <Tooltip content="Download do arquivo">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  onPress={() => {
                    fileSignedUrl({ id: data.file!.id })
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
            {data.image?.id && (
              <Tooltip content="Download da imagem">
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
                  <Icon icon="solar:gallery-download-bold-duotone" width={16} />
                </Button>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardBody className="flex flex-col p-0 h-full relative">
          {data?.image?.url ? (
            <div className="w-full h-full bg-content1 flex items-center justify-center overflow-hidden">
              <Image src={data.image.url} alt={data.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-full bg-content1 flex items-center justify-center p-4">
              <Icon icon="solar:gallery-bold-duotone" width={100} height={100} />
            </div>
          )}
        </CardBody>
        <CardFooter className="px-4 py-6 bg-content2 h-[70px]">
          <div className="flex justify-between gap-2 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{data.title}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  endContent={<Icon icon="solar:pen-bold-duotone" width={16} height={16} />}
                  onPress={() => setEditPage(data)}
                />
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  color="danger"
                  endContent={
                    <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} height={16} />
                  }
                  onPress={() => setRemovePageId(data.id)}
                />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      {!!removePageId && (
        <ModalRemove
          isOpen={!!removePageId}
          onOpenChange={() => setRemovePageId("")}
          onRemove={() => removePage({ id: removePageId }).unwrap()}
          title="Excluir página"
          text="Tem certeza que deseja excluir a página?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isRemovingPage}
        />
      )}

      {editPage && <EditPage page={editPage} setEditPage={setEditPage} />}
    </>
  );
};
