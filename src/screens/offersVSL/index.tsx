"use client";
import { Header } from "@/components/header";
import { OffersNavigation } from "@/components/offers-navigation/offers-navigation";
import { CreateVSL } from "./components/modal/create-vsl";
import { ListVSL } from "./components/list-VSL";

export const ScreenOffersVSLS = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <Header title="VSLs" description="Gerencie os VSLs desta oferta" />
        <CreateVSL />
      </div>
      <div className="flex gap-4 w-full h-full">
        <ListVSL />
        <div className="w-[300px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
          <OffersNavigation />
        </div>
      </div>
    </div>
  );
};
