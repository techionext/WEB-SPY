"use client";

import { Field } from "@/components/field/field";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { schemaCategory, SchemaCategoryInput, SchemaCategoryOutput } from "./schemaCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useForm, Controller } from "react-hook-form";
import { useUpdateLabsCategoryMutation } from "@/services/labs/category/labs-category.service";
import { ILabsCategory } from "@/types/labs/category/labs-category.type";
import { useEffect } from "react";
interface ModalEditCategoryProps extends Omit<ModalProps, "children"> {
  category: ILabsCategory | null;
}

export const ModalEditCategory = ({
  isOpen,
  onOpenChange,
  category,
  ...rest
}: ModalEditCategoryProps) => {
  const [updateCategory, { isLoading }] = useUpdateLabsCategoryMutation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SchemaCategoryInput, any, SchemaCategoryOutput>({
    resolver: zodResolver(schemaCategory),
    defaultValues: {
      title: "",
      icon: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (category && isOpen) {
      reset({
        title: category.title,
        icon: category.icon || "",
        image: undefined,
      });
    }
  }, [category, isOpen, reset]);

  const onSubmit = (data: SchemaCategoryOutput) => {
    if (!category) return;

    updateCategory({
      id: category.id,
      title: data.title,
      icon: data.icon || "",
      image: data.image || new File([], ""),
    }).unwrap();
    handleClose();
  };

  const handleClose = () => {
    reset();
    onOpenChange?.(false);
  };

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="lg" {...rest}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-xl font-semibold">Editar Categoria</span>
            </ModalHeader>
            <ModalBody className="gap-4">
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Field
                    {...field}
                    label="Título"
                    placeholder="Nome da categoria"
                    errorMessage={errors.title?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="icon"
                render={({ field }) => (
                  <Field
                    {...field}
                    label={
                      <div className="flex items-center gap-2">
                        <p>Ícone</p>
                        <Tooltip
                          className="max-w-xs p-2.5"
                          content={
                            <div className="flex items-center gap-1">
                              <p>Escolha um icone a partir do</p>
                              <Link
                                href="https://icon-sets.iconify.design/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-primary hover:text-primary-600 transition-colors text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="underline">Iconify</span>
                              </Link>
                            </div>
                          }
                        >
                          <Icon icon="solar:info-circle-bold" className="cursor-help" />
                        </Tooltip>
                      </div>
                    }
                    placeholder="Digite um ícone"
                    errorMessage={errors.title?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">Imagem (opcional)</label>
                    <DropzoneWrapper
                      acceptedTypes={FileTypes.IMAGE}
                      onUploadSuccess={(v) => field.onChange(v[0])}
                    >
                      {() => (
                        <div className="group bg-content1 relative mx-auto aspect-square w-full cursor-pointer rounded-lg overflow-hidden">
                          <Image
                            removeWrapper
                            alt="Imagem da categoria"
                            className="z-0 aspect-square h-full w-full object-cover"
                            src={
                              field.value
                                ? URL.createObjectURL(field.value)
                                : category?.image?.url ||
                                  "https://placehold.co/512x512?text=Adicionar+imagem"
                            }
                          />
                          <div className="absolute inset-0 z-5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Icon
                            className="absolute top-1/2 left-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            icon="solar:gallery-add-bold-duotone"
                          />
                        </div>
                      )}
                    </DropzoneWrapper>
                    {errors.image && <p className="text-sm text-danger">{errors.image.message}</p>}
                  </div>
                )}
              />
            </ModalBody>
            <ModalFooter className="border-t border-default-200">
              <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading} isDisabled={isLoading}>
                Salvar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
