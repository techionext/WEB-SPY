import { useState } from "react";
import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { CardCreative } from "./card-creative";
import { SkeletonCreative } from "./skeleton-creative";
import { EditModal } from "./edit-modal/edit-modal";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { Pagination } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { useDeleteLabsCreativeMutation } from "@/services/creative/creative.service";

export const ListCreatives = () => {
  const params = useSearchParams();
  const queryParams = Object.fromEntries(params.entries());
  const { data, isLoading } = useGetLabsCreativeQuery({
    pageSize: Number(queryParams.pageSize) || 6,
    page: Number(queryParams.page) || 1,
    ...queryParams,
  });
  const [selectedCreative, setSelectedCreative] = useState<ILabsCreative | null>(null);
  const [selectedTab, setSelectedTab] = useState<"edit" | "history">("edit");
  const [removeCreativeId, setRemoveCreativeId] = useState<string>("");

  const [deleteCreative, { isLoading: isDeleting }] = useDeleteLabsCreativeMutation();

  return (
    <div className="flex flex-col justify-between gap-2 h-full">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCreative key={index} />)
          : data?.data.map((item) => (
              <CardCreative
                key={item.id}
                creative={item}
                onEdit={(tab) => {
                  setSelectedCreative(item);
                  if (tab) setSelectedTab(tab);
                }}
                onDelete={() => setRemoveCreativeId(item.id)}
              />
            ))}
      </div>
      <Pagination defaultPageSize={"6"} total={data?.meta.totalPages || 0} />

      {selectedCreative && (
        <EditModal
          creative={selectedCreative}
          isOpen={!!selectedCreative}
          onClose={() => setSelectedCreative(null)}
          initialTab={selectedTab}
        />
      )}

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
