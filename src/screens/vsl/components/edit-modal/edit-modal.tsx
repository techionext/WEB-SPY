"use client";

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
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";
import { useUpdateLabsVSLMutation } from "@/services/labs/vsls/labs-vsls.service";
import { SchemaEditVSLInput, SchemaEditVSLOutput, schemaEditVSL } from "./schema-edit";

type EditVSLProps = {
  vsl: ILabsVsl;
  setEditVSL: (vsl: ILabsVsl | null) => void;
};

export const EditVSL = ({ vsl, setEditVSL }: EditVSLProps) => {
  const [updateVSL, { isLoading }] = useUpdateLabsVSLMutation();

  const { control, reset, handleSubmit } = useForm<SchemaEditVSLInput, any, SchemaEditVSLOutput>({
    resolver: zodResolver(schemaEditVSL),
  });

  const onSubmit = async (data: SchemaEditVSLOutput) => {
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
        description: vsl.description || "",
        transcription: vsl.transcriptionVsl || undefined,
      });
    }
  }, [vsl, reset]);

  const handleClose = () => {
    reset({});
    setEditVSL(null);
  };

  return (
    <Modal size="xl" isOpen={!!vsl} onOpenChange={() => setEditVSL(null)} scrollBehavior="inside">
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
                <Icon icon="solar:pen-new-square-linear" className="text-primary text-2xl" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white leading-tight">Editar VSL</h2>
                <p className="text-sm text-default-400 font-medium">{vsl.title}</p>
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
                            Título do VSL
                          </span>
                        </div>
                      }
                      placeholder="Digite o título do VSL"
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
                      placeholder="Digite a descrição do VSL"
                      labelPlacement="outside"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="transcription"
                  render={({ field }) => {
                    const transcription = field.value;
                    const isFile = transcription instanceof File;

                    return (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-default-400 flex items-center gap-2">
                          <Icon icon="solar:file-send-linear" width={16} />
                          Transcrição (opcional)
                        </label>

                        <DropzoneWrapper
                          acceptedTypes={FileTypes.TEXT}
                          onUploadSuccess={(files) => field.onChange(files[0])}
                        >
                          {() => (
                            <div className="group relative w-full h-[100px] overflow-hidden rounded-xl bg-content2 border border-dashed border-default-300 hover:border-primary/50 transition-colors cursor-pointer">
                              {transcription ? (
                                <div className="absolute inset-0 flex items-center h-full justify-between gap-3 p-3 bg-content1">
                                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                      <Icon
                                        icon={
                                          isFile ? "solar:file-send-bold" : "solar:file-check-bold"
                                        }
                                        className="text-primary text-xl"
                                      />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="text-sm font-bold text-white truncate">
                                        {isFile
                                          ? transcription.name
                                          : (transcription as any).text.substring(0, 30) + "..."}
                                      </span>
                                      <span className="text-[10px] text-default-400 font-bold uppercase tracking-wider">
                                        {isFile
                                          ? `${(transcription.size / 1024).toFixed(2)} KB`
                                          : "Arquivo Existente"}
                                      </span>
                                    </div>
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
