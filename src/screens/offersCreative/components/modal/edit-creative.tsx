import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { Field } from "@/components/field/field";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
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
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  SchemaEditCreativeInput,
  SchemaEditCreativeOutput,
  schemaEditCreative,
} from "./schemaCreative";
import { useParams } from "next/navigation";
import { useUpdateLabsCreativeMutation } from "@/services/creative/creative.service";
import { useEffect } from "react";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { VideoPlayer } from "@/components/videoplayer/video-player";
import { Icon } from "@iconify/react";
import { TrafficNetwork, trafficNetworkValues } from "@/types/offer/offer.type";
import { languages } from "@/components/select-language/countries";
import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import { SwitchForm } from "@/components/switch-forms/switch-forms";

type EditCreativeProps = {
  creative: ILabsCreative;
  setEditCreative: (creative: ILabsCreative | null) => void;
};

export const EditCreative = ({ creative, setEditCreative }: EditCreativeProps) => {
  const { id } = useParams<{ id: string }>();
  const [updateCreative, { isLoading }] = useUpdateLabsCreativeMutation();
  const { data: pages } = useGetLabsPagesQuery({ offerId: id as string }, { skip: !id });

  const { control, reset, handleSubmit } = useForm<
    SchemaEditCreativeInput,
    any,
    SchemaEditCreativeOutput
  >({
    resolver: zodResolver(schemaEditCreative),
  });

  const onSubmit = async (data: SchemaEditCreativeOutput) => {
    await updateCreative({
      id: creative.id,
      offerId: id as string,
      ...data,
      status: data.status ?? true,
      isClimbing: data.isClimbing ?? false,
    } as any).unwrap();
    handleClose();
  };

  useEffect(() => {
    if (creative) {
      reset({
        title: creative.title,
        description: creative.description,
        language: creative.language,
        isClimbing: creative.isClimbing,
        trafficNetwork: creative.trafficNetwork,
        salesAngle: creative.salesAngle,
        image: undefined,
      });
    }
  }, [creative, reset]);

  const handleClose = () => {
    reset({});
    setEditCreative(null);
  };

  return (
    <>
      <Modal
        size="xl"
        isOpen={!!creative}
        onOpenChange={() => setEditCreative(null)}
        scrollBehavior="inside"
      >
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semibold">Editar Criativo</span>
              </ModalHeader>
              <ModalBody className="gap-4 flex flex-col">
                <Controller
                  control={control}
                  name="title"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field
                      {...field}
                      label="Título do Criativo"
                      placeholder="Digite o título do criativo"
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
                      placeholder="Digite a descrição do criativo"
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
                        selectedKeys={[field.value ?? ""]}
                        onSelectionChange={(v) => field.onChange(v.currentKey)}
                      >
                        {(Object.values(TrafficNetwork) as TrafficNetwork[]).map(
                          (trafficNetwork) => (
                            <SelectItem
                              key={trafficNetwork}
                              textValue={trafficNetworkValues[trafficNetwork].label}
                              startContent={
                                <Icon icon={trafficNetworkValues[trafficNetwork].icon} width={16} />
                              }
                            >
                              {trafficNetworkValues[trafficNetwork].label}
                            </SelectItem>
                          ),
                        )}
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
                              <Avatar
                                alt={language.label}
                                className="w-6 h-6"
                                src={language.flag}
                              />
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
                    name="salesAngle"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Field
                        {...field}
                        label="Ângulo de venda"
                        placeholder="Digite o ângulo de venda"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="pageId"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Select
                        {...field}
                        label="Página"
                        placeholder="Selecione a página"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={[field.value ?? ""]}
                        onSelectionChange={(v) => field.onChange(v.currentKey)}
                      >
                        {(pages?.data || []).map((page) => (
                          <SelectItem key={page.id} textValue={page.title}>
                            {page.title}
                          </SelectItem>
                        ))}
                      </Select>
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
                    name="status"
                    render={({ field }) => (
                      <SwitchForm
                        label="Status ativo?"
                        description="Ativo no momento"
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
                      <label className="text-sm font-medium text-foreground">Imagem/Vídeo</label>
                      <DropzoneWrapper
                        acceptedTypes={FileTypes.ANY}
                        onUploadSuccess={(v) => field.onChange(v[0])}
                      >
                        {() => (
                          <div className="group bg-content1 relative mx-auto aspect-square w-full h-[250px] cursor-pointer rounded-lg overflow-hidden">
                            {(() => {
                              if (field.value instanceof File) {
                                if (field.value.type.startsWith("video")) {
                                  return <VideoPlayer url={URL.createObjectURL(field.value)} />;
                                }

                                return (
                                  <Image
                                    removeWrapper
                                    alt="Imagem do criativo"
                                    className="z-0 aspect-square h-full w-full object-cover"
                                    src={URL.createObjectURL(field.value)}
                                  />
                                );
                              }

                              if (creative?.image?.url) {
                                const isVideo = creative.image.mimeType?.startsWith("video");

                                return isVideo ? (
                                  <VideoPlayer url={creative.image.url} />
                                ) : (
                                  <Image
                                    removeWrapper
                                    alt="Imagem do criativo"
                                    className="z-0 aspect-square h-full w-full object-cover"
                                    src={creative.image.url}
                                  />
                                );
                              }

                              return (
                                <Image
                                  removeWrapper
                                  alt="Imagem do criativo"
                                  className="z-0 aspect-square h-full w-full object-cover"
                                  src="https://placehold.co/600x400?text=Sem+imagem"
                                />
                              );
                            })()}

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
              </ModalBody>
              <ModalFooter>
                <Button fullWidth onPress={handleClose} variant="flat">
                  Cancelar
                </Button>
                <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
                  Editar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
