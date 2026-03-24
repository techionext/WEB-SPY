import {
  useGetLabsPagesQuery,
  useDeleteLabsPageMutation,
  useUpdateLabsPageMutation,
} from "@/services/labs/page/labs-page.service";
import { useParams, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { Empty } from "@/components/empty/empty";
import { PagesCard } from "@/screens/pages/components/pages-cards";
import { useState } from "react";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { EditPage } from "./modal/edit-page";
import { SkeletonPages } from "@/screens/pages/components/skeleton-pages";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { ModalArchive } from "@/screens/pages/components/modal-archive/modal-archive";

export const ListPages = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetLabsPagesQuery(
    {
      offerId: id as string,
      pageSize: Number(params.pageSize) || 6,
      ...params,
    },
    { skip: !id },
  );
  const [editPage, setEditPage] = useState<ILabsPage | null>(null);
  const [removePageId, setRemovePageId] = useState<string>("");
  const [archivePage, setArchivePage] = useState<ILabsPage | null>(null);

  const [deletePage, { isLoading: isDeleting }] = useDeleteLabsPageMutation();
  const [updatePage] = useUpdateLabsPageMutation();

  return (
    <div className="flex flex-col gap-2 h-full justify-between w-full">
      <div className="grid grid-cols-3 gap-4">
        {data?.data.length === 0 && !isLoading ? (
          <div className="col-span-12">
            <Empty description="Não existem páginas para esta oferta" isLoading={isLoading} />
          </div>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonPages key={index} />)
        ) : (
          data?.data.map((page: ILabsPage) => (
            <div key={page.id}>
              <PagesCard
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
            </div>
          ))
        )}
      </div>
      <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"6"} />
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
