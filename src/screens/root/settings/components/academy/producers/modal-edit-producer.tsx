"use client";

import { Field } from "@/components/field/field";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { schemaProducer, SchemaProducerInput, SchemaProducerOutput } from "./schema-producers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { IProducer } from "@/types/community/settings/producer.type";
import { useUpdateProducerMutation } from "@/services/community/settings/producer.service";

interface ModalEditProducerProps extends Omit<ModalProps, "children"> {
  data: IProducer;
}

export const ModalEditProducer = ({
  isOpen,
  onOpenChange,
  data,
  ...rest
}: ModalEditProducerProps) => {
  const [updateProducer, { isLoading }] = useUpdateProducerMutation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SchemaProducerInput, any, SchemaProducerOutput>({
    resolver: zodResolver(schemaProducer),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (data && isOpen) {
      reset({
        name: data.name,
        image: undefined,
      });
    }
  }, [data, isOpen, reset]);

  const onSubmit = (formData: SchemaProducerOutput) => {
    if (!data) return;

    updateProducer({
      id: data.id,
      name: formData.name,
      image: formData.image || new File([], ""),
    }).unwrap();
    handleClose();
  };

  const handleClose = () => {
    reset();
    onOpenChange?.(false);
  };

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="lg" {...rest}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-xl font-semibold">Editar Produtor</span>
            </ModalHeader>
            <ModalBody className="gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Field
                    {...field}
                    label="Nome"
                    placeholder="Nome do Produtor"
                    errorMessage={errors.name?.message}
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
                                : data?.avatar?.url ||
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
