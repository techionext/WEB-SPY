"use client";
import {
  useGetLabsPagesQuery,
  useDeleteLabsPageMutation,
  useUpdateLabsPageMutation,
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

  const [deletePage, { isLoading: isDeleting }] = useDeleteLabsPageMutation();
  const [updatePage] = useUpdateLabsPageMutation();

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
          {data?.data.map((page: ILabsPage) => (
            <PagesCard
              key={page.id}
              page={page}
              onEdit={() => setEditPage(page)}
              onArchive={() => setArchivePage(page)}
              onUnarchive={() => {
                updatePage({
                  id: page.id,
                  type: page.type,
                  offerId: page.offer,
                  archive: false,
                });
              }}
              onDelete={() => setRemovePageId(page.id)}
            />
          ))}
        </div>
      )}
      <Pagination defaultPageSize={"6"} total={data?.meta?.totalPages} />
      {editPage && <EditPage page={editPage} setEditPage={setEditPage} />}
      {!!removePageId && (
        <ModalRemove
          isOpen={!!removePageId}
          onOpenChange={() => setRemovePageId("")}
          onRemove={() => {
            deletePage({ id: removePageId })
              .unwrap()
              .then(() => setRemovePageId(""));
          }}
          title="Excluir página"
          text="Tem certeza que deseja excluir esta página?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isDeleting}
        />
      )}

      {!!archivePage && (
        <ModalArchive
          page={archivePage}
          isOpen={!!archivePage}
          onOpenChange={() => setArchivePage(null)}
          onClose={() => setArchivePage(null)}
        />
      )}
    </div>
  );
};
