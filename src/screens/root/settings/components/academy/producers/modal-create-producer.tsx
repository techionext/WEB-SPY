"use client";

import { Field } from "@/components/field/field";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { schemaProducer, SchemaProducerInput, SchemaProducerOutput } from "./schema-producers";
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
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useCreateProducerMutation } from "@/services/community/settings/producer.service";
import { usePathname } from "next/navigation";

export const ModalCreateProducer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createProducer, { isLoading }] = useCreateProducerMutation();
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

  const onSubmit = (formData: SchemaProducerOutput) => {
    createProducer(formData).unwrap();
    handleClose();
  };

  const handleClose = () => {
    reset();
    onOpenChange();
  };

  const isCommunityScreen = usePathname().includes("/community");

  return (
    <>
      {isCommunityScreen ? (
        <Button
          size="sm"
          radius="md"
          variant="flat"
          className="hover:bg-primary  justify-between"
          endContent={<Icon width={20} icon="solar:add-circle-bold" />}
          onPress={onOpen}
        >
          Produtor
        </Button>
      ) : (
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
      )}
      <Modal isOpen={isOpen} onOpenChange={handleClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semibold">Novo Produtor</span>
              </ModalHeader>
              <ModalBody className="gap-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Field
                      {...field}
                      label="Nome"
                      placeholder="Nome do produtor"
                      errorMessage={errors.name?.message}
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
                              alt="Imagem do produtor"
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
