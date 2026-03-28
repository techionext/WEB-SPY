"use client";

import {
  Avatar,
  Button,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import {
  IAnalysisRequestGetByIdDTO,
  usePatchAnalysisRequestMutation,
} from "@/services/analysis-request/analysis-request.service";
import { useFileSignedUrlMutation } from "@/services/file/file.service";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { EmptyContent } from "@/components/empty/empty-content";
import dayjs from "dayjs";

export type SolicitationStatus = "pending" | "approved";
type ApiSolicitationStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

const STATUS_LABEL: Record<ApiSolicitationStatus, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  COMPLETED: "Concluido",
  FAILED: "Falhou",
  CANCELLED: "Cancelado",
};

export type DrawerEditProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  analysisRequest?: IAnalysisRequestGetByIdDTO.Result;
  isLoading?: boolean;
  requesterName?: string;
};

export const DrawerEdit = ({
  isOpen,
  onOpenChange,
  analysisRequest,
  isLoading = false,
  requesterName = "Carlos Mendes",
}: DrawerEditProps) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [patchAnalysisRequest, { isLoading: isPatchingStatus }] = usePatchAnalysisRequestMutation();
  const [fileSignedUrl, { isLoading: isSigningFileUrl }] = useFileSignedUrlMutation();
  const fallbackImageUrl =
    analysisRequest?.offer?.image?.url ??
    (analysisRequest as { image?: { url?: string } } | undefined)?.image?.url ??
    "https://placehold.co/54x54";

  const isCancelled = analysisRequest?.status === "CANCELLED";

  const handleConfirmApprove = () => {
    if (!analysisRequest?.id) return;
    patchAnalysisRequest({
      id: analysisRequest.id,
      status: "CANCELLED",
    });
    setIsApproveModalOpen(false);
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "Pendente";
    return STATUS_LABEL[status as ApiSolicitationStatus] ?? status;
  };

  const handleApproveModalOpenChange = (open: boolean) => {
    setIsApproveModalOpen(open);
  };

  const handleDownloadFile = (fileId: string) => {
    fileSignedUrl({ id: fileId })
      .unwrap()
      .then((response) => {
        if (response?.url) window.open(response.url, "_blank");
      });
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
          <DrawerHeader className="flex justify-between items-center gap-1 ">
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
                    {getStatusLabel(analysisRequest?.status)}
                  </Chip>
                </div>
                <p className="text-sm text-default-400">
                  Data da solicitação:{" "}
                  <span className=" text-foreground">
                    {dayjs(analysisRequest?.createdAt || "").format("DD/MM/YYYY")}
                  </span>
                </p>
              </div>
            </div>
          </DrawerHeader>
          <DrawerBody className="py-4 px-6 gap-6">
            <section className="flex flex-col gap-5 rounded-xl border border-default-200/40 bg-content2/20 p-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  O que foi informado ao insider
                </p>
                <p className="text-sm text-default-500">
                  Dados enviados na abertura da solicitação
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">Descrição</p>
                <Textarea
                  className="text-sm text-default-400"
                  isReadOnly
                  value={analysisRequest?.description || "Sem descrição"}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">URL da Biblioteca</p>
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

              {analysisRequest?.offer ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-foreground">Dados da Oferta</p>
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={analysisRequest?.offer?.image?.url ?? "https://placehold.co/80x80"}
                      size="lg"
                      radius="md"
                      classNames={{
                        base: "h-20 w-20 min-h-20 min-w-20 shrink-0",
                        img: "object-cover",
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-bold">{analysisRequest?.offer?.title || "-"}</h2>
                      <p className="text-sm text-default-400">{analysisRequest?.title || "-"}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <Divider className="bg-default-200/60" />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">Participantes</p>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <div className="rounded-xl border border-default-200/50 bg-content2/40 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-default-500 mb-2">
                      Solicitante
                    </p>
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={
                          analysisRequest?.userInsider?.avatar?.url ?? "https://placehold.co/54x54"
                        }
                        radius="md"
                        classNames={{
                          base: "h-12 w-12 min-h-12 min-w-12 shrink-0",
                          img: "object-cover",
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {analysisRequest?.userInsider?.name || "-"}
                        </p>
                        <p className="text-xs text-default-400 truncate">
                          {analysisRequest?.userInsider?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon
                      icon="solar:alt-arrow-right-line-duotone"
                      width={16}
                      height={16}
                      className="text-primary"
                    />
                  </div>

                  <div className="rounded-xl border border-default-200/50 bg-content2/40 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-default-500 mb-2">
                      Analista
                    </p>
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={
                          analysisRequest?.userBenchmark?.avatar?.url ??
                          "https://placehold.co/54x54"
                        }
                        radius="md"
                        classNames={{
                          base: "h-12 w-12 min-h-12 min-w-12 shrink-0",
                          img: "object-cover",
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {analysisRequest?.userBenchmark?.name || "-"}
                        </p>
                        <p className="text-xs text-default-400 truncate">
                          {analysisRequest?.userBenchmark?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-5 rounded-xl border border-default-200/40 bg-content2/20 p-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-wider text-success">
                  Retorno do insider
                </p>
                <p className="text-sm text-default-500">
                  Arquivos e observações enviados pelo analista
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">Arquivos disponíveis</p>
                {analysisRequest?.file?.length ? (
                  <div className="flex flex-col gap-2">
                    {analysisRequest.file.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 bg-content2/40 hover:bg-content2/70 rounded-md p-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Avatar
                            src={file.url}
                            radius="md"
                            classNames={{
                              base: "h-10 w-10 min-h-10 min-w-10 shrink-0",
                              img: "object-cover",
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-primary">{file.originalName}</p>
                          <p className="text-xs text-default-400">{file.size}</p>
                        </div>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="ml-auto shrink-0"
                          isLoading={isSigningFileUrl}
                          onPress={() => handleDownloadFile(file.id)}
                        >
                          <Icon
                            icon="solar:download-linear"
                            width={16}
                            height={16}
                            className="text-primary"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyContent
                    title="Nenhum arquivo disponível"
                    description="Nenhum arquivo disponível"
                    icon="solar:file-linear"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">Observação: ({analysisRequest?.userBenchmark?.name || "-"} disse:)</p>
                <Textarea
                  className="text-sm text-default-400"
                  isReadOnly
                  value={analysisRequest?.observation || "Sem observação"}
                />
              </div>
            </section>
          </DrawerBody>
          <DrawerFooter>
            {!isCancelled && (
              <Button
                color="primary"
                radius="md"
                isLoading={isPatchingStatus}
                onPress={() => setIsApproveModalOpen(true)}
              >
                Cancelar solicitação
              </Button>
            )}
          </DrawerFooter>
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
            <h2 className="text-lg font-bold text-foreground">Cancelar solicitação?</h2>
          </ModalHeader>
          <ModalBody className="pt-2 pb-6">
            <p className="text-sm leading-relaxed text-default-400">
              O usuário{" "}
              <span className="font-bold text-foreground">
                {analysisRequest?.userBenchmark?.name || requesterName}
              </span>{" "}
              será notificado de que sua solicitação foi cancelada. Deseja continuar?
            </p>
          </ModalBody>
          <ModalFooter className="justify-end gap-2 py-4">
            <Button radius="md" onPress={() => setIsApproveModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="primary"
              radius="md"
              onPress={handleConfirmApprove}
              isLoading={isPatchingStatus}
            >
              Sim, cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
