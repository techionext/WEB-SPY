"use client";
import { Header } from "@/components/header";
import { OffersNavigation } from "@/components/offers-navigation/offers-navigation";
import { ListCreatives } from "./components/list-creatives";
import { CreateCreative } from "./components/modal/create-creative";

export const ScreenOffersCreative = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <Header title="Criativos" description="Gerencie os criativos desta oferta" />
        <CreateCreative />
      </div>
      <div className="flex gap-4 w-full h-full">
        <ListCreatives />
        <div className="w-[300px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
          <OffersNavigation />
        </div>
      </div>
    </div>
  );
};
