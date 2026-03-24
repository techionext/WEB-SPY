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
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SchemaPageInput, SchemaPageOutput, schemaPage } from "./schema-edit";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { useUpdateLabsPageMutation } from "@/services/labs/page/labs-page.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { Icon } from "@iconify/react";
import { useGetSettingsQuery } from "@/services/settings/settings.service";
import { SwitchForm } from "@/components/switch-forms/switch-forms";

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
    } catch (_error) {
      // Silence error
    }
  };

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        description: page.description,
        url: page.url,
        type: page.type,
        makeScraper: page.makeScraper ?? false,
        file: undefined,
        image: undefined,
      });
    }
  }, [page, reset]);

  const handleClose = () => {
    reset({});
    setEditPage(null);
  };

  return (
    <Modal size="xl" isOpen={!!page} onOpenChange={() => setEditPage(null)} scrollBehavior="inside">
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
                <Icon icon="solar:pen-new-square-linear" className="text-primary text-2xl" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white leading-tight">Editar Página</h2>
                <p className="text-sm text-default-400 font-medium">{page.title}</p>
              </div>
            </ModalHeader>
            <ModalBody className="gap-6 pt-6 pb-8">
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

                <Controller
                  control={control}
                  name="makeScraper"
                  render={({ field }) => (
                    <div className="group">
                      <SwitchForm
                        label="Criar Scraper?"
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
                                  <>
                                    {page?.file ? (
                                      <>
                                        <div className="absolute inset-0 flex items-center gap-3 p-3">
                                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <Icon
                                              icon="solar:file-check-bold"
                                              className="text-primary text-xl"
                                            />
                                          </div>
                                          <div className="flex flex-col overflow-hidden flex-1">
                                            <span className="text-sm font-bold text-white truncate">
                                              {page.file.key.split("/").pop()}
                                            </span>
                                            <span className="text-[10px] text-default-400 font-bold uppercase tracking-wider">
                                              Arquivo Existente
                                            </span>
                                          </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                                              Alterar arquivo
                                            </p>
                                          </div>
                                        </div>
                                      </>
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
                                  </>
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
                                <div className="absolute inset-0 z-5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Icon
                                    className="h-6 w-6 text-white"
                                    icon="solar:gallery-add-bold-duotone"
                                  />
                                </div>
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
                Salvar alterações
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
