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
import {
  schemaCreateOffer,
  SchemaCreateOfferInput,
  SchemaCreateOfferOutput,
} from "./schemaCreateOffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrafficNetwork, trafficNetworkValues } from "@/types/offer/offer.type";
import { useGetCategoryQuery } from "@/services/category/category.service";
import { useGetSettingsQuery } from "@/services/settings/settings.service";
import { languages } from "@/components/select-language/countries";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { Icon } from "@iconify/react";
import { useCreateSpyOfferMutation } from "@/services/spy/spy-offers.service";
import { useRouter } from "next/navigation";
import { parseTime } from "@internationalized/date";
import { SwitchForm } from "@/components/switch-forms/switch-forms";

export const CreateOffer = () => {
  const router = useRouter();
  const { data: categories } = useGetCategoryQuery({ pageSize: 999 });
  const { data: platforms } = useGetSettingsQuery({});
  const form = useForm<SchemaCreateOfferInput, any, SchemaCreateOfferOutput>({
    resolver: zodResolver(schemaCreateOffer),
    defaultValues: {
      isClimbing: false,
      isCloaker: false,
    },
  });

  const { control, handleSubmit } = form;

  const [createOffer, { isLoading }] = useCreateSpyOfferMutation();

  const onSubmit = (data: SchemaCreateOfferOutput) => {
    createOffer(data)
      .unwrap()
      .then((res) => {
        if ("id" in res) {
          router.push(`/offers/${res.id}/edit`);
        }
      });
  };

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
      <Card className="w-full card p-4">
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
              Criar Oferta
            </Button>
          </div>
        </CardBody>
      </Card>
    </FormProvider>
  );
};
