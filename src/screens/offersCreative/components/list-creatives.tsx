import { Empty } from "@/components/empty/empty";
import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { useParams, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { CreativeLabsCardsSkeleton } from "./creative-skeleton-cards";
import { CardCreative } from "@/screens/creatives/components/card-creative";
import { useState } from "react";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { EditModal } from "@/screens/creatives/components/edit-modal/edit-modal";
import { useDeleteLabsCreativeMutation } from "@/services/creative/creative.service";
import { ModalRemove } from "@/components/modal-remove/modal-remove";

import { ModalView } from "@/screens/creatives/components/modal-view";

export const ListCreatives = () => {
  const [selectedCreative, setSelectedCreative] = useState<ILabsCreative | null>(null);
  const [selectedCreativeForView, setSelectedCreativeForView] = useState<ILabsCreative | null>(
    null,
  );
  const [selectedTab, setSelectedTab] = useState<"edit" | "history">("edit");
  const [removeCreativeId, setRemoveCreativeId] = useState<string>("");

  const [deleteCreative, { isLoading: isDeleting }] = useDeleteLabsCreativeMutation();
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetLabsCreativeQuery(
    {
      ...params,
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize || "6"),
      offerId: id ? [String(id)] : undefined,
    },
    { skip: !id },
  );

  return (
    <div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="grid grid-cols-2 gap-4">
        {data?.data.length === 0 ? (
          <div className="col-span-5">
            <Empty description="Não existem criativos para esta oferta" isLoading={isLoading} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <CreativeLabsCardsSkeleton key={index} />)
        ) : (
          data?.data?.map((item) => (
            <div key={item.id}>
              <CardCreative
                creative={item}
                onEdit={(tab) => {
                  setSelectedCreative(item);
                  if (tab) setSelectedTab(tab);
                }}
                onView={() => setSelectedCreativeForView(item)}
                onDelete={() => setRemoveCreativeId(item.id)}
              />
            </div>
          ))
        )}
      </div>
      <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"9"} />
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
