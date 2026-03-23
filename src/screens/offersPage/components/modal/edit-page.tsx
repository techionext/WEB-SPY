import { Field } from "@/components/field/field";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SchemaPageInput, SchemaPageOutput, schemaPage } from "./schemaPage";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { useUpdateLabsPageMutation } from "@/services/labs/page/labs-page.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { Icon } from "@iconify/react";
import { useGetSettingsQuery } from "@/services/settings/settings.service";

type EditPageProps = {
  page: ILabsPage;
  setEditPage: (page: ILabsPage | null) => void;
};

export const EditPage = ({ page, setEditPage }: EditPageProps) => {
  const { id } = useParams<{ id: string }>();
  const [updatePage, { isLoading }] = useUpdateLabsPageMutation();
  const { data: settings } = useGetSettingsQuery({});

  const { control, reset, handleSubmit } = useForm<SchemaPageInput, any, SchemaPageOutput>({
    resolver: zodResolver(schemaPage),
  });

  const onSubmit = async (data: SchemaPageOutput) => {
    try {
      await updatePage({
        id: page.id,
        offerId: id as string,
        ...data,
        makeScraper: data.makeScraper ?? false,
      }).unwrap();
      setEditPage(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        description: page.description,
        url: page.url,
        type: page.type,
        makeScraper: false,
        file: page.file ? new File([page.file.url], page.file.url) : undefined,
        image: undefined,
      });
    }
  }, [page, reset]);

  const handleClose = () => {
    reset({});
    setEditPage(null);
  };

  return (
    <>
      <Modal
        size="xl"
        isOpen={!!page}
        onOpenChange={() => setEditPage(null)}
        scrollBehavior="inside"
      >
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semibold">Editar Página</span>
              </ModalHeader>
              <ModalBody className="gap-4 flex flex-col">
                <Controller
                  control={control}
                  name="title"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field
                      {...field}
                      label="Título da Página"
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
                      label="Descrição"
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
                      label="URL da Página"
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
                      label="Tipo de página"
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

                <Controller
                  control={control}
                  name="makeScraper"
                  render={({ field }) => (
                    <Switch isSelected={field.value} onValueChange={field.onChange}>
                      Criar Scraper?
                    </Switch>
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
                          <label className="text-sm font-medium text-foreground">
                            Arquivo (opcional)
                          </label>

                          <DropzoneWrapper
                            acceptedTypes={FileTypes.ANY}
                            onUploadSuccess={(files) => field.onChange(files[0])}
                          >
                            {() => (
                              <>
                                {file ? (
                                  <div className="flex items-center h-[100px] justify-between gap-3 rounded-md border bg-content1 p-3">
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="text-sm font-medium truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-xs text-foreground-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                      </span>
                                    </div>

                                    <Button
                                      isIconOnly
                                      type="button"
                                      onPress={() => field.onChange(undefined)}
                                      color="danger"
                                      variant="flat"
                                      size="sm"
                                    >
                                      <Icon icon="solar:trash-bin-trash-bold-duotone" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="w-full h-[100px] cursor-pointer rounded-lg">
                                    <div className="flex flex-col items-center justify-center gap-1 bg-content2 rounded-lg p-2 border border-dashed border-foreground-500 h-full text-center">
                                      <Icon
                                        icon="solar:file-send-bold-duotone"
                                        width={24}
                                        height={24}
                                      />
                                      <p className="text-xs font-medium text-foreground">
                                        {page?.file
                                          ? "Alterar arquivo"
                                          : "Clique para selecionar o arquivo"}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </>
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
                          <label className="text-sm font-medium text-foreground">
                            Imagem (opcional)
                          </label>

                          <DropzoneWrapper
                            acceptedTypes={FileTypes.IMAGE}
                            onUploadSuccess={(files) => field.onChange(files[0])}
                          >
                            {() => (
                              <div className="group bg-content1 relative mx-auto aspect-square w-full h-[100px] cursor-pointer rounded-lg overflow-hidden border border-dashed border-foreground-500">
                                <Image
                                  removeWrapper
                                  alt="Imagem da página"
                                  className="z-0 aspect-square h-full w-full object-cover"
                                  src={
                                    file
                                      ? URL.createObjectURL(file)
                                      : page?.image?.url
                                        ? page?.image?.url
                                        : "https://placehold.co/100x100?text=Sem+imagem"
                                  }
                                />
                                <div className="absolute inset-0 z-5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Icon
                                  className="absolute top-1/2 left-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  icon="solar:gallery-add-bold-duotone"
                                />
                              </div>
                            )}
                          </DropzoneWrapper>
                        </div>
                      );
                    }}
                  />
                </div>
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
