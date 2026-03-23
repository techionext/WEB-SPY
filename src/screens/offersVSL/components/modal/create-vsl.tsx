import { Field } from "@/components/field/field";
import {
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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { schemaVSL, SchemaVSLInput, SchemaVSLOutput } from "./schemaVSL";
import { useParams } from "next/navigation";
import { useCreateLabsVSLMutation } from "@/services/labs/vsls/labs-vsls.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";

export const CreateVSL = () => {
  const { id } = useParams<{ id: string }>();
  const [createVSL, { isLoading }] = useCreateLabsVSLMutation();

  const { control, reset, handleSubmit } = useForm<SchemaVSLInput, any, SchemaVSLOutput>({
    resolver: zodResolver(schemaVSL),
  });

  const onSubmit = async (data: SchemaVSLOutput) => {
    const { transcription, ...rest } = data;

    await createVSL({
      offerId: id as string,
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
        title: "",
        description: "",
        transcription: undefined,
      });
    }
  }, [isOpen, reset]);

  return (
    <>
      <Button startContent={<Icon icon="solar:add-circle-bold" />} color="primary" onPress={onOpen}>
        Criar VSL
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semold">Criar VSL</span>
              </ModalHeader>
              <ModalBody className="gap-4 flex flex-col">
                <Controller
                  control={control}
                  name="title"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field
                      {...field}
                      label="Título do VSL"
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
                      label="Descrição do VSL"
                      placeholder="Digite a descrição do VSL"
                      labelPlacement="outside"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      rows={4}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="transcription"
                  render={({ field }) => {
                    const file = field.value as File | undefined;

                    return (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">Transcrição</label>

                        <DropzoneWrapper
                          acceptedTypes={FileTypes.TEXT}
                          onUploadSuccess={(files) => field.onChange(files[0])}
                        >
                          {() => (
                            <>
                              {file ? (
                                <div className="flex items-center h-[100px] justify-between gap-3 rounded-md border bg-content1 p-3">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{file.name}</span>
                                    <span className="text-xs text-foreground-500">
                                      {(file.size / 1024).toFixed(2)} KB ·{" "}
                                      {file.type || "tipo desconhecido"}
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
                                  <div className="flex flex-col items-center justify-center gap-2 bg-content2 rounded-lg p-4 border border-dashed border-foreground-500">
                                    <Icon
                                      icon="solar:file-send-bold-duotone"
                                      width={40}
                                      height={40}
                                    />
                                    <p className="text-sm font-medium text-foreground">
                                      Clique para selecionar a transcrição
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
