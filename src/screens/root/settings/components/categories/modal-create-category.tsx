"use client";

import { Field } from "@/components/field/field";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { schemaCategory, SchemaCategoryInput, SchemaCategoryOutput } from "./schemaCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import {
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  Link,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useCreateLabsCategoryMutation } from "@/services/labs/category/labs-category.service";

export const ModalCreateCategory = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createCategory, { isLoading }] = useCreateLabsCategoryMutation();
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

  const onSubmit = (data: SchemaCategoryOutput) => {
    createCategory(data).unwrap();
    handleClose();
  };

  const handleClose = () => {
    reset();
    onOpenChange();
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="ml-auto mr-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Adicionar
      </div>
      <Modal isOpen={isOpen} onOpenChange={handleClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semibold">Nova Categoria</span>
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
                      <label className="text-sm font-medium text-foreground">
                        Imagem (opcional)
                      </label>
                      <DropzoneWrapper
                        acceptedTypes={FileTypes.IMAGE}
                        onUploadSuccess={(v) => field.onChange(v[0])}
                      >
                        {() => (
                          <div className="group bg-content1 relative mx-auto aspect-square w-full cursor-pointer rounded-lg overflow-hidden">
                            <Image
                              removeWrapper
                              alt="Imagem do produto"
                              className="z-0 aspect-square h-full w-full object-cover"
                              src={
                                field.value
                                  ? URL.createObjectURL(field.value)
                                  : "https://placehold.co/512x512?text=Adicionar+imagem"
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
                      {errors.image && (
                        <p className="text-sm text-danger">{errors.image.message}</p>
                      )}
                    </div>
                  )}
                />
              </ModalBody>
              <ModalFooter className="border-t border-default-200">
                <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading} isDisabled={isLoading}>
                  Criar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
