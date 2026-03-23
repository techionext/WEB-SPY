import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Image,
  CardFooter,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";
import { ISpyOffer } from "@/types/spy/spy-offers.type";

type OfferStatCard = {
  icon: string;
  label: string;
  getValue: (data: ISpyOffer) => React.ReactNode;
  valueClassName?: string;
};

// TODO: Validar se vai remover ou adicionar outra coisa no lugar
// const OFFER_STAT_CARDS: OfferStatCard[] = [
//   {
//     icon: "solar:gallery-outline",
//     label: "Criativos",
//     getValue: (d) => d.totalCreatives,
//   },
//   {
//     icon: "solar:videocamera-outline",
//     label: "VSL",
//     getValue: (d) => d.totalVsl,
//   },
//   {
//     icon: "solar:global-outline",
//     label: "Landing",
//     getValue: (d) => d.totalPages,
//   },
//   {
//     icon: "solar:graph-up-outline",
//     label: "Conversão",
//     getValue: (d) => formatCurrency(d.cpa, false, d.currency),
//     valueClassName: "text-success",
//   },
// ];

type Props = {
  data: ISpyOffer;
  onFavorite: (id: string) => void;
  isFavoriting?: boolean;
  onRemove: (id: string) => void;
};

export const CardOfferLabs = ({ data, onFavorite, onRemove }: Props) => {
  const router = useRouter();
  const { user } = useSession();
  const canEdit = user?.platformRole === "ROOT" || user?.platformRole === "ADMIN";

  const REQUEST_STATUS_LABELS: Record<string, { label: string; color: any; className: string }> = {
    PENDING: {
      label: "Pendente",
      color: "warning",
      className: "text-warning",
    },
    APPROVED: {
      label: "Aprovado",
      color: "success",
      className: "text-success",
    },
    REJECTED: {
      label: "Rejeitado",
      color: "danger",
      className: "text-danger",
    },
    NOT_AFFILIATED: {
      label: "Não afiliado",
      color: "default",
      className: "text-default-500",
    },
  };

  return (
    <Card
      as="div"
      isPressable
      className="card transition-all hover:scale-[1.01]"
      onPress={() => router.push(`/offers/${data.id}`)}
    >
      <CardHeader className="p-0 relative">
        <Image
          src={data?.image?.url ?? "https://placehold.co/600x400"}
          alt={data.title}
          radius="none"
          className="w-full h-[220px] object-cover rounded-t-lg"
          removeWrapper
        />

        <Chip
          size="sm"
          className="absolute text-xs z-50 top-2 left-2"
          color={REQUEST_STATUS_LABELS[status].color}
          variant="flat"
        >
          {REQUEST_STATUS_LABELS[status].label}
        </Chip>

        <div className="absolute z-50 top-2 right-2">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                className="bg-gray-400/40 hover:bg-gray-400/60"
                aria-label="Ações"
              >
                <Icon
                  icon="solar:menu-dots-bold"
                  className="text-gray-100 rotate-90 hover:text-gray-200/80 transition-colors"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ações da oferta">
              <DropdownItem
                key="favorite"
                startContent={
                  <Icon
                    icon={data?.isFavorite ? "solar:heart-bold" : "solar:heart-outline"}
                    width={18}
                    className={data?.isFavorite ? "text-red-500" : ""}
                  />
                }
                onPress={() => onFavorite(data.id)}
              >
                {data?.isFavorite ? "Remover dos favoritos" : "Favoritar"}
              </DropdownItem>
              <DropdownItem
                key="edit"
                isDisabled={!canEdit}
                startContent={<Icon icon="solar:pen-bold-duotone" width={18} />}
                onPress={() => router.push(`/offers/${data.id}/edit`)}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                key="delete"
                isDisabled={!canEdit}
                className="text-danger"
                color="danger"
                startContent={<Icon icon="solar:trash-bin-trash-bold-duotone" width={18} />}
                onPress={() => onRemove(data.id)}
              >
                Excluir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>

      <CardBody className="gap-2">
        <h4 className="text-sm font-semibold line-clamp-1">{data.title}</h4>

        <div className="flex flex-wrap gap-2">
          <Chip size="sm" variant="flat" color="primary">
            {data.category.title}
          </Chip>

          <Chip size="sm" variant="flat" color="primary">
            {data.typeProduct}
          </Chip>
          {/* // TODO: Validar se vai remover ou adicionar outra coisa no lugar */}
          {/* <Chip size="sm" variant="flat" color="default">
            {platformValues[data.platform]}
          </Chip> */}
        </div>
        {/* // TODO: Validar se vai remover ou adicionar outra coisa no lugar */}
        {/* <div className="grid grid-cols-2 gap-2">
          {OFFER_STAT_CARDS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-content2"
            >
              <div className="flex items-center text-xs text-default-400">
                <Icon icon={item.icon} width={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-default-400">{item.label}</span>
                <span
                  className={`text-sm font-medium${item.valueClassName ? ` ${item.valueClassName}` : ""}`}
                >
                  {item.getValue(data)}
                </span>
              </div>
            </div>
          ))}
        </div> */}
      </CardBody>
      <CardFooter>
        <Button
          size="sm"
          variant="solid"
          radius="full"
          onPress={() => router.push(`/offers/${data.id}`)}
          className="w-full bg-linear-to-r from-primary to-primary/50"
        >
          Ver oferta
        </Button>
      </CardFooter>
    </Card>
  );
};
