"use client";

import { AccordionSettings } from "./accordion-settings";
import { Controller, useFormContext } from "react-hook-form";
import { TSchemaSettingsOutput } from "./schemaSettings";
import { formatPhone } from "@/utils/formatPhone";
import { Icon } from "@iconify/react";
import { Input, Accordion, AccordionItem } from "@heroui/react";

const useSettingsHandlers = () => {
  const { setValue, watch, control } = useFormContext<TSchemaSettingsOutput>();
  const formValues = watch();

  const handleAdd = (key: keyof TSchemaSettingsOutput, value: string) => {
    const currentValues = formValues[key] || [];

    if (Array.isArray(currentValues) && !currentValues.includes(value)) {
      setValue(key, [...currentValues, value], { shouldDirty: true });
    }
  };

  const handleRemove = (key: keyof TSchemaSettingsOutput, value: string) => {
    const currentValues = formValues[key] || [];

    if (Array.isArray(currentValues)) {
      setValue(
        key,
        currentValues.filter((v: string) => v !== value),
        { shouldDirty: true },
      );
    }
  };

  return { handleAdd, handleRemove, formValues, setValue, control };
};

export const SettingsRoot = () => {
  const { formValues, handleAdd, handleRemove, control } = useSettingsHandlers();

  const sections = [
    {
      title: "Estrutura",
      subtitle: `${formValues.structure?.length || 0} itens configurados`,
      icon: "solar:folder-bold-duotone",
      values: formValues.structure || [],
      key: "structure" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Tipo de Produto",
      subtitle: `${formValues.typeProduct?.length || 0} itens configurados`,
      icon: "solar:box-bold-duotone",
      values: formValues.typeProduct || [],
      key: "typeProduct" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Tipo de Página",
      subtitle: `${formValues.typePages?.length || 0} itens configurados`,
      icon: "solar:document-bold-duotone",
      values: formValues.typePages || [],
      key: "typePages" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Ângulo de Venda",
      subtitle: `${formValues.salesAngle?.length || 0} itens configurados`,
      icon: "solar:videocamera-record-bold-duotone",
      values: formValues.salesAngle || [],
      key: "salesAngle" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Páginas Excluídas",
      subtitle: `${formValues.excludedPages?.length || 0} itens configurados`,
      icon: "solar:document-bold-duotone",
      values: formValues.excludedPages || [],
      key: "excludedPages" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Produtos Excluídos",
      subtitle: `${formValues.excludedProducts?.length || 0} itens configurados`,
      icon: "solar:close-circle-bold-duotone",
      values: formValues.excludedProducts || [],
      key: "excludedProducts" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Emails Padrão",
      subtitle: `${formValues.email?.length || 0} itens configurados`,
      icon: "solar:letter-bold-duotone",
      values: formValues.email || [],
      key: "email" as keyof TSchemaSettingsOutput,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <AccordionSettings
          key={section.key}
          uniqueKey={section.key}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          values={section.values}
          onAdd={(value) => handleAdd(section.key, value)}
          onRemove={(value) => handleRemove(section.key, value)}
        />
      ))}

      <div id="accordion-supportPhone" className="-mx-2">
        <Accordion
          selectionMode="multiple"
          itemClasses={{
            base: " rounded-lg bg-default-50",
            title: "text-sm font-medium text-foreground",
            trigger: "px-4 py-3",
            content: "px-4 pb-4",
          }}
        >
          <AccordionItem
            key="supportPhone"
            title="Telefone de Suporte"
            subtitle={formatPhone(formValues.supportPhone)}
            startContent={
              <Icon icon="solar:phone-bold-duotone" className="text-primary" fontSize={24} />
            }
          >
            <Controller
              control={control}
              name="supportPhone"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  value={formatPhone(value)}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    let cleaned = rawValue.replace(/\D/g, "");

                    cleaned = "55" + cleaned.replace(/^55?/, "");

                    onChange(cleaned);
                  }}
                  placeholder="Digite o telefone (ex: 11 99999-9999)"
                />
              )}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
