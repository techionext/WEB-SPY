"use client";
import { Header } from "@/components/header";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { CreateOffer } from "./components/createOffer";
import { OffersNavigation } from "@/components/offers-navigation/offers-navigation";

export const ScreenOffersCreate = () => {
  const { back } = useRouter();
  return (
    <div className="flex gap-4 grow flex-col">
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          onPress={() => back()}
          startContent={<Icon icon="solar:arrow-left-bold" />}
        />
        <Header title="Nova Oferta" description="Preencha as informações para criar sua oferta" />
      </div>
      <div className="flex gap-6 w-full">
        <CreateOffer />
        <OffersNavigation />
      </div>
    </div>
  );
};
