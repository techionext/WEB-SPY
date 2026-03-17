"use client";

import { ModalRemove } from "@/components/modal-remove/modal-remove";
import dayjs from "@/utils/dayjs-config";
import { Accordion, AccordionItem, Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ModalCreateProducer } from "./modal-create-producer";

import { Pagination } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { useAccordionNavigation } from "../../accordion-navigation-context";
import { ModalEditProducer } from "./modal-edit-producer";
import {
  useDeleteProducerMutation,
  useGetProducersQuery,
} from "@/services/community/settings/producer.service";
import { IProducer } from "@/types/community/settings/producer.type";

export const AccordionProducer = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { data } = useGetProducersQuery({
    pageSize: params.pageSize ? Number(params.pageSize) : 9,
    ...params,
  });
  const [removeProducer, { isLoading }] = useDeleteProducerMutation();
  const [producerId, setProducerId] = useState<string>("");
  const [selectedProducer, setSelectedProducer] = useState<IProducer | null>(null);
  const { expandedKeys, setExpandedKeys } = useAccordionNavigation();

  const handleEdit = (producer: IProducer) => {
    setSelectedProducer(producer);
  };

  const handleDelete = (producerId: string) => {
    setProducerId(producerId);
  };

  return (
    <div id="accordion-producers" className="-mx-2">
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
          key="producers"
          aria-label="Produtor"
          title={
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 bg-default-200 items-center justify-center rounded-2xl flex">
                <Icon icon="solar:user-circle-bold" width={24} />
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">Produtores</span>
                <span className="text-sm text-default-500">
                  {data?.meta.total} produtores cadastrados
                </span>
              </div>
              <ModalCreateProducer />
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-4">
              {data?.data.map((producer) => (
                <div
                  key={producer.id}
                  className="relative flex gap-2 items-center p-4 border border-default-200 rounded-lg flex-1"
                >
                  {producer?.avatar?.url && (
                    <Image
                      src={producer?.avatar?.url ?? ""}
                      alt={producer.name}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="text-base font-medium">{producer.name}</span>
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:calendar-bold-duotone" />
                      <span className="text-xs text-default-500">
                        {dayjs(producer.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(producer)}
                      aria-label="Editar categoria"
                    >
                      <Icon icon="solar:pen-bold-duotone" width={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(producer.id)}
                      aria-label="Excluir categoria"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination total={data?.meta?.totalPages ?? 0} defaultPageSize={"9"} />
          </div>
        </AccordionItem>
      </Accordion>

      {producerId && (
        <ModalRemove
          isOpen={!!producerId}
          onOpenChange={() => setProducerId("")}
          onRemove={() =>
            removeProducer({ id: producerId })
              .unwrap()
              .then(() => {
                setProducerId("");
              })
          }
          title="Excluir Produtor"
          text="Tem certeza que deseja excluir o produtor?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isLoading}
        />
      )}

      {selectedProducer && (
        <ModalEditProducer
          isOpen={!!selectedProducer}
          onOpenChange={() => setSelectedProducer(null)}
          data={selectedProducer}
        />
      )}
    </div>
  );
};
