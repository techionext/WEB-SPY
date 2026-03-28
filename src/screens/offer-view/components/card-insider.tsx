"use client";

import {
  useGetAnalysisRequestByIdQuery,
  useUpdateAnalysisRequestMutation,
  type IAnalysisRequestGetByIdDTO,
} from "@/services/analysis-request/analysis-request.service";
import { useFileSignedUrlMutation } from "@/services/file/file.service";
import { Avatar, Button, Card, CardBody, CardHeader, Chip, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

function CompactEmpty({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-default-200 bg-content2/20 py-4 px-3 text-center gap-1.5">
      <Icon icon={icon} width={22} height={22} className="text-default-400" />
      <p className="text-xs font-medium text-foreground">{title}</p>
      <p className="text-[11px] text-default-500 leading-snug max-w-[240px]">{description}</p>
    </div>
  );
}

const STATUS_LABEL: Record<
  "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED",
  string
> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  COMPLETED: "Concluido",
  FAILED: "Falhou",
  CANCELLED: "Cancelado",
};

type CardInsiderProps = {
  analysisRequestId: string;
};

export const CardInsider = ({ analysisRequestId }: CardInsiderProps) => {
  const { data, isLoading } = useGetAnalysisRequestByIdQuery(
    { id: analysisRequestId },
    { skip: !analysisRequestId },
  );
  const [updateAnalysisRequest, { isLoading: isUpdatingAnalysisRequest }] =
    useUpdateAnalysisRequestMutation();
  const [fileSignedUrl, { isLoading: isSigningFileUrl }] = useFileSignedUrlMutation();

  const request = data as IAnalysisRequestGetByIdDTO.Result | undefined;

  const handleDownloadFile = (fileId: string) => {
    fileSignedUrl({ id: fileId })
      .unwrap()
      .then((response) => {
        if (response?.url) window.open(response.url, "_blank");
      });
  };
  const isCompleted = request?.status === "COMPLETED";
  const isSimpleRequest = request?.type === "SIMPLE";
  const insiderAvatarUrl = request?.userInsider?.avatar?.url?.trim();

  const handleRequestAdvanced = () => {
    if (!request) return;
    updateAnalysisRequest({
      id: request.id,
      type: "ADVANCED",
    });
  };

  if (!isLoading && !request) {
    return (
      <CompactEmpty
        title="Nenhuma análise insider"
        description="Ainda não há dados de análise para esta oferta."
        icon="solar:document-bold-duotone"
      />
    );
  }

  return (
    <Card className="card flex flex-col gap-3 p-6">
      <CardHeader className="flex flex-col gap-3 p-0">
        <div className="flex items-start justify-between gap-3 w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              src={insiderAvatarUrl || undefined}
              icon={
                <Icon
                  icon="solar:user-linear"
                  width={24}
                  height={24}
                  className="text-default-500"
                />
              }
              radius="lg"
              classNames={{
                base: "h-14 w-14 min-h-14 min-w-14 shrink-0",
                img: "object-cover",
              }}
            />
            <div className="flex flex-col min-w-0">
              <p className="text-base font-semibold truncate">
                {request?.userInsider?.name ?? "-"}
              </p>
              <p className="text-xs text-default-500 truncate">
                {request?.userInsider?.email ?? "-"}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  classNames={{ content: "px-1 text-[11px]" }}
                >
                  {request?.status ? STATUS_LABEL[request.status] : "Pendente"}
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  color="warning"
                  classNames={{ content: "px-1 text-[11px]" }}
                >
                  {request?.type === "ADVANCED" ? "Avançada" : "Simples"}
                </Chip>
                <div className="flex items-center gap-1">
                  <Icon
                    icon="solar:calendar-linear"
                    width={12}
                    height={12}
                    className="text-default-500"
                  />
                  <p className="text-[11px] text-default-500">
                    {request?.createdAt ? dayjs(request.createdAt).format("DD/MM/YYYY") : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {isSimpleRequest ? (
            <Button
              size="sm"
              color="primary"
              variant="flat"
              radius="md"
              className="shrink-0 font-medium"
              onPress={handleRequestAdvanced}
              isLoading={isUpdatingAnalysisRequest}
            >
              Solicitar Análise avançada
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-3 p-0 pt-1">
        <div className="flex flex-col gap-2">
          <p className="text-sm ">Descrição</p>
          <Textarea
            className="text-sm text-default-400"
            isReadOnly
            value={request?.description || "Sem descrição"}
          />
        </div>
        {isCompleted ? (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm ">URL da Biblioteca</p>
              <div
                className="flex items-center gap-2 bg-content2/40 hover:bg-content2/70 rounded-md p-3 cursor-pointer"
                onClick={() => request?.libraryUrl && window.open(request.libraryUrl, "_blank")}
              >
                <Icon icon="solar:link-linear" width={16} height={16} className="text-primary" />
                <p className="text-sm text-primary cursor-pointer">{request?.libraryUrl ?? "-"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Arquivos disponíveis</p>
              {request?.file?.length ? (
                <div className="flex flex-col gap-2">
                  {request.file.map((file) => (
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
                <CompactEmpty
                  title="Nenhum arquivo disponível"
                  description="Nenhum arquivo disponível"
                  icon="solar:file-linear"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm ">Observação ({request?.userBenchmark?.name || "-"} disse:)</p>
              <Textarea
                className="text-sm text-default-400"
                isReadOnly
                value={request?.observation || "Sem observacao"}
              />
            </div>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
};
