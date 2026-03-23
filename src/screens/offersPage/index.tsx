"use client";
import { Header } from "@/components/header";
import { OffersNavigation } from "@/components/offers-navigation/offers-navigation";
import { CreatePage } from "./components/modal/create-page";
import { ListPages } from "./components/list-pages";

export const ScreenOffersPage = () => {
  return (
    <div className="flex flex-col gap-4 grow">
      <div className="flex items-center justify-between">
        <Header title="Páginas" description="Gerencie as páginas desta oferta" />
        <CreatePage />
      </div>
      <div className="flex gap-4 w-full h-full">
        <ListPages />
        <div className="w-[300px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
          <OffersNavigation />
        </div>
      </div>
    </div>
  );
};
