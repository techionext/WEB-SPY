"use client";

import { Field } from "@/components/field/field";
import { schemaSeason, SchemaSeasonInput, SchemaSeasonOutput } from "./schemaSeason";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Switch,
  DatePicker,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { ILabsSeason } from "@/types/labs/season/labs-season.type";
import { useEffect } from "react";
import { useUpdateSeasonMutation } from "@/services/session/season.service";
import { parseDate } from "@internationalized/date";
import dayjs from "@/utils/dayjs-config";

interface ModalEditSeasonProps extends Omit<ModalProps, "children"> {
  season: (ILabsSeason & { current?: boolean; startDate?: string; endDate?: string }) | null;
}

export const ModalEditSeason = ({
  isOpen,
  onOpenChange,
  season,
  ...rest
}: ModalEditSeasonProps) => {
  const [updateSeason, { isLoading }] = useUpdateSeasonMutation();

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

  useEffect(() => {
    if (season && isOpen) {
      reset({
        title: season.title,
        current: season.current || false,
        startDate: season.startDate || "",
        endDate: season.endDate || "",
      });
    }
  }, [season, isOpen, reset]);

  const onSubmit = (data: SchemaSeasonOutput) => {
    if (!season) return;

    updateSeason({
      id: season.id,
      title: data.title,
      current: data.current ?? false,
      startDate: data.startDate,
      endDate: data.endDate,
    })
      .unwrap()
      .then(() => {
        handleClose();
      });
  };

  const handleClose = () => {
    reset();
    onOpenChange?.(false);
  };

  const parseDateValue = (
    dateString: string | undefined | null,
  ): ReturnType<typeof parseDate> | null => {
    if (!dateString || dateString.trim() === "") return null;

    try {
      let dateOnly = dateString;
      if (dateString.includes("T")) {
        dateOnly = dateString.split("T")[0];
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
        const parsed = dayjs(dateString);
        if (!parsed.isValid()) return null;
        dateOnly = parsed.format("YYYY-MM-DD");
      }

      return parseDate(dateOnly);
    } catch {
      return null;
    }
  };

  if (!season) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="lg" {...rest}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-xl font-semibold">Editar Temporada</span>
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
                  render={({ field }) => {
                    const dateValue = parseDateValue(field.value);
                    return (
                      <DatePicker
                        label="Data de Início"
                        labelPlacement="outside"
                        isRequired
                        granularity="day"
                        value={dateValue}
                        onChange={(value) => {
                          field.onChange(value ? value.toString() : "");
                        }}
                        errorMessage={errors.startDate?.message}
                        isInvalid={!!errors.startDate}
                        classNames={{
                          base: "w-full",
                        }}
                      />
                    );
                  }}
                />

                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => {
                    const dateValue = parseDateValue(field.value);
                    return (
                      <DatePicker
                        label="Data de Fim"
                        labelPlacement="outside"
                        isRequired
                        granularity="day"
                        value={dateValue}
                        onChange={(value) => {
                          field.onChange(value ? value.toString() : "");
                        }}
                        errorMessage={errors.endDate?.message}
                        isInvalid={!!errors.endDate}
                        classNames={{
                          base: "w-full",
                        }}
                      />
                    );
                  }}
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
                Salvar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
