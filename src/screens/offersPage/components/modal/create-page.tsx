import { Field } from "@/components/field/field";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { SchemaPageOutput, schemaPage, SchemaPageInput } from "./schemaPage";
import { useParams } from "next/navigation";
import { useCreateLabsPageMutation } from "@/services/labs/page/labs-page.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { useGetSettingsQuery } from "@/services/settings/settings.service";

export const CreatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [createPage, { isLoading }] = useCreateLabsPageMutation();
  const { data: settings } = useGetSettingsQuery({});

  const { control, reset, handleSubmit } = useForm<SchemaPageInput, any, SchemaPageOutput>({
    resolver: zodResolver(schemaPage),
    defaultValues: {
      makeScraper: false,
    },
  });

  const onSubmit = (data: SchemaPageOutput) => {
    createPage({
      offerId: id as string,
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
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    onOpenChange();
  };
  return (
    <>
      <Button startContent={<Icon icon="solar:add-circle-bold" />} color="primary" onPress={onOpen}>
        Criar Página
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semibold">Criar Página</span>
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
                    <div className="flex flex-col gap-2">
                      <p className="text-sm">Realizar scrapper</p>
                      <Switch isSelected={field.value} onValueChange={field.onChange} />
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
                                        Clique para selecionar o arquivo
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
                                        icon="solar:gallery-bold-duotone"
                                        width={24}
                                        height={24}
                                      />
                                      <p className="text-xs font-medium text-foreground">
                                        Clique para selecionar a imagem
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth onPress={handleClose} variant="flat">
                  Cancelar
                </Button>
                <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
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
