"use client";

import {
  useGetAnalysisRequestByIdQuery,
  useUpdateAnalysisRequestMutation,
  type IAnalysisRequestGetByIdDTO,
} from "@/services/analysis-request/analysis-request.service";
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

  const request = data as IAnalysisRequestGetByIdDTO.Result | undefined;
  const isCompleted = request?.status === "COMPLETED";
  const isSimpleRequest = request?.type === "SIMPLE";

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
    <Card className="card flex flex-col gap-3 p-3">
      <CardHeader className="flex flex-col gap-3 p-0">
        <div className="flex items-start justify-between gap-3 w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar
              src={request?.userInsider?.avatar?.url ?? "https://placehold.co/48x48"}
              radius="lg"
              classNames={{
                base: "h-11 w-11 min-h-11 min-w-11 shrink-0",
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
        <div className="flex items-center gap-2.5 rounded-medium bg-content2/60 p-2.5 min-w-0">
          <Avatar
            src={request?.offer?.image?.url ?? "https://placehold.co/48x48"}
            radius="md"
            classNames={{
              base: "h-11 w-11 min-h-11 min-w-11 shrink-0",
              img: "object-cover",
            }}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-semibold leading-snug line-clamp-2">
              {request?.offer?.title ?? "-"}
            </p>
            {request?.title ? (
              <p className="text-xs text-default-400 line-clamp-1">{request.title}</p>
            ) : null}
          </div>
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
              <p className="text-sm ">Arquivos Disponíveis</p>
              {request?.file?.length ? (
                request.file.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 bg-content2/40 hover:bg-content2/70 rounded-md p-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon
                        icon="solar:file-linear"
                        width={16}
                        height={16}
                        className="text-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-primary">{file.originalName}</p>
                      <p className="text-xs text-default-400">{file.size} KB</p>
                    </div>
                  </div>
                ))
              ) : (
                <CompactEmpty
                  title="Nenhum arquivo"
                  description="Nenhum arquivo foi anexado a esta análise."
                  icon="solar:file-linear"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm ">Observação</p>
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
