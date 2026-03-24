"use client";
import { useState } from "react";
import {
  useGetLabsVSLSQuery,
  useDeleteLabsVSLMutation,
} from "@/services/labs/vsls/labs-vsls.service";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { SkeletonVsl } from "./skeleton-vsl";
import { VslCard } from "./vsl-card";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import { ModalPlayer } from "./modal-player";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { EditVSL } from "./edit-modal/edit-modal";
import { EmptyContent } from "@/components/empty/empty-content";
import { CreateVSL } from "./create-modal/create-modal";

export const ListVsl = () => {
  const params = useSearchParams();
  const queryParams = Object.fromEntries(params.entries());

  const { data, isLoading } = useGetLabsVSLSQuery({
    pageSize: Number(queryParams.pageSize) || 6,
    page: Number(queryParams.page) || 1,
    ...queryParams,
  });

  const [selectedVsl, setSelectedVsl] = useState<ILabsVsl | null>(null);
  const [removeVslId, setRemoveVslId] = useState<string>("");
  const [editVsl, setEditVsl] = useState<ILabsVsl | null>(null);

  const [deleteVsl, { isLoading: isDeleting }] = useDeleteLabsVSLMutation();

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonVsl key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {data?.data.length === 0 ? (
            <div className="col-span-12 py-10">
              <EmptyContent
                title="Nenhum VSL encontrado"
                description="Você ainda não possui VSLs cadastrados. Comece criando o seu primeiro VSL."
                icon="solar:videocamera-record-bold-duotone"
                onAction={<CreateVSL />}
              />
            </div>
          ) : (
            data?.data.map((vsl: ILabsVsl) => (
              <VslCard
                key={vsl.id}
                vsl={vsl}
                onEdit={() => setEditVsl(vsl)}
                onDelete={() => setRemoveVslId(vsl.id)}
                onWatch={() => setSelectedVsl(vsl)}
              />
            ))
          )}
        </div>
      )}

      <Pagination defaultPageSize={"6"} total={data?.meta?.totalPages} />

      {selectedVsl && (
        <ModalPlayer
          vsl={selectedVsl}
          isOpen={!!selectedVsl}
          onOpenChange={() => setSelectedVsl(null)}
        />
      )}

      {editVsl && <EditVSL vsl={editVsl} setEditVSL={setEditVsl} />}

      {!!removeVslId && (
        <ModalRemove
          isOpen={!!removeVslId}
          onOpenChange={() => setRemoveVslId("")}
          onRemove={() => {
            deleteVsl({ id: removeVslId })
              .unwrap()
              .then(() => setRemoveVslId(""));
          }}
          title="Excluir VSL"
          text="Tem certeza que deseja excluir este VSL?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
