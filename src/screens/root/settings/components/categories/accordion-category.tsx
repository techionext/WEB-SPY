"use client";

import { ModalRemove } from "@/components/modal-remove/modal-remove";
import {
  useDeleteCategoryMutation,
  useGetCategoryQuery,
} from "@/services/category/category.service";
import dayjs from "@/utils/dayjs-config";
import { Accordion, AccordionItem, Button, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ModalCreateCategory } from "./modal-create-category";
import { ModalEditCategory } from "./modal-edit-category";
import { ILabsCategory } from "@/types/labs/category/labs-category.type";
import { Pagination } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { useAccordionNavigation } from "../accordion-navigation-context";

export const AccordionCategory = () => {
  const queryParams = useSearchParams();
  const params = Object.fromEntries(queryParams.entries());
  const { data: categories } = useGetCategoryQuery({
    pageSize: params.pageSize ? Number(params.pageSize) : 8,
    ...params,
  });
  const [removeCategory, { isLoading }] = useDeleteCategoryMutation();
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ILabsCategory | null>(null);
  const { expandedKeys, setExpandedKeys } = useAccordionNavigation();

  const handleEdit = (category: ILabsCategory) => {
    setSelectedCategory(category);
  };

  const handleDelete = (categoryId: string) => {
    setCategoryId(categoryId);
  };

  return (
    <div id="accordion-categories" className="-mx-2">
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
          key="categories"
          aria-label="Categorias"
          title={
            <div className="flex items-center gap-3 w-full">
              <div className="w-12 h-12 bg-default-200 items-center justify-center rounded-2xl flex">
                <Icon icon="solar:folder-bold-duotone" width={24} />
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">Categorias</span>
                <span className="text-sm text-default-500">
                  {categories?.meta.total} categorias cadastradas
                </span>
              </div>
              <ModalCreateCategory />
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-4">
              {categories?.data.map((category) => (
                <div
                  key={category.id}
                  className="relative flex gap-2 items-center p-4 border border-default-200 rounded-lg flex-1"
                >
                  {category?.image?.url ? (
                    <Image
                      src={category?.image?.url ?? ""}
                      alt={category.title}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-default-200 flex items-center justify-center">
                      <Icon icon={category.icon ?? "solar:folder-bold-duotone"} width={24} />
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="text-base font-medium">{category.title}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-default-500">Criado em:</span>
                      <span className="text-sm text-default-500">
                        {dayjs(category.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(category)}
                      aria-label="Editar categoria"
                    >
                      <Icon icon="solar:pen-bold-duotone" width={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(category.id)}
                      aria-label="Excluir categoria"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination total={categories?.meta?.totalPages ?? 0} defaultPageSize={"8"} />
          </div>
        </AccordionItem>
      </Accordion>

      {categoryId && (
        <ModalRemove
          isOpen={!!categoryId}
          onOpenChange={() => setCategoryId("")}
          onRemove={() =>
            removeCategory({ id: categoryId })
              .unwrap()
              .then(() => {
                setCategoryId("");
              })
          }
          title="Excluir categoria"
          text="Tem certeza que deseja excluir a categoria?"
          textButtonCancel="Cancelar"
          textButtonConfirm="Excluir"
          isLoading={isLoading}
        />
      )}

      {selectedCategory && (
        <ModalEditCategory
          isOpen={!!selectedCategory}
          onOpenChange={() => setSelectedCategory(null)}
          category={selectedCategory}
        />
      )}
    </div>
  );
};
