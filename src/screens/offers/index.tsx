"use client";

import { Header } from "@/components/header";
import { OfferList } from "./components/offer-list";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";

export const ScreenOffers = () => {
  const { push } = useRouter();
  const { user } = useSession();
  const isRoot = user?.platformRole === "ROOT" || user?.platformRole === "ADMIN";
  return (
    <div className="flex gap-4 grow flex-col">
      <div className="flex items-center justify-between">
        <Header title="Ofertas" description="Veja as ofertas que você está participando." />
        {isRoot && (
          <Button
            startContent={<Icon width={20} icon="solar:add-circle-bold" />}
            onPress={() => push("/offers/create")}
            color="primary"
          >
            Adiciona
          </Button>
        )}
      </div>
      <div className="flex  gap-4 grow w-full">
        <div className="flex flex-col gap-4 grow min-w-0">
          <OfferList />
        </div>
        {/* aside de filtros aqui */}
        {/* <OfferCommunity /> */}
      </div>
    </div>
  );
};
