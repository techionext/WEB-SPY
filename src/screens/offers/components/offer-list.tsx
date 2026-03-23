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

export const formatCurrencyUSD = (valueInCents?: number): string => {
  const valueInDollars = (valueInCents ?? 0) / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(valueInDollars);
};

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
    <>
      {!isLoading ? (
        <span className="text-sm text-default-500">{data?.meta?.total} ofertas encontradas</span>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => <CardOfferLabsSkeleton key={index} />)
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
    </>
  );
};
