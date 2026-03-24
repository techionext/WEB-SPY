"use client";
import {
  useGetLabsPagesQuery,
  useDeleteLabsPageMutation,
} from "@/services/labs/page/labs-page.service";
import { useState } from "react";
import { SkeletonPages } from "./skeleton-pages";
import { PagesCard } from "./pages-cards";
import { EditPage } from "./modal-edit/modal-edit";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { Pagination } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { ModalArchive } from "./modal-archive/modal-archive";
import { EmptyContent } from "@/components/empty/empty-content";
import { CreatePage } from "./modal-create/modal-create";
import { ModalUnarchive } from "./modal-unarchive/modal-unarchive";

export const ListPages = () => {
  const params = useSearchParams();
  const queryParams = Object.fromEntries(params.entries());
  const { data, isLoading } = useGetLabsPagesQuery({
    pageSize: Number(queryParams.pageSize) || 6,
    page: Number(queryParams.page) || 1,
    ...queryParams,
  });
  const [editPage, setEditPage] = useState<ILabsPage | null>(null);
  const [removePageId, setRemovePageId] = useState<string>("");
  const [archivePage, setArchivePage] = useState<ILabsPage | null>(null);
  const [unarchivePage, setUnarchivePage] = useState<ILabsPage | null>(null);

  const [deletePage, { isLoading: isDeleting }] = useDeleteLabsPageMutation();

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonPages key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {data?.data.length === 0 ? (
            <div className="col-span-12 py-10">
              <EmptyContent
                title="Nenhuma página encontrada"
                description="Você ainda não possui páginas cadastradas. Comece criando a sua primeira página."
                icon="solar:globus-bold-duotone"
                onAction={<CreatePage />}
              />
            </div>
          ) : (
            data?.data.map((page: ILabsPage) => (
              <PagesCard
                key={page.id}
                page={page}
                onEdit={() => setEditPage(page)}
                onArchive={() => setArchivePage(page)}
                onUnarchive={() => setUnarchivePage(page)}
                onDelete={() => setRemovePageId(page.id)}
              />
            ))
          )}
        </div>
      )}

      <Pagination defaultPageSize={"6"} total={data?.meta?.totalPages || 0} />
      {editPage && <EditPage page={editPage} setEditPage={setEditPage} />}

      {!!archivePage && (
        <ModalArchive
          page={archivePage}
          isOpen={!!archivePage}
          onOpenChange={() => setArchivePage(null)}
          onClose={() => setArchivePage(null)}
        />
      )}

      {!!unarchivePage && (
        <ModalUnarchive
          page={unarchivePage}
          isOpen={!!unarchivePage}
          onOpenChange={() => setUnarchivePage(null)}
          onClose={() => setUnarchivePage(null)}
        />
      )}

      {!!removePageId && (
        <ModalRemove
          isOpen={!!removePageId}
          onOpenChange={() => setRemovePageId("")}
          onRemove={() => {
            deletePage({ id: removePageId })
              .unwrap()
              .then(() => setRemovePageId(""));
          }}
          title="Excluir Página"
          text="Tem certeza que deseja excluir esta página?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
