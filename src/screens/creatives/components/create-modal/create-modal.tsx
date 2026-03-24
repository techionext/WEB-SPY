"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  useDisclosure,
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, Fragment, useState } from "react";
import { useParams } from "next/navigation";

import { Field } from "@/components/field/field";
import { SwitchForm } from "@/components/switch-forms/switch-forms";
import { trafficNetworkValues, TrafficNetwork } from "@/types/offer/offer.type";
import { languages } from "@/components/select-language/countries";
import { useCreateLabsCreativeMutation } from "@/services/creative/creative.service";
import { useGetSpyOffersQuery } from "@/services/spy/spy-offers.service";
import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import {
  schemaCreateCreative,
  SchemaCreateCreativeInput,
  SchemaCreateCreativeOutput,
} from "./schema-create";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { VideoPlayer } from "@/components/videoplayer/video-player";

export const CreateModal = () => {
  const { id: offerIdParam } = useParams<{ id: string }>();
  const [createCreative, { isLoading }] = useCreateLabsCreativeMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filterOffer, setFilterOffer] = useState("");
  const { data: offers, isLoading: isLoadingOffers } = useGetSpyOffersQuery(
    { filter: filterOffer, pageSize: 50 },
    { skip: !!offerIdParam },
  );

  const { control, reset, handleSubmit, watch } = useForm<
    SchemaCreateCreativeInput,
    any,
    SchemaCreateCreativeOutput
  >({
    resolver: zodResolver(schemaCreateCreative),
    defaultValues: {
      isClimbing: false,
      valueToday: 0,
      creationType: "MANUAL",
      offerId: offerIdParam || "",
      pageId: "",
    },
  });

  const trafficNetworkValue = watch("trafficNetwork");
  const offerIdValue = watch("offerId");

  const { data: pages, isLoading: isLoadingPages } = useGetLabsPagesQuery(
    {
      offerId: offerIdValue,
      type: ["Página do Youtube"],
    },
    { skip: trafficNetworkValue !== TrafficNetwork.YOUTUBE || !offerIdValue },
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        isClimbing: false,
        valueToday: 0,
        creationType: "MANUAL",
        title: "",
        description: "",
        salesAngle: "",
        offerId: offerIdParam || "",
        pageId: "",
      });
    }
  }, [isOpen, reset, offerIdParam]);

  const onSubmit = async (data: SchemaCreateCreativeOutput) => {
    await createCreative({
      status: true,
      ...data,
    })
      .unwrap()
      .then(() => {
        onClose();
        reset();
      });
  };

  return (
    <Fragment>
      <Button
        startContent={<Icon width={20} icon="solar:add-circle-bold" />}
        color="primary"
        onPress={onOpen}
      >
        Adicionar
      </Button>

      <Modal size="xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
              <Icon icon="solar:add-circle-linear" className="text-primary text-2xl" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white leading-tight">Novo Criativo</h2>
              <p className="text-sm text-default-400 font-medium">
                Preencha os dados para criar um novo criativo
              </p>
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
                        <span className="text-xs font-bold tracking-widest uppercase">Oferta</span>
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
                          <span className="text-xs text-default-400">{item.trafficNetwork}</span>
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
                  <div className="relative">
                    <Field
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:document-text-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Título
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      placeholder="Digite o título do criativo"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  </div>
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
                    labelPlacement="outside"
                    placeholder="Digite a descrição do criativo"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="trafficNetwork"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Select
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:global-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Rede de tráfego
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      placeholder="Selecione"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      selectedKeys={[field.value ?? ""]}
                      onSelectionChange={(v) => field.onChange(v.currentKey)}
                    >
                      {(Object.values(TrafficNetwork) as TrafficNetwork[]).map((trafficNetwork) => (
                        <SelectItem
                          key={trafficNetwork}
                          textValue={trafficNetworkValues[trafficNetwork].label}
                          startContent={
                            <Icon icon={trafficNetworkValues[trafficNetwork].icon} width={16} />
                          }
                        >
                          {trafficNetworkValues[trafficNetwork].label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="language"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Autocomplete
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:translation-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Idioma
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      placeholder="Selecione"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      defaultItems={languages}
                      selectedKey={field.value}
                      onSelectionChange={(key) => field.onChange(key)}
                    >
                      {(language) => (
                        <AutocompleteItem
                          key={language.label}
                          textValue={language.label}
                          startContent={
                            <Avatar alt={language.label} className="w-5 h-5" src={language.flag} />
                          }
                        >
                          <span className="text-sm font-medium">{language.label}</span>
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="salesAngle"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:target-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Ângulo de venda
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      placeholder="Digite o ângulo de venda"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="creationType"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Select
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:magic-stick-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Tipo de criação
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      placeholder="Selecione"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      selectedKeys={[field.value ?? ""]}
                      onSelectionChange={(v) => field.onChange(v.currentKey)}
                    >
                      <SelectItem key="AUTOMATIC" textValue="Automático">
                        <span className="text-sm font-medium">Automático</span>
                      </SelectItem>
                      <SelectItem key="MANUAL" textValue="Manual">
                        <span className="text-sm font-medium">Manual</span>
                      </SelectItem>
                    </Select>
                  )}
                />
              </div>
              {trafficNetworkValue === TrafficNetwork.YOUTUBE && (
                <Controller
                  control={control}
                  name="pageId"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Autocomplete
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:globus-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Página
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      placeholder="Selecione uma página"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      items={pages?.data || []}
                      isLoading={isLoadingPages}
                      selectedKey={field.value}
                      onSelectionChange={(key) => field.onChange(key)}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id} textValue={item.title}>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.title}</span>
                            <span className="text-xs text-default-400">{item.type}</span>
                          </div>
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
              )}

              <Controller
                control={control}
                name="valueToday"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field
                    {...field}
                    value={field.value?.toString() ?? ""}
                    type="number"
                    label={
                      <div className="flex items-center gap-2 text-default-400">
                        <Icon icon="solar:dollar-minimalistic-linear" width={16} />
                        <span className="text-xs font-bold tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                          {trafficNetworkValue === TrafficNetwork.YOUTUBE
                            ? "Visualizações hoje"
                            : "Quantidades hoje"}
                        </span>
                      </div>
                    }
                    labelPlacement="outside"
                    placeholder="0"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />

              <Controller
                control={control}
                name="isClimbing"
                render={({ field }) => (
                  <div className="mt-2 group">
                    <SwitchForm
                      label="Em escala?"
                      description="Marcar criativo como em fase de escala"
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="image"
                render={({ field, fieldState: { invalid, error } }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-default-400 mb-1">
                      <Icon icon="solar:gallery-linear" width={16} />
                      <span className="text-xs font-bold tracking-widest uppercase">
                        Imagem / Vídeo
                      </span>
                    </div>
                    <DropzoneWrapper
                      acceptedTypes={FileTypes.ANY}
                      onUploadSuccess={(v) => field.onChange(v[0])}
                    >
                      {() => (
                        <div
                          className={`group bg-content2 relative mx-auto aspect-square w-full h-[300px] cursor-pointer rounded-lg overflow-hidden border-2 border-dashed border-default-200 hover:border-primary transition-colors ${
                            invalid ? "border-danger" : ""
                          }`}
                        >
                          {field.value?.type?.startsWith("video") ? (
                            <VideoPlayer url={URL.createObjectURL(field.value)} />
                          ) : (
                            <Image
                              removeWrapper
                              alt="Imagem/Vídeo do criativo"
                              className="z-0 aspect-square h-full w-full object-cover"
                              src={
                                field.value
                                  ? URL.createObjectURL(field.value as File)
                                  : "https://placehold.co/600x600?text=Enviar+Mídia"
                              }
                            />
                          )}
                          <div className="absolute inset-0 z-5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Icon
                            className="absolute top-1/2 left-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            icon="solar:gallery-add-bold-duotone"
                          />
                        </div>
                      )}
                    </DropzoneWrapper>
                    {invalid && <p className="text-xs text-danger">{error?.message}</p>}
                  </div>
                )}
              />
            </div>
          </ModalBody>

          <ModalFooter className="border-t border-default-100/50 py-6 gap-3">
            <Button variant="flat" onPress={onClose} fullWidth>
              Cancelar
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading} fullWidth>
              <Icon icon="solar:add-circle-bold" className="text-lg" />
              Criar Criativo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};
