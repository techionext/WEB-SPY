import { Header } from "@/components/header";
import { EditOffer } from "./components/editOffer";
import { OffersNavigation } from "@/components/offers-navigation/offers-navigation";

export const ScreenOffersEdit = () => {
  return (
    <div className="flex flex-col gap-4">
      <Header title="Editar Oferta" description="Preencha as informações para editar sua oferta" />
      <div className="flex gap-6 w-full">
        <EditOffer />
        <div className="w-[300px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
          <OffersNavigation />
        </div>
      </div>
    </div>
  );
};
