"use client";
import { useGetSpyOfferByIdQuery } from "@/services/spy/spy-offers.service";
import { Button, Card, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useParams, usePathname, useRouter } from "next/navigation";

export const OffersNavigation = () => {
  const { id } = useParams<{ id: string }>();
  const { data: offer } = useGetSpyOfferByIdQuery({ id: id as string }, { skip: !id });
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Card className="rounded-lg p-4 card flex flex-col gap-4 shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">
          {offer?.title ? offer.title : "Nova Oferta"}
        </h3>
        {offer?.description && (
          <p className="text-sm text-default-500 truncate max-w-[250px]">{offer?.description}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className={cn(
            "items-center flex gap-2 justify-start",
            pathname === `/offers/${id}/edit` && "bg-default-100",
          )}
          color="default"
          radius="lg"
          onPress={() => (offer?.id ? router.push(`/offers/${id}/edit`) : undefined)}
        >
          <Icon icon="solar:box-bold-duotone" className="text-primary" width={16} />
          Detalhes
        </Button>
        <Button
          color="default"
          radius="lg"
          isDisabled={!offer?.id}
          className={cn(
            "justify-between",
            pathname === `/offers/${id}/creative` && "bg-default-100",
          )}
          onPress={() => router.push(`/offers/${id}/creative`)}
        >
          <div className="flex items-center gap-2">
            <Icon icon="solar:gallery-bold-duotone" className="text-secondary" width={16} />
            Criativos
          </div>
          {!offer?.id && <Icon icon="solar:lock-bold-duotone" width={16} />}
        </Button>
        <Button
          color="default"
          radius="lg"
          isDisabled={!offer?.id}
          className={cn("justify-between", pathname === `/offers/${id}/pages` && "bg-default-100")}
          onPress={() => router.push(`/offers/${id}/pages`)}
        >
          <div className="flex items-center gap-2">
            <Icon icon="solar:document-bold-duotone" className="text-warning" width={16} />
            Páginas
          </div>
          {!offer?.id && <Icon icon="solar:lock-bold-duotone" width={16} />}
        </Button>
        <Button
          color="default"
          radius="lg"
          isDisabled={!offer?.id}
          className={cn("justify-between", pathname === `/offers/${id}/vsls` && "bg-default-100")}
          onPress={() => router.push(`/offers/${id}/vsls`)}
        >
          <div className="flex items-center gap-2">
            <Icon icon="solar:videocamera-record-bold-duotone" className="text-danger" width={16} />
            VSLs
          </div>
          {!offer?.id && <Icon icon="solar:lock-bold-duotone" width={16} />}
        </Button>
      </div>
    </Card>
  );
};
