import {
  IAnalysisRequest,
  useGetAnalysisRequestQuery,
} from "@/services/analysis-request/analysis-request.service";
import { Avatar, Card, CardBody, Chip, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { EmptyContent } from "@/components/empty/empty-content";

const STATUS_LABEL = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  COMPLETED: "Concluido",
  FAILED: "Falhou",
  CANCELLED: "Cancelado",
} as const;

export const ItemCard = ({ handleOpen }: { handleOpen: (id: string) => void }) => {
  const { data, isLoading } = useGetAnalysisRequestQuery({
    viewType: "BENCHMARK",
    page: 1,
    pageSize: 100,
  });
  const getStatusLabel = (status?: keyof typeof STATUS_LABEL | string) =>
    (status && STATUS_LABEL[status as keyof typeof STATUS_LABEL]) || status || "Pendente";

  const hasItems = (data?.data?.length ?? 0) > 0;

  if (!isLoading && !hasItems) {
    return (
      <EmptyContent
        icon="solar:document-bold-duotone"
        title="Nenhuma solicitação encontrada"
        description="Quando você fizer uma solicitação, ela aparecerá aqui."
        containerClassName="py-10"
      />
    );
  }

  return data?.data.map((order: IAnalysisRequest) => (
    <Card
      key={order.id}
      isPressable
      className="bg-content2/40 shadow-none p-2 hover:bg-content3/50 transition-all duration-300 cursor-pointer"
      onPress={() => handleOpen(order.id)}
    >
      <CardBody>
        <div className="flex items-center gap-4">
          <Avatar
            src={order.offer?.image?.url ?? order.image?.url ?? "https://placehold.co/54x54"}
            radius="md"
            classNames={{
              base: "h-20 w-20 min-h-20 min-w-20 shrink-0",
              img: "object-cover",
            }}
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{order.title}</h3>
            <div className="flex gap-2">
              <Chip size="sm" variant="flat" color="primary">
                {getStatusLabel(order.status)}
              </Chip>
              <Chip size="sm" variant="flat" color="success">
                Em análise
              </Chip>
            </div>
            <div className="flex gap-4">
              <Tooltip
                content={
                  <div className="flex items-center gap-2 p-2">
                    {order.user.avatar?.url ? (
                      <img
                        src={order.user.avatar.url}
                        alt={order.user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-content3 flex items-center justify-center">
                        <Icon
                          icon="solar:user-linear"
                          width={16}
                          height={16}
                          className="text-gray-500"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500">{order.user.name}</p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </div>
                  </div>
                }
              >
                <div className="flex items-center gap-1">
                  <Icon icon="solar:user-linear" width={12} height={12} className="text-gray-500" />
                  <p className="text-xs text-gray-500">{order.user.name}</p>
                </div>
              </Tooltip>
              <div className="flex items-center gap-1">
                <Icon
                  icon="solar:calendar-linear"
                  width={12}
                  height={12}
                  className="text-gray-500"
                />
                <p className="text-xs text-gray-500">
                  {dayjs(order.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="solar:file-linear" width={12} height={12} className="text-gray-500" />
                <p className="text-xs text-gray-500">{order.totalFiles} arquivos</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  ));
};
