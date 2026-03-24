"use client";

import { useState } from "react";
import { EmptyContent } from "@/components/empty/empty-content";
import { Pagination } from "@/components/pagination";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { useDeleteLabsCreativeMutation } from "@/services/creative/creative.service";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { useCreativeList } from "../use-creative-list";
import { CardCreative, type CardCreativeProps } from "./card-creative";
import { CreateModal } from "./create-modal/create-modal";
import { EditModal } from "./edit-modal/edit-modal";
import { FilterCreative } from "./filter";
import { ModalView } from "./modal-view";
import { SkeletonCreative } from "./skeleton-creative";

const OFFER_VIEW_PAGE_SIZE = 3;
const DEFAULT_PAGE_SIZE = 6;

type ListCreativesProps = {
  /** Quando definido, filtra criativos pela oferta (sobrescreve `offerId` na URL). */
  offerId?: string;
};

export const ListCreatives = ({ offerId: offerIdProp }: ListCreativesProps) => {
  const { data, isLoading } = useCreativeList(offerIdProp ? { offerId: offerIdProp } : undefined);
  const [selectedCreative, setSelectedCreative] = useState<ILabsCreative | null>(null);
  const [selectedCreativeForView, setSelectedCreativeForView] = useState<ILabsCreative | null>(
    null,
  );
  const [selectedTab, setSelectedTab] = useState<"edit" | "history">("edit");
  const [removeCreativeId, setRemoveCreativeId] = useState<string>("");

  const [deleteCreative, { isLoading: isDeleting }] = useDeleteLabsCreativeMutation();

  const creatives = data?.data;
  const isOfferView = Boolean(offerIdProp);
  const skeletonCount = isOfferView ? OFFER_VIEW_PAGE_SIZE : DEFAULT_PAGE_SIZE;
  const gridClassName = isOfferView
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
    : "grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";
  const fallbackPageSize = isOfferView ? OFFER_VIEW_PAGE_SIZE : DEFAULT_PAGE_SIZE;

  const listSection = (
    <div className={gridClassName}>
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => <SkeletonCreative key={index} />)
        : creatives?.map((item) => {
            const cardProps: CardCreativeProps = {
              creative: item,
              onDelete: () => setRemoveCreativeId(item.id),
              onEdit: (tab) => {
                setSelectedCreative(item);
                if (tab) setSelectedTab(tab);
              },
              onView: () => setSelectedCreativeForView(item),
            };
            return <CardCreative key={item.id} {...cardProps} />;
          })}
      {!isOfferView && creatives?.length === 0 && !isLoading ? (
        <div className="col-span-full py-10">
          <EmptyContent
            actionLabel="Criar primeiro criativo"
            description="Você ainda não possui criativos cadastrados. Comece criando o seu primeiro criativo."
            icon="solar:gallery-minimalistic-bold"
            onAction={<CreateModal />}
            title="Nenhum criativo encontrado"
          />
        </div>
      ) : null}
      {isOfferView && creatives?.length === 0 && !isLoading ? (
        <div className="col-span-full py-10 [&_div]:py-0">
          <EmptyContent
            title="Nenhum criativo na oferta"
            description="Ainda não há criativos vinculados a esta oferta."
            icon="solar:gallery-minimalistic-bold"
          />
        </div>
      ) : null}
    </div>
  );

  const pagination = (
    <Pagination defaultPageSize={String(fallbackPageSize)} total={data?.meta.totalPages || 0} />
  );

  if (isOfferView) {
    return (
      <div className="flex h-full flex-col justify-between gap-2">
        {listSection}
        {pagination}

        {selectedCreative && (
          <EditModal
            creative={selectedCreative}
            initialTab={selectedTab}
            isOpen={!!selectedCreative}
            onClose={() => setSelectedCreative(null)}
          />
        )}

        <ModalView
          creative={selectedCreativeForView}
          isOpen={!!selectedCreativeForView}
          onOpenChange={() => setSelectedCreativeForView(null)}
        />

        {!!removeCreativeId && (
          <ModalRemove
            isOpen={!!removeCreativeId}
            isLoading={isDeleting}
            text="Tem certeza que deseja excluir o criativo?"
            textButtonCancel="Cancelar"
            textButtonConfirm="Excluir"
            title="Excluir criativo"
            onOpenChange={() => setRemoveCreativeId("")}
            onRemove={() => {
              deleteCreative({ id: removeCreativeId })
                .unwrap()
                .then(() => setRemoveCreativeId(""));
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <div className="flex h-full flex-1 flex-col justify-between gap-4">
        {listSection}
        {pagination}
      </div>

      <FilterCreative />

      {selectedCreative && (
        <EditModal
          creative={selectedCreative}
          initialTab={selectedTab}
          isOpen={!!selectedCreative}
          onClose={() => setSelectedCreative(null)}
        />
      )}

      <ModalView
        creative={selectedCreativeForView}
        isOpen={!!selectedCreativeForView}
        onOpenChange={() => setSelectedCreativeForView(null)}
      />

      {!!removeCreativeId && (
        <ModalRemove
          isOpen={!!removeCreativeId}
          isLoading={isDeleting}
          text="Tem certeza que deseja excluir o criativo?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          title="Excluir criativo"
          onOpenChange={() => setRemoveCreativeId("")}
          onRemove={() => {
            deleteCreative({ id: removeCreativeId })
              .unwrap()
              .then(() => setRemoveCreativeId(""));
          }}
        />
      )}
    </div>
  );
};
