"use client";

import {
  Avatar,
  Button,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import {
  IAnalysisRequestGetByIdDTO,
  useAddAnalysisRequestFileMutation,
  usePatchAnalysisRequestMutation,
  useRemoveAnalysisRequestFileMutation,
  useUpdateAnalysisRequestMutation,
} from "@/services/analysis-request/analysis-request.service";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState, type ChangeEvent, type Key } from "react";
import dayjs from "dayjs";

export type SolicitationStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
const STATUS_LABEL: Record<SolicitationStatus, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  COMPLETED: "Aprovado",
  FAILED: "Falhou",
  CANCELLED: "Cancelado",
};

export type DrawerEditProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  analysisRequest?: IAnalysisRequestGetByIdDTO.Result;
  isLoading?: boolean;
  /** Nome do solicitante exibido no modal de aprovação e no cabeçalho. */
  requesterName?: string;
};

export const DrawerEdit = ({
  isOpen,
  onOpenChange,
  analysisRequest,
  isLoading,
  requesterName = "Carlos Mendes",
}: DrawerEditProps) => {
  const [status, setStatus] = useState<SolicitationStatus>("PENDING");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [observation, setObservation] = useState("");
  const responsePhotosInputRef = useRef<HTMLInputElement>(null);
  const [updateAnalysisRequest, { isLoading: isUpdatingAnalysisRequest }] =
    useUpdateAnalysisRequestMutation();
  const [addAnalysisRequestFile, { isLoading: isAddingFile }] = useAddAnalysisRequestFileMutation();
  const [removeAnalysisRequestFile, { isLoading: isRemovingFile }] =
    useRemoveAnalysisRequestFileMutation();
  const [patchAnalysisRequest, { isLoading: isPatchingStatus }] = usePatchAnalysisRequestMutation();

  const handleUpdateAnalysisRequest = () => {
    if (!analysisRequest?.id) return;
    updateAnalysisRequest({
      id: analysisRequest.id,
      observation,
    });
  };

  useEffect(() => {
    setObservation(analysisRequest?.observation ?? "");
  }, [analysisRequest?.id, analysisRequest?.observation]);

  useEffect(() => {
    setStatus(analysisRequest?.status ?? "PENDING");
  }, [analysisRequest?.status]);

  const handleResponsePhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length || !analysisRequest?.id) return;
    Array.from(list).forEach((file) => {
      addAnalysisRequestFile({
        id: analysisRequest.id,
        file,
      });
    });
    e.target.value = "";
  };

  const fallbackImageUrl =
    analysisRequest?.offer?.image?.url ??
    (analysisRequest as { image?: { url?: string } } | undefined)?.image?.url ??
    "https://placehold.co/54x54";

  const removeResponsePhoto = (fileId: string) => {
    if (!analysisRequest?.id) return;
    removeAnalysisRequestFile({
      id: analysisRequest.id,
      fileId,
    });
  };

  const handleStatusSelection = (keys: "all" | Set<Key>) => {
    if (keys === "all") return;
    const selected = [...keys][0] as SolicitationStatus | undefined;
    if (!selected) return;
    if (selected === "COMPLETED") {
      if (status !== "COMPLETED") {
        setIsApproveModalOpen(true);
      }
      return;
    }
    if (!analysisRequest?.id) return;
    patchAnalysisRequest({
      id: analysisRequest.id,
      status: selected,
    });
    setStatus(selected);
  };

  const handleConfirmApprove = () => {
    if (!analysisRequest?.id) return;
    patchAnalysisRequest({
      id: analysisRequest.id,
      status: "COMPLETED",
    });
    setStatus("COMPLETED");
    setIsApproveModalOpen(false);
  };

  const handleApproveModalOpenChange = (open: boolean) => {
    setIsApproveModalOpen(open);
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        size="2xl"
        className="p-2"
      >
        <DrawerContent className="w-full">
          <DrawerHeader className="flex flex-col gap-1 ">
            <div className="flex items-center gap-2">
              <Avatar
                src={fallbackImageUrl}
                radius="md"
                classNames={{
                  base: "h-12 w-12 min-h-12 min-w-12 shrink-0",
                  img: "object-cover",
                }}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <h1 className="text-lg font-bold">
                    {analysisRequest?.title || (isLoading ? "Carregando..." : "Solicitação")}
                  </h1>
                  <Chip size="sm" radius="md" variant="flat" color="primary">
                    {analysisRequest?.type === "ADVANCED" ? "Avançado" : "Simples"}
                  </Chip>
                  <Chip size="sm" radius="md" variant="flat" color="success">
                    {analysisRequest?.status ? STATUS_LABEL[analysisRequest.status] : "Pendente"}
                  </Chip>
                </div>
                <p className="text-sm text-default-400">
                  solicitado por{" "}
                  <span className="">
                    {analysisRequest?.userBenchmark?.name || "-"} em{" "}
                    {dayjs(analysisRequest?.createdAt || "").format("DD/MM/YYYY")}
                  </span>
                </p>
              </div>
            </div>
          </DrawerHeader>
          <DrawerBody className="py-4 px-6 gap-6">
            {analysisRequest?.offer ? (
              <>
                <Divider />

                <div className="flex flex-col gap-2">
                  <p className="text-sm ">Dados da Oferta</p>
                  <div className="flex flex-col gap-2 rounded-md p-3 bg-content2/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={analysisRequest?.offer?.image?.url ?? "https://placehold.co/80x80"}
                        size="lg"
                        radius="md"
                        classNames={{
                          base: "h-20 w-20 min-h-20 min-w-20 shrink-0",
                          img: "object-cover",
                        }}
                      />
                      <div className="flex flex-col gap-1 min-w-0">
                        <h1 className="text-lg font-bold">
                          {analysisRequest?.offer?.title || "-"}
                        </h1>
                        <p className="text-sm text-default-400">{analysisRequest?.title || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="flex flex-col gap-2">
              <p className="text-sm ">URL da Biblioteca</p>
              <div
                className="flex items-center gap-2 bg-content2/40 hover:bg-content2/70 rounded-md p-3 cursor-pointer"
                onClick={() =>
                  analysisRequest?.libraryUrl && window.open(analysisRequest.libraryUrl, "_blank")
                }
              >
                <Icon icon="solar:link-linear" width={16} height={16} className="text-primary" />
                <p className="text-sm text-primary cursor-pointer">
                  {analysisRequest?.libraryUrl || "-"}
                </p>
              </div>
            </div>
            <Select
              labelPlacement="outside"
              label="Status"
              placeholder="Selecione o status"
              radius="md"
              variant="flat"
              selectedKeys={new Set([status])}
              isDisabled={!analysisRequest?.id || isPatchingStatus}
              onSelectionChange={handleStatusSelection}
            >
              <SelectItem key="PENDING" textValue="Pendente">
                Pendente
              </SelectItem>
              <SelectItem key="PROCESSING" textValue="Processando">
                Processando
              </SelectItem>
              <SelectItem key="COMPLETED" textValue="Concluida">
                Aprovado
              </SelectItem>
              <SelectItem key="FAILED" textValue="Falhou">
                Falhou
              </SelectItem>
              <SelectItem key="CANCELLED" textValue="Cancelado">
                Cancelado
              </SelectItem>
            </Select>

            <div className="flex flex-col gap-3">
              <p className="text-sm">Fotos da Resposta</p>
              <input
                ref={responsePhotosInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleResponsePhotosChange}
              />
              {(analysisRequest?.file?.length ?? 0) > 0 && (
                <ul className="flex flex-col gap-2 rounded-lg border border-divider bg-content2/30 p-3">
                  {analysisRequest?.file?.map((file) => (
                    <li key={file.id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar
                          src={file.url}
                          radius="md"
                          classNames={{
                            base: "h-10 w-10 min-h-10 min-w-10 shrink-0",
                            img: "object-cover",
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-default-600">{file.originalName}</span>
                          <span className="text-xs text-default-400">{file.size} KB</span>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        radius="full"
                        aria-label="Remover arquivo"
                        isLoading={isRemovingFile}
                        onPress={() => removeResponsePhoto(file.id)}
                      >
                        <Icon
                          icon="solar:trash-bin-trash-bold"
                          width={18}
                          className="text-danger"
                        />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="flat"
                color="primary"
                radius="md"
                className="w-fit "
                isLoading={isAddingFile}
                isDisabled={!analysisRequest?.id}
                onPress={() => responsePhotosInputRef.current?.click()}
              >
                Adicionar arquivos
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm ">Observações</p>
              <Textarea
                placeholder="Digite suas observações (opcional)"
                radius="md"
                size="sm"
                value={observation}
                onValueChange={setObservation}
              />
              <Button
                color="primary"
                variant="flat"
                className="mt-2 w-fit"
                isLoading={isUpdatingAnalysisRequest}
                isDisabled={!analysisRequest?.id}
                onPress={handleUpdateAnalysisRequest}
              >
                Salvar observação
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal
        hideCloseButton
        isOpen={isApproveModalOpen}
        size="md"
        onOpenChange={handleApproveModalOpenChange}
      >
        <ModalContent className="bg-content1">
          <ModalHeader className="flex flex-col gap-1 pb-0 pt-6">
            <h2 className="text-lg font-bold text-foreground">Aprovar solicitação?</h2>
          </ModalHeader>
          <ModalBody className="pt-2 pb-6">
            <p className="text-sm leading-relaxed text-default-400">
              O usuário{" "}
              <span className="font-bold text-foreground">
                {analysisRequest?.userBenchmark?.name || requesterName}
              </span>{" "}
              será notificado de que sua solicitação foi aprovada. Deseja continuar?
            </p>
          </ModalBody>
          <ModalFooter className="justify-end gap-2 py-4">
            <Button radius="md" onPress={() => setIsApproveModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="primary"
              radius="md"
              isLoading={isPatchingStatus}
              onPress={handleConfirmApprove}
            >
              Sim, aprovar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
