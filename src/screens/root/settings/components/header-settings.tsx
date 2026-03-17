"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormContext } from "react-hook-form";
import { TSchemaSettingsOutput } from "./schemaSettings";

interface HeaderSettingsProps {
  onSubmit: (data: TSchemaSettingsOutput) => void;
  isLoading?: boolean;
}

export const HeaderSettings = ({ onSubmit, isLoading = false }: HeaderSettingsProps) => {
  const {
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<TSchemaSettingsOutput>();

  return (
    <div className="p-6 w-full bg-default-100 flex items-center gap-4 rounded-2xl">
      <div className="w-12 h-12 bg-default-200 items-center justify-center rounded-2xl flex">
        <Icon icon="solar:settings-bold-duotone" width={32} />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-2xl font-bold">Configurações da Plataforma</p>
        <p className="text-sm text-default-500">Gerencie as configurações globais do sistema</p>
      </div>
      <Button
        color="primary"
        onPress={() => handleSubmit(onSubmit)()}
        isLoading={isLoading}
        isDisabled={!isDirty}
      >
        Salvar
      </Button>
    </div>
  );
};
