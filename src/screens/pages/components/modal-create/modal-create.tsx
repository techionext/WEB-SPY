"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { useGetLabsCreativeQuery } from "@/services/creative/creative.service";
import { TrafficNetwork } from "@/types/offer/offer.type";

import { Field } from "@/components/field/field";
import { useCreateLabsPageMutation } from "@/services/labs/page/labs-page.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { useGetSettingsQuery } from "@/services/settings/settings.service";
import { SwitchForm } from "@/components/switch-forms/switch-forms";
import { useGetSpyOffersQuery } from "@/services/spy/spy-offers.service";

import { SchemaPageInput, SchemaPageOutput, schemaPage } from "./schema-create";

export const CreatePage = () => {
  const { id: offerIdParam } = useParams<{ id: string }>();
  const [createPage, { isLoading }] = useCreateLabsPageMutation();
  const { data: settings } = useGetSettingsQuery({});

  const [filterOffer, setFilterOffer] = useState("");
  const { data: offers, isLoading: isLoadingOffers } = useGetSpyOffersQuery(
    { filter: filterOffer, pageSize: 50 },
    { skip: !!offerIdParam },
  );

  const { control, reset, handleSubmit } = useForm<SchemaPageInput, any, SchemaPageOutput>({
    resolver: zodResolver(schemaPage),
    defaultValues: {
      makeScraper: false,
      offerId: offerIdParam || "",
      creativeId: "",
    },
  });

  const typeValue = useWatch({
    control,
    name: "type",
  });

  const { data: creatives, isLoading: isLoadingCreatives } = useGetLabsCreativeQuery(
    {
      pageSize: 50,
      trafficNetwork: [TrafficNetwork.YOUTUBE],
    },
    { skip: typeValue !== "Página do Youtube" },
  );

  const onSubmit = (data: SchemaPageOutput) => {
    createPage({
      ...data,
    })
      .unwrap()
      .then(() => {
        onOpenChange();
      });
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!isOpen) {
      reset({
        title: "",
        description: "",
        url: "",
        type: "",
        file: undefined,
        image: undefined,
        makeScraper: false,
        offerId: offerIdParam || "",
        creativeId: "",
      });
    }
  }, [isOpen, reset, offerIdParam]);

  const handleClose = () => {
    onOpenChange();
  };

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
                  <Icon icon="solar:add-circle-linear" className="text-primary text-2xl" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-white leading-tight">Criar Página</h2>
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

                <div className="flex flex-col gap-6">
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
                              Título da Página
                            </span>
                          </div>
                        }
                        placeholder="Digite o título da página"
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
                        placeholder="Digite a descrição da página"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="url"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Field
                        {...field}
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:link-outline" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              URL da Página
                            </span>
                          </div>
                        }
                        placeholder="Digite a URL da página"
                        type="url"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="type"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Select
                        {...field}
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:globus-outline" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Tipo de página
                            </span>
                          </div>
                        }
                        placeholder="Selecione o tipo de página"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={[field.value ?? ""]}
                        onSelectionChange={(v) => field.onChange(v.currentKey)}
                      >
                        {(settings?.typePages || []).map((typePage) => (
                          <SelectItem key={typePage} textValue={typePage}>
                            {typePage}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {typeValue === "Página do Youtube" && (
                    <Controller
                      control={control}
                      name="creativeId"
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Autocomplete
                          label={
                            <div className="flex items-center gap-2 text-default-400">
                              <Icon icon="solar:stars-minimalistic-linear" width={16} />
                              <span className="text-xs font-bold tracking-widest uppercase">
                                Criativo do Youtube
                              </span>
                            </div>
                          }
                          labelPlacement="outside"
                          placeholder="Pesquise por um criativo"
                          isInvalid={invalid}
                          errorMessage={error?.message}
                          defaultItems={creatives?.data || []}
                          isLoading={isLoadingCreatives}
                          selectedKey={field.value}
                          onSelectionChange={(key) => field.onChange(key)}
                        >
                          {(item) => (
                            <AutocompleteItem key={item.id} textValue={item.title}>
                              <div className="flex items-center gap-3">
                                {item.image?.url && (
                                  <Image
                                    alt={item.title}
                                    className="h-8 w-8 rounded-md object-cover"
                                    src={item.image.url}
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{item.title}</span>
                                  <span className="text-[10px] text-default-400 font-bold uppercase tracking-wider">
                                    ID: {item.id.slice(0, 8)}
                                  </span>
                                </div>
                              </div>
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      )}
                    />
                  )}

                  <Controller
                    control={control}
                    name="makeScraper"
                    render={({ field }) => (
                      <div className="group">
                        <SwitchForm
                          label="Realizar scraper?"
                          description="Extrair dados da página"
                          isSelected={field.value}
                          onValueChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      control={control}
                      name="file"
                      render={({ field }) => {
                        const file = field.value as File | undefined;

                        return (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-default-400 flex items-center gap-2">
                              <Icon icon="solar:file-send-linear" width={16} />
                              Arquivo (opcional)
                            </label>

                            <DropzoneWrapper
                              acceptedTypes={FileTypes.ANY}
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
                                        Selecionar arquivo
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
                      name="image"
                      render={({ field }) => {
                        const file = field.value as File | undefined;

                        return (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold tracking-widest uppercase text-default-400 flex items-center gap-2">
                              <Icon icon="solar:gallery-linear" width={16} />
                              Imagem (opcional)
                            </label>

                            <DropzoneWrapper
                              acceptedTypes={FileTypes.IMAGE}
                              onUploadSuccess={(files) => field.onChange(files[0])}
                            >
                              {() => (
                                <div className="group bg-content1 relative mx-auto aspect-square w-full h-[100px] cursor-pointer rounded-xl overflow-hidden border border-dashed border-default-300 hover:border-primary/50 transition-colors">
                                  {file || "" ? (
                                    <Image
                                      removeWrapper
                                      alt="Imagem da página"
                                      className="z-0 aspect-square h-full w-full object-cover"
                                      src={file ? URL.createObjectURL(file) : ""}
                                    />
                                  ) : null}
                                  <div className="absolute inset-0 z-5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Icon
                                      className="h-6 w-6 text-white"
                                      icon="solar:gallery-add-bold-duotone"
                                    />
                                  </div>
                                  {!file && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-content2 hover:bg-content3 transition-colors">
                                      <Icon
                                        icon="solar:gallery-bold-duotone"
                                        width={24}
                                        height={24}
                                        className="text-default-400"
                                      />
                                      <p className="text-[10px] font-bold text-default-500 uppercase tracking-wider">
                                        Selecionar imagem
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
                  </div>
                </div>
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
