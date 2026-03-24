"use client";
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
import { Controller, useForm } from "react-hook-form";
import { SchemaArchiveInput, SchemaArchiveOutput, schemaArchive } from "./schema-archive";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { useArchivePageMutation } from "@/services/labs/page/labs-page.service";
import { Icon } from "@iconify/react";

type ModalArchiveProps = {
  page: ILabsPage;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
};

export const ModalArchive = ({ page, isOpen, onOpenChange, onClose }: ModalArchiveProps) => {
  const [archivePage, { isLoading }] = useArchivePageMutation();

  const { control, reset, handleSubmit } = useForm<SchemaArchiveInput, any, SchemaArchiveOutput>({
    resolver: zodResolver(schemaArchive),
    defaultValues: {
      archiveReason: "",
    },
  });

  const onSubmit = async (data: SchemaArchiveOutput) => {
    await archivePage({
      id: page.id,
      archiveReason: data.archiveReason,
    })
      .unwrap()
      .then(() => {
        onClose();
        reset();
      });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border-1 border-warning/20">
                <Icon icon="solar:archive-bold" className="text-warning text-2xl" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold  leading-tight">Arquivar Página</h2>
                <p className="text-sm text-default-400 font-medium">
                  Confirme o motivo do arquivamento
                </p>
              </div>
            </ModalHeader>
            <ModalBody className="gap-6 pt-6 pb-8">
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="archiveReason"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Textarea
                      {...field}
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:notes-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Motivo do Arquivamento
                          </span>
                        </div>
                      }
                      placeholder="Descreva o motivo pelo qual esta página está sendo arquivada..."
                      labelPlacement="outside"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      variant="bordered"
                      classNames={{
                        inputWrapper:
                          "bg-content2 border-divider hover:border-warning/50 focus-within:!border-warning/50 transition-colors",
                      }}
                    />
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-default-100/50 py-6 gap-3">
              <Button fullWidth onPress={handleClose} variant="flat">
                Cancelar
              </Button>
              <Button
                fullWidth
                color="warning"
                type="submit"
                isLoading={isLoading}
                className=" font-bold"
              >
                <Icon icon="solar:archive-bold" className="text-lg" />
                Arquivar agora
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
