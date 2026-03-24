import { useCreativeList } from "../use-creative-list";
import { CardCreative } from "./card-creative";
import { SkeletonCreative } from "./skeleton-creative";
import { EditModal } from "./edit-modal/edit-modal";
import { Pagination } from "@/components/pagination";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { useDeleteLabsCreativeMutation } from "@/services/creative/creative.service";
import { EmptyContent } from "@/components/empty/empty-content";
import { CreateModal } from "./create-modal/create-modal";
import { ModalView } from "./modal-view";
import { useState } from "react";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { FilterCreative } from "./filter";

export const ListCreatives = () => {
  const { data, isLoading } = useCreativeList();
  const [selectedCreative, setSelectedCreative] = useState<ILabsCreative | null>(null);
  const [selectedCreativeForView, setSelectedCreativeForView] = useState<ILabsCreative | null>(
    null,
  );
  const [selectedTab, setSelectedTab] = useState<"edit" | "history">("edit");
  const [removeCreativeId, setRemoveCreativeId] = useState<string>("");

  const [deleteCreative, { isLoading: isDeleting }] = useDeleteLabsCreativeMutation();

  const creatives = data?.data;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 flex flex-col justify-between gap-4 h-full">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCreative key={index} />)
            : creatives?.map((item) => (
                <CardCreative
                  key={item.id}
                  creative={item}
                  onEdit={(tab) => {
                    setSelectedCreative(item);
                    if (tab) setSelectedTab(tab);
                  }}
                  onDelete={() => setRemoveCreativeId(item.id)}
                  onView={() => setSelectedCreativeForView(item)}
                />
              ))}
          {creatives?.length === 0 && !isLoading && (
            <div className="col-span-full py-10">
              <EmptyContent
                title="Nenhum criativo encontrado"
                description="Você ainda não possui criativos cadastrados nesta oferta. Comece criando o seu primeiro criativo."
                actionLabel="Criar primeiro criativo"
                icon="solar:gallery-minimalistic-bold"
                onAction={<CreateModal />}
              />
            </div>
          )}
        </div>
        <Pagination defaultPageSize={"6"} total={data?.meta.totalPages || 0} />
      </div>

      <FilterCreative />

      {selectedCreative && (
        <EditModal
          creative={selectedCreative}
          isOpen={!!selectedCreative}
          onClose={() => setSelectedCreative(null)}
          initialTab={selectedTab}
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
          onOpenChange={() => setRemoveCreativeId("")}
          onRemove={() => {
            deleteCreative({ id: removeCreativeId })
              .unwrap()
              .then(() => setRemoveCreativeId(""));
          }}
          title="Excluir criativo"
          text="Tem certeza que deseja excluir o criativo?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
