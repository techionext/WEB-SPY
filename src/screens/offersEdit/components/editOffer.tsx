"use client";
import { Field } from "@/components/field/field";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  Image,
  Select,
  SelectItem,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrafficNetwork, trafficNetworkValues } from "@/types/offer/offer.type";
import { useGetCategoryQuery } from "@/services/category/category.service";
import { useGetSettingsQuery } from "@/services/settings/settings.service";
import { languages } from "@/components/select-language/countries";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";

import { useEffect } from "react";
import { schemaEditOffer, SchemaEditOfferOutput, SchemaEditOfferInput } from "./schemaEditOffer";
import { parseTime } from "@internationalized/date";
import { SwitchForm } from "@/components/switch-forms/switch-forms";
import {
  useGetSpyOfferByIdQuery,
  useUpdateSpyOfferMutation,
} from "@/services/spy/spy-offers.service";

export const EditOffer = () => {
  const { id } = useParams<{ id: string }>();
  const { data: offer } = useGetSpyOfferByIdQuery({ id: id as string }, { skip: !id });
  const { data: categories } = useGetCategoryQuery({ pageSize: 999 });
  const { data: platforms } = useGetSettingsQuery({});
  const form = useForm<SchemaEditOfferInput, any, SchemaEditOfferOutput>({
    resolver: zodResolver(schemaEditOffer),
    defaultValues: {
      isClimbing: false,
      isCloaker: false,
    },
  });

  const { control, handleSubmit } = form;
  const [updateOffer, { isLoading }] = useUpdateSpyOfferMutation();

  const onSubmit = (data: SchemaEditOfferOutput) => {
    if (!offer?.id) return;
    updateOffer({
      id: offer.id,
      ...data,
    }).unwrap();
  };

  useEffect(() => {
    if (offer) {
      form.reset({
        title: offer.title,
        description: offer.description,
        trafficNetwork: offer.trafficNetwork,
        categoryId: offer.category.id,
        structure: offer.structure,
        language: offer.language,
        typeProduct: offer.typeProduct,
        pitch: offer.pitch,
        isClimbing: offer.isClimbing,
        isCloaker: offer.isCloaker,
      });
    }
  }, [offer, form]);

  const stringToTimeValue = (timeString: string | undefined): any | null => {
    if (!timeString) return null;
    if (timeString.split(":").length === 3) {
      return parseTime(timeString) as any;
    }
    if (timeString.split(":").length === 2) {
      return parseTime(`00:${timeString}`) as any;
    }
    return null;
  };

  const timeValueToString = (timeValue: any | null): string => {
    if (!timeValue) return "";
    return `${timeValue.hour.toString().padStart(2, "0")}:${timeValue.minute.toString().padStart(2, "0")}:${timeValue.second.toString().padStart(2, "0")}`;
  };

  return (
    <FormProvider {...form}>
      <Card className="p-4 card w-full">
        <CardBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState: { invalid, error } }) => (
                <Field
                  {...field}
                  label="Título"
                  placeholder="Digite o título da oferta"
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
                  label="Descrição"
                  placeholder="Digite a descrição da oferta"
                  labelPlacement="outside"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="trafficNetwork"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Select
                    {...field}
                    label="Rede de tráfego"
                    placeholder="Selecione a rede de tráfego"
                    labelPlacement="outside"
                    selectedKeys={[field.value ?? ""]}
                    onSelectionChange={(v) => field.onChange(v.currentKey)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
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
                name="categoryId"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Select
                    {...field}
                    label="Categoria"
                    placeholder="Selecione a categoria"
                    selectedKeys={[field.value ?? ""]}
                    onSelectionChange={(v) => field.onChange(v.currentKey)}
                    labelPlacement="outside"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  >
                    {(categories?.data || []).map((category) => (
                      <SelectItem key={category.id} textValue={category.title}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="structure"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Select
                    {...field}
                    label="Estrutura"
                    placeholder="Selecione a estrutura"
                    labelPlacement="outside"
                    selectedKeys={[field.value ?? ""]}
                    onSelectionChange={(v) => field.onChange(v.currentKey)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  >
                    {(platforms?.structure || []).map((structure) => (
                      <SelectItem key={structure} textValue={structure}>
                        {structure}
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
                    label="Idioma"
                    placeholder="Selecione um idioma"
                    labelPlacement="outside"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    defaultItems={languages}
                    selectedKey={field.value}
                    onSelectionChange={(key) => field.onChange(key)}
                  >
                    {(language) => (
                      <AutocompleteItem
                        key={language.value}
                        textValue={language.label}
                        startContent={
                          <Avatar alt={language.label} className="w-6 h-6" src={language.flag} />
                        }
                      >
                        {language.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="typeProduct"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Select
                    {...field}
                    label="Tipo de produto"
                    placeholder="Selecione o tipo de produto"
                    labelPlacement="outside"
                    selectedKeys={[field.value ?? ""]}
                    onSelectionChange={(v) => field.onChange(v.currentKey)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  >
                    {(platforms?.typeProduct || []).map((typeProduct) => (
                      <SelectItem key={typeProduct} textValue={typeProduct}>
                        {typeProduct}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                name="pitch"
                control={control}
                render={({ field, fieldState }) => (
                  <TimeInput
                    granularity="second"
                    label="Pitch"
                    value={stringToTimeValue(field.value)}
                    onChange={(timeValue) => field.onChange(timeValueToString(timeValue))}
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                    labelPlacement="outside"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="isClimbing"
                render={({ field }) => (
                  <SwitchForm
                    label="Em escala?"
                    description="Escalar automaticamente"
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="isCloaker"
                render={({ field }) => (
                  <SwitchForm
                    label="Usa Cloaker?"
                    description="Filtrar tráfego"
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>

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
                      <div className="group bg-content1 relative mx-auto aspect-square w-full h-[250px] cursor-pointer rounded-lg overflow-hidden">
                        <Image
                          removeWrapper
                          alt="Imagem do produto"
                          className="z-0 aspect-square h-full w-full object-cover"
                          src={
                            field.value
                              ? URL.createObjectURL(field.value)
                              : offer?.image?.url
                                ? offer.image.url
                                : "https://placehold.co/200x200?text=Adicionar+imagem"
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
                </div>
              )}
            />

            <Button type="submit" color="primary" isLoading={isLoading}>
              Salvar Oferta
            </Button>
          </div>
        </CardBody>
      </Card>
    </FormProvider>
  );
};
