import { Avatar, Card, CardBody, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

const orders = [
  {
    id: 1,
    name: "Carlos Mendes",
    status: "Em análise",
    type: "Em análise",
    files: 3,
    date: "24/03/2026",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    name: "João Silva",
    status: "Pendente",
    type: "Pendente",
    files: 3,
    date: "24/03/2026",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Maria Oliveira",
    status: "Pendente",
    type: "Pendente",
    files: 3,
    date: "24/03/2026",
    image: "https://picsum.photos/200/300",
  },
];

export const ItemCard = ({ handleOpen }: { handleOpen: () => void }) => {
  return orders.map((order: (typeof orders)[number]) => (
    <Card
      key={order.id}
      isPressable
      className="bg-content2/40 shadow-none p-2 hover:bg-content3/50 transition-all duration-300 cursor-pointer"
      onPress={handleOpen}
    >
      <CardBody>
        <div className="flex items-center gap-4">
          <Avatar
            src={order.image}
            radius="md"
            classNames={{
              base: "h-20 w-20 min-h-20 min-w-20 shrink-0",
              img: "object-cover",
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{order.name}</h3>
              <p className="text-xs text-gray-500">MTS-{order.id}</p>
            </div>
            <div className="flex gap-2">
              <Chip size="sm" variant="flat" color="primary">
                {order.status}
              </Chip>
              <Chip size="sm" variant="flat" color="success">
                Em análise
              </Chip>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Icon icon="solar:tag-linear" width={12} height={12} className="text-gray-500" />
                <p className="text-xs text-gray-500">{order.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <Icon
                  icon="solar:calendar-linear"
                  width={12}
                  height={12}
                  className="text-gray-500"
                />
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="solar:file-linear" width={12} height={12} className="text-gray-500" />
                <p className="text-xs text-gray-500">{order.files} arquivos</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  ));
};
