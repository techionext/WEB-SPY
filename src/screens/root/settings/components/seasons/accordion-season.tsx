"use client";

import { ModalRemove } from "@/components/modal-remove/modal-remove";
import dayjs from "@/utils/dayjs-config";
import { Accordion, AccordionItem, Button, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ModalCreateSeason } from "./modal-create-season";
import { ModalEditSeason } from "./modal-edit-season";
import { ILabsSeason } from "@/types/labs/season/labs-season.type";
import { Pagination } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { useAccordionNavigation } from "../accordion-navigation-context";
import { useGetSeasonQuery, useDeleteSeasonMutation } from "@/services/session/season.service";
import { useSession } from "@/providers/session-provider";
import { ISeason } from "@/types/season/season.type";

export const AccordionSeason = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { user } = useSession();
  const { data: seasonsData, isLoading } = useGetSeasonQuery(
    {
      id: user?.id || "",
      pageSize: params.pageSize ? Number(params.pageSize) : 8,
      ...params,
    },
    { skip: !user?.id },
  );
  const [deleteSeason, { isLoading: isDeleting }] = useDeleteSeasonMutation();

  const [seasonId, setSeasonId] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<ILabsSeason | null>(null);
  const { expandedKeys, setExpandedKeys } = useAccordionNavigation();

  const seasons = seasonsData
    ? {
        data: seasonsData.data.map((season: ISeason) => ({
          id: season.id,
          title: season.title,
          icon: "solar:ranking-bold-duotone",
          createdAt: season.createdAt,
          updatedAt: season.updatedAt,
          current: season.current,
          number: season.number,
          startDate: season.startDate,
          endDate: season.endDate,
        })) as (ILabsSeason & {
          current?: boolean;
          number?: number;
          startDate?: string;
          endDate?: string;
        })[],
        meta: seasonsData.meta,
      }
    : {
        data: [] as ILabsSeason[],
        meta: {
          total: 0,
          totalPages: 0,
          page: 1,
          pageSize: 8,
        },
      };

  const handleEdit = (season: ILabsSeason) => {
    setSelectedSeason(season);
  };

  const handleDelete = (id: string) => {
    setSeasonId(id);
  };

  const handleRemove = () => {
    if (!seasonId) return;

    deleteSeason({ id: seasonId })
      .unwrap()
      .then(() => {
        setSeasonId("");
      });
  };

  return (
    <div id="accordion-seasons" className="-mx-2">
      <Accordion
        selectionMode="multiple"
        selectedKeys={expandedKeys}
        onSelectionChange={(keys) => setExpandedKeys(keys as Set<string>)}
        itemClasses={{
          base: " rounded-lg bg-default-50",
          title: "text-sm font-medium text-foreground",
          trigger: "px-4 py-3",
          content: "px-4 pb-4",
        }}
      >
        <AccordionItem
          key="seasons"
          aria-label="Temporadas"
          title={
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 bg-default-200 items-center justify-center rounded-2xl flex">
                <Icon icon="solar:ranking-bold-duotone" width={24} />
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">Temporadas</span>
                <span className="text-sm text-default-500">
                  {seasons?.meta.total} temporadas cadastradas
                </span>
              </div>
              <ModalCreateSeason />
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex flex-col p-4 border border-default-200 rounded-lg bg-content1"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                      <div className="flex flex-col flex-1 gap-1.5">
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-default-200">
                      <Skeleton className="h-3 w-24 rounded" />
                      <div className="flex gap-1">
                        <Skeleton className="w-7 h-7 rounded" />
                        <Skeleton className="w-7 h-7 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              ) : seasons?.data.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-default-200 rounded-full flex items-center justify-center mb-4">
                    <Icon
                      icon="solar:ranking-bold-duotone"
                      width={32}
                      className="text-default-400"
                    />
                  </div>
                  <p className="text-sm text-default-500">Nenhuma temporada cadastrada</p>
                </div>
              ) : (
                seasons?.data.map((season) => {
                  const seasonData = season as ILabsSeason & {
                    current?: boolean;
                    number?: number;
                    startDate?: string;
                    endDate?: string;
                  };
                  const isCurrent = seasonData.current;
                  const startDate = seasonData.startDate
                    ? dayjs(seasonData.startDate).format("DD/MM/YYYY")
                    : null;
                  const endDate = seasonData.endDate
                    ? dayjs(seasonData.endDate).format("DD/MM/YYYY")
                    : null;

                  return (
                    <div
                      key={season.id}
                      className={`group relative flex flex-col p-4 border rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10"
                          : "border-default-200 bg-content1 hover:border-default-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Badge de temporada atual */}
                      {isCurrent && (
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full shadow-sm">
                            Atual
                          </span>
                        </div>
                      )}

                      {/* Header com ícone e número */}
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            isCurrent
                              ? "bg-gradient-to-br from-primary to-primary-600 shadow-md shadow-primary/20"
                              : "bg-gradient-to-br from-default-200 to-default-300 group-hover:from-default-300 group-hover:to-default-400"
                          }`}
                        >
                          <Icon
                            icon="solar:ranking-bold-duotone"
                            width={20}
                            className={isCurrent ? "text-white" : "text-default-600"}
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground mb-1 leading-tight">
                            {season.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-default-500">
                            <Icon icon="solar:calendar-bold-duotone" width={12} />
                            <span className="truncate">
                              {startDate && endDate
                                ? `${startDate} - ${endDate}`
                                : startDate
                                  ? `Início: ${startDate}`
                                  : "Sem data"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Informações adicionais */}
                      <div className="flex items-center justify-between pt-3 border-t border-default-200">
                        <div className="flex items-center gap-1.5 text-xs text-default-500">
                          <Icon icon="solar:calendar-add-bold-duotone" width={12} />
                          <span>{dayjs(season.createdAt).format("DD/MM/YY")}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="min-w-unit-7 h-7 w-7 opacity-60 hover:opacity-100 transition-opacity"
                            onPress={() => handleEdit(season)}
                            aria-label="Editar temporada"
                          >
                            <Icon icon="solar:pen-bold-duotone" width={14} />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            className="min-w-unit-7 h-7 w-7 opacity-60 hover:opacity-100 transition-opacity"
                            onPress={() => handleDelete(season.id)}
                            aria-label="Excluir temporada"
                          >
                            <Icon icon="solar:trash-bin-trash-bold-duotone" width={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <Pagination total={seasons?.meta?.totalPages ?? 0} defaultPageSize={"8"} />
          </div>
        </AccordionItem>
      </Accordion>

      {seasonId && (
        <ModalRemove
          isOpen={!!seasonId}
          onOpenChange={() => setSeasonId("")}
          onRemove={handleRemove}
          title="Excluir temporada"
          text="Tem certeza que deseja excluir a temporada?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isDeleting}
        />
      )}

      {selectedSeason && (
        <ModalEditSeason
          isOpen={!!selectedSeason}
          onOpenChange={() => setSelectedSeason(null)}
          season={selectedSeason}
        />
      )}
    </div>
  );
};
