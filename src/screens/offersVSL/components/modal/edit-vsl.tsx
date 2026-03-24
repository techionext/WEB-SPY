import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { Field } from "@/components/field/field";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { SchemaVSLInput, SchemaVSLOutput, schemaVSL } from "./schemaVSL";
import { useEffect } from "react";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import { useUpdateLabsVSLMutation } from "@/services/labs/vsls/labs-vsls.service";

type EditVSLProps = {
  vsl: ILabsVsl;
  setEditVSL: (vsl: ILabsVsl | null) => void;
};

export const EditVSL = ({ vsl, setEditVSL }: EditVSLProps) => {
  const [updateVSL, { isLoading }] = useUpdateLabsVSLMutation();

  const { control, reset, handleSubmit } = useForm<SchemaVSLInput, any, SchemaVSLOutput>({
    resolver: zodResolver(schemaVSL),
  });

  const onSubmit = async (data: SchemaVSLOutput) => {
    const { transcription, ...rest } = data;

    await updateVSL({
      id: vsl.id,
      ...rest,
      transcription: transcription instanceof File ? transcription : undefined,
    }).unwrap();
    handleClose();
  };

  useEffect(() => {
    if (vsl) {
      reset({
        title: vsl.title,
        description: vsl.description,
        transcription: vsl.transcriptionVsl
          ? { id: vsl.transcriptionVsl.id, text: vsl.transcriptionVsl.text }
          : undefined,
      });
    }
  }, [vsl, reset]);

  const handleClose = () => {
    reset({});
    setEditVSL(null);
  };

  return (
    <>
      <Modal size="xl" isOpen={!!vsl} onOpenChange={() => setEditVSL(null)}>
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semold">Editar VSL</span>
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
                                    <span className="text-sm font-medium">
                                      {file instanceof File
                                        ? file.name
                                        : (file as any).text.substring(0, 30) + "..."}
                                    </span>
                                    <span className="text-xs text-foreground-500">
                                      {file instanceof File ? (
                                        <>
                                          {(file.size / 1024).toFixed(2)} KB ·{" "}
                                          {file.type || "tipo desconhecido"}
                                        </>
                                      ) : (
                                        (file as any).id
                                      )}
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
                  Salvar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
