"use client";
import { Field } from "@/components/field/field";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { schemaVSL, SchemaVSLInput, SchemaVSLOutput } from "./schema-create";
import { useParams } from "next/navigation";
import { useCreateLabsVSLMutation } from "@/services/labs/vsls/labs-vsls.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { useGetSpyOffersQuery } from "@/services/spy/spy-offers.service";

export const CreateVSL = () => {
  const { id: offerIdParam } = useParams<{ id: string }>();
  const [createVSL, { isLoading }] = useCreateLabsVSLMutation();

  const [filterOffer, setFilterOffer] = useState("");
  const { data: offers, isLoading: isLoadingOffers } = useGetSpyOffersQuery({
    filter: filterOffer,
    pageSize: 50,
  });

  const { control, reset, handleSubmit } = useForm<SchemaVSLInput, any, SchemaVSLOutput>({
    resolver: zodResolver(schemaVSL),
    defaultValues: {
      offerId: offerIdParam || "",
    },
  });

  const onSubmit = async (data: SchemaVSLOutput) => {
    const { transcription, ...rest } = data;

    await createVSL({
      ...rest,
      transcription: transcription instanceof File ? transcription : undefined,
    }).unwrap();
    handleClose();
  };

  const handleClose = () => {
    onOpenChange();
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (!isOpen) {
      reset({
        offerId: offerIdParam || "",
        title: "",
        description: "",
        video: undefined,
        transcription: undefined,
      });
    }
  }, [isOpen, reset, offerIdParam]);

  return (
    <>
      <Button
        startContent={<Icon width={20} icon="solar:add-circle-bold" />}
        color="primary"
        onPress={onOpen}
      >
        Adicionar
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
                  <Icon icon="solar:videocamera-record-bold" className="text-primary text-2xl" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-white leading-tight">Criar VSL</h2>
                  <p className="text-sm text-default-400 font-medium">Preencha os dados abaixo</p>
                </div>
              </ModalHeader>
              <ModalBody className="gap-6 pt-6 pb-8">
                {!offerIdParam && (
                  <Controller
                    control={control}
                    name="offerId"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Autocomplete
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:tag-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Oferta
                            </span>
                          </div>
                        }
                        labelPlacement="outside"
                        placeholder="Selecione uma oferta"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={offers?.data || []}
                        isLoading={isLoadingOffers}
                        onInputChange={setFilterOffer}
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(key)}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id} textValue={item.title}>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{item.title}</span>
                              <span className="text-xs text-default-400 font-medium tracking-tight uppercase">
                                {item.trafficNetwork}
                              </span>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                )}

                <Controller
                  control={control}
                  name="title"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:document-text-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Título do VSL
                          </span>
                        </div>
                      }
                      placeholder="Digite o título do VSL"
                      labelPlacement="outside"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Textarea
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:notes-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Descrição
                          </span>
                        </div>
                      }
                      placeholder="Digite a descrição do VSL"
                      labelPlacement="outside"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="video"
                  render={({ field }) => {
                    const file = field.value as File | undefined;

                    return (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-default-400 flex items-center gap-2">
                          <Icon icon="solar:videocamera-record-linear" width={16} />
                          Vídeo
                        </label>

                        <DropzoneWrapper
                          acceptedTypes={FileTypes.VIDEO}
                          onUploadSuccess={(files) => field.onChange(files[0])}
                        >
                          {() => (
                            <div className="group bg-content1 relative aspect-video w-full cursor-pointer rounded-xl overflow-hidden border border-dashed border-default-300 hover:border-primary/50 transition-colors">
                              {file ? (
                                <>
                                  <video
                                    src={URL.createObjectURL(file)}
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 z-5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Icon
                                      icon="solar:videocamera-add-bold-duotone"
                                      className="text-white text-3xl"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-content2 group-hover:bg-content3 transition-colors">
                                  <Icon
                                    icon="solar:videocamera-add-bold-duotone"
                                    className="text-default-400 text-3xl"
                                  />
                                  <p className="text-[10px] font-bold text-default-500 uppercase tracking-wider">
                                    Selecionar vídeo
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DropzoneWrapper>
                      </div>
                    );
                  }}
                />

                <Controller
                  control={control}
                  name="transcription"
                  render={({ field }) => {
                    const file = field.value as File | undefined;

                    return (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-default-400 flex items-center gap-2">
                          <Icon icon="solar:file-send-linear" width={16} />
                          Transcrição (opcional)
                        </label>

                        <DropzoneWrapper
                          acceptedTypes={FileTypes.TEXT}
                          onUploadSuccess={(files) => field.onChange(files[0])}
                        >
                          {() => (
                            <div className="group relative w-full h-[100px] overflow-hidden rounded-xl bg-content2 border border-dashed border-default-300 hover:border-primary/50 transition-colors cursor-pointer">
                              {file ? (
                                <div className="absolute inset-0 flex items-center h-full justify-between gap-3 p-3 bg-content1">
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium truncate">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-foreground-500 font-medium tracking-tight uppercase">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </span>
                                  </div>

                                  <Button
                                    isIconOnly
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.onChange(undefined);
                                    }}
                                    color="danger"
                                    variant="flat"
                                    size="sm"
                                  >
                                    <Icon icon="solar:trash-bin-trash-bold-duotone" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 group-hover:bg-content3 transition-colors">
                                  <Icon
                                    icon="solar:file-send-bold-duotone"
                                    width={24}
                                    height={24}
                                    className="text-default-400"
                                  />
                                  <p className="text-[10px] font-bold text-default-500 uppercase tracking-wider">
                                    Selecionar transcrição
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DropzoneWrapper>
                      </div>
                    );
                  }}
                />
              </ModalBody>
              <ModalFooter className="border-t border-default-100/50 py-6 gap-3">
                <Button fullWidth onPress={handleClose} variant="flat">
                  Cancelar
                </Button>
                <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
                  <Icon icon="solar:stars-minimalistic-bold" className="text-lg" />
                  Criar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
