"use client";

import { Field } from "@/components/field/field";
import { schemaSeason, SchemaSeasonInput, SchemaSeasonOutput } from "./schemaSeason";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useCreateSeasonMutation } from "@/services/session/season.service";

export const ModalCreateSeason = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createSeason, { isLoading }] = useCreateSeasonMutation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SchemaSeasonInput, any, SchemaSeasonOutput>({
    resolver: zodResolver(schemaSeason),
    defaultValues: {
      title: "",
      current: false,
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data: SchemaSeasonOutput) => {
    createSeason({
      title: data.title,
      current: data.current ?? false,
      startDate: data.startDate,
      endDate: data.endDate,
    })
      .unwrap()
      .then(() => handleClose());
  };

  const handleClose = () => {
    reset();
    onOpenChange();
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="ml-auto mr-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Adicionar
      </div>

      <Modal isOpen={isOpen} onOpenChange={handleClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-semibold">Nova Temporada</span>
              </ModalHeader>

              <ModalBody className="gap-4">
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Field
                      {...field}
                      label="Título"
                      placeholder="Nome da temporada"
                      errorMessage={errors.title?.message}
                    />
                  )}
                />

                <div className="flex gap-4">
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <Field
                        {...field}
                        type="date"
                        label="Data de Início"
                        errorMessage={errors.startDate?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <Field
                        {...field}
                        type="date"
                        label="Data de Fim"
                        errorMessage={errors.endDate?.message}
                      />
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name="current"
                  render={({ field }) => (
                    <Switch
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      classNames={{
                        base: "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: "w-6 h-6 border-2 shadow-lg",
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Marcar como temporada atual</p>
                        <p className="text-xs text-default-500">
                          Apenas uma temporada pode ser marcada como atual
                        </p>
                      </div>
                    </Switch>
                  )}
                />
              </ModalBody>

              <ModalFooter className="border-t border-default-200">
                <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading} isDisabled={isLoading}>
                  Criar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
