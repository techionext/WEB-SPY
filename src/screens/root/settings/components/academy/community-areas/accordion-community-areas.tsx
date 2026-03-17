"use client";

import { ModalRemove } from "@/components/modal-remove/modal-remove";
import dayjs from "@/utils/dayjs-config";
import { Accordion, AccordionItem, Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ModalCreateCommunityArea } from "./modal-create-community-area";

import { Pagination } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { useAccordionNavigation } from "../../accordion-navigation-context";
import { ModalEditCommunityArea } from "./modal-edit-community-area";
import {
  useDeleteCommunityAreaMutation,
  useGetCommunityAreaQuery,
} from "@/services/community/settings/community-area.service";
import { ICommunityArea } from "@/types/community/settings/community-area.type";

export const AccordionCommunityArea = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { data } = useGetCommunityAreaQuery({
    pageSize: params.pageSize ? Number(params.pageSize) : 8,
    ...params,
  });
  const [removeArea, { isLoading }] = useDeleteCommunityAreaMutation();
  const [areaId, setAreaId] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<ICommunityArea | null>(null);
  const { expandedKeys, setExpandedKeys } = useAccordionNavigation();

  const handleEdit = (area: ICommunityArea) => {
    setSelectedArea(area);
  };

  const handleDelete = (areaId: string) => {
    setAreaId(areaId);
  };

  return (
    <div id="accordion-community-areas" className="-mx-2">
      <Accordion
        selectionMode="multiple"
        selectedKeys={expandedKeys}
        onSelectionChange={(keys) => setExpandedKeys(keys as Set<string>)}
        itemClasses={{
          base: "rounded-lg bg-default-50",
          title: "text-sm font-medium text-foreground",
          trigger: "px-4 py-3 cursor-pointer",
          content: "px-4 pb-4",
        }}
      >
        <AccordionItem
          key="community-areas"
          aria-label="Áreas da Comunidade"
          title={
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 bg-default-200 items-center justify-center rounded-2xl flex">
                <Icon icon="solar:diploma-bold-duotone" width={24} />
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">Áreas da Comunidade</span>
                <span className="text-sm text-default-500">
                  {data?.data?.length} áreas cadastradas
                </span>
              </div>
              <ModalCreateCommunityArea />
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-4">
              {data?.data.map((area) => (
                <div
                  key={area.id}
                  className="relative flex gap-2 items-center p-4 border border-default-200 rounded-lg flex-1"
                >
                  {area?.thumbnail?.url && (
                    <Image
                      src={area?.thumbnail?.url ?? ""}
                      alt={area.title}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="text-base font-medium">{area.title}</span>
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:calendar-bold-duotone" />
                      <span className="text-xs text-default-500">
                        {dayjs(area.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(area)}
                      aria-label="Editar categoria"
                    >
                      <Icon icon="solar:pen-bold-duotone" width={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(area.id)}
                      aria-label="Excluir categoria"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"8"} />
          </div>
        </AccordionItem>
      </Accordion>

      {areaId && (
        <ModalRemove
          isOpen={!!areaId}
          onOpenChange={() => setAreaId("")}
          onRemove={() =>
            removeArea({ id: areaId })
              .unwrap()
              .then(() => {
                setAreaId("");
              })
          }
          title="Excluir Área"
          text="Tem certeza que deseja excluir a área?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isLoading}
        />
      )}

      {selectedArea && (
        <ModalEditCommunityArea
          isOpen={!!selectedArea}
          onOpenChange={() => setSelectedArea(null)}
          data={selectedArea}
        />
      )}
    </div>
  );
};
