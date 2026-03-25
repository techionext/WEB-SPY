import { useOfferList } from "../use-offer-list";
import { useState } from "react";
import {
  useRemoveSpyOfferMutation,
  usePostSpyOfferFavoriteMutation,
} from "@/services/spy/spy-offers.service";
import { CardOfferLabs } from "./card-offer-labs";
import { Pagination } from "@/components/pagination";
import { CardOfferLabsSkeleton } from "./card-skeleton-offer";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { ISpyOffer } from "@/types/spy/spy-offers.type";
import { Filter } from "./filter";

export const OfferList = () => {
  const { data, isLoading, defaultPageSize } = useOfferList();
  const [removeOfferId, setRemoveOfferId] = useState<string>("");
  const [favoritingId, setFavoritingId] = useState<string | null>(null);
  const [removeOffer, { isLoading: isRemovingOffer }] = useRemoveSpyOfferMutation();
  const [favoriteOffer] = usePostSpyOfferFavoriteMutation();

  const handleFavorite = async (offerId: string) => {
    setFavoritingId(offerId);
    try {
      await favoriteOffer({ id: offerId }).unwrap();
    } catch {
    } finally {
      setFavoritingId(null);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => <CardOfferLabsSkeleton key={index} />)
            : data?.data?.map((item: ISpyOffer) => (
                <CardOfferLabs
                  key={item.id}
                  data={item}
                  onFavorite={handleFavorite}
                  isFavoriting={favoritingId === item.id}
                  onRemove={() => setRemoveOfferId(item.id)}
                />
              ))}
        </div>
        <Pagination
          total={data?.meta?.totalPages ?? 0}
          defaultPageSize={defaultPageSize.toString()}
        />
      </div>
      <Filter />

      {removeOfferId && (
        <ModalRemove
          title="Excluir oferta"
          isOpen={!!removeOfferId}
          onOpenChange={() => setRemoveOfferId("")}
          onRemove={() =>
            removeOffer({ id: removeOfferId })
              .unwrap()
              .then(() => setRemoveOfferId(""))
          }
          isLoading={isRemovingOffer}
          text="Tem certeza que deseja excluir a oferta?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
        />
      )}
    </div>
  );
};
