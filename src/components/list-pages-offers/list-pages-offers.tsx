"use client";

import {
  useGetLabsPagesQuery,
  useDeleteLabsPageMutation,
} from "@/services/labs/page/labs-page.service";
import type { ReactNode } from "react";
import { useState } from "react";
import { EmptyContent } from "@/components/empty/empty-content";
import { Pagination } from "@/components/pagination";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { useSearchParams } from "next/navigation";
import { ModalUnarchive } from "@/screens/pages/components/modal-unarchive/modal-unarchive";
import { ModalArchive } from "@/screens/pages/components/modal-archive/modal-archive";
import { EditPage } from "@/screens/pages/components/modal-edit/modal-edit";
import { PagesCard } from "@/screens/pages/components/pages-cards";
import { CreatePage } from "@/screens/pages/components/modal-create/modal-create";
import { SkeletonPages } from "@/screens/pages/components/skeleton-pages";

type ListPagesProps = {
  offerId?: string;
  type?: string[];
  noEmpty?: boolean | ReactNode;
};

const OFFER_VIEW_PAGE_SIZE = 3;
const DEFAULT_PAGE_SIZE = 6;

export const ListPagesOffers = ({
  offerId: offerIdProp,
  type: typeProp,
  noEmpty,
}: ListPagesProps) => {
  const params = useSearchParams();
  const queryParams = Object.fromEntries(params.entries());
  const isOfferView = Boolean(offerIdProp);
  const fallbackPageSize = isOfferView ? OFFER_VIEW_PAGE_SIZE : DEFAULT_PAGE_SIZE;
  const pageSize = Number(queryParams.pageSize) || fallbackPageSize;

  const { data, isLoading } = useGetLabsPagesQuery({
    ...queryParams,
    page: Number(queryParams.page) || 1,
    pageSize,
    ...(offerIdProp ? { offerId: offerIdProp } : {}),
    ...(typeProp?.length ? { type: typeProp } : {}),
  });
  const [editPage, setEditPage] = useState<ILabsPage | null>(null);
  const [removePageId, setRemovePageId] = useState<string>("");
  const [archivePage, setArchivePage] = useState<ILabsPage | null>(null);
  const [unarchivePage, setUnarchivePage] = useState<ILabsPage | null>(null);

  const [deletePage, { isLoading: isDeleting }] = useDeleteLabsPageMutation();

  const skeletonCount = isOfferView ? OFFER_VIEW_PAGE_SIZE : DEFAULT_PAGE_SIZE;
  const gridClassName = isOfferView
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
    : "grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";

  const rows = data?.data ?? [];
  const isListEmpty = !isLoading && rows.length === 0;
  const showNoEmpty = isListEmpty && noEmpty !== undefined && noEmpty !== false;

  return (
    <div className="flex gap-4">
      <div className="flex h-full flex-col justify-between gap-2">
        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonPages key={index} />
            ))}
          </div>
        ) : showNoEmpty ? (
          <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-default-300 bg-content2/30 px-4 py-10 text-center text-small text-default-500">
            {noEmpty === true ? (
              <p>
                {typeProp?.length
                  ? "Nenhuma página deste tipo para esta oferta."
                  : "Nenhuma página cadastrada para esta oferta."}
              </p>
            ) : (
              noEmpty
            )}
          </div>
        ) : isListEmpty && !isOfferView ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <div className="col-span-full py-10">
              <EmptyContent
                description="Você ainda não possui páginas cadastradas. Comece criando a sua primeira página."
                icon="solar:globus-bold-duotone"
                onAction={<CreatePage />}
                title="Nenhuma página encontrada"
              />
            </div>
          </div>
        ) : (
          <div className={gridClassName}>
            {rows.map((page: ILabsPage) => (
              <PagesCard
                key={page.id}
                page={page}
                onArchive={() => setArchivePage(page)}
                onDelete={() => setRemovePageId(page.id)}
                onEdit={() => setEditPage(page)}
                onUnarchive={() => setUnarchivePage(page)}
              />
            ))}
          </div>
        )}
        <Pagination defaultPageSize={String(fallbackPageSize)} total={data?.meta?.totalPages} />
        {editPage && <EditPage page={editPage} setEditPage={setEditPage} />}
      </div>

      {!!archivePage && (
        <ModalArchive
          page={archivePage}
          isOpen={!!archivePage}
          onClose={() => setArchivePage(null)}
          onOpenChange={() => setArchivePage(null)}
        />
      )}

      {!!unarchivePage && (
        <ModalUnarchive
          page={unarchivePage}
          isOpen={!!unarchivePage}
          onClose={() => setUnarchivePage(null)}
          onOpenChange={() => setUnarchivePage(null)}
        />
      )}

      {!!removePageId && (
        <ModalRemove
          isOpen={!!removePageId}
          isLoading={isDeleting}
          text="Tem certeza que deseja excluir esta página?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          title="Excluir Página"
          onOpenChange={() => setRemovePageId("")}
          onRemove={() => {
            deletePage({ id: removePageId })
              .unwrap()
              .then(() => setRemovePageId(""));
          }}
        />
      )}
    </div>
  );
};
