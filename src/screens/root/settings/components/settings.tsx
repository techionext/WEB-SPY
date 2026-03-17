"use client";

import { AccordionSettings } from "./accordion-settings";
import { useFormContext } from "react-hook-form";
import { TSchemaSettingsOutput } from "./schemaSettings";

const useSettingsHandlers = () => {
  const { setValue, watch } = useFormContext<TSchemaSettingsOutput>();
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
        currentValues.filter((item) => item !== value),
        { shouldDirty: true },
      );
    }
  };

  return { formValues, handleAdd, handleRemove };
};

export const SettingsRoot = () => {
  const { formValues, handleAdd, handleRemove } = useSettingsHandlers();

  const sections = [
    {
      title: "Tipo de Produto",
      subtitle: `${formValues.typeProduct?.length || 0} itens configurados`,
      icon: "solar:box-bold-duotone",
      values: formValues.typeProduct || [],
      key: "typeProduct" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Estrutura",
      subtitle: `${formValues.structure?.length || 0} itens configurados`,
      icon: "solar:folder-bold-duotone",
      values: formValues.structure || [],
      key: "structure" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Tipo de Página",
      subtitle: `${formValues.typePages?.length || 0} itens configurados`,
      icon: "solar:document-bold-duotone",
      values: formValues.typePages || [],
      key: "typePages" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Emails Padrão",
      subtitle: `${formValues.email?.length || 0} itens configurados`,
      icon: "solar:letter-bold-duotone",
      values: formValues.email || [],
      key: "email" as keyof TSchemaSettingsOutput,
    },
    {
      title: "Produtos Excluídos",
      subtitle: `${formValues.excludedProducts?.length || 0} itens configurados`,
      icon: "solar:close-circle-bold-duotone",
      values: formValues.excludedProducts || [],
      key: "excludedProducts" as keyof TSchemaSettingsOutput,
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
    </div>
  );
};

export const VideoCategorySettings = () => {
  const { formValues, handleAdd, handleRemove } = useSettingsHandlers();

  return (
    <AccordionSettings
      uniqueKey="videoCategory"
      title="Categorias de Vídeo"
      subtitle={`${formValues.videoCategory?.length || 0} itens configurados`}
      icon="solar:videocamera-record-bold-duotone"
      values={formValues.videoCategory || []}
      onAdd={(value) => handleAdd("videoCategory", value)}
      onRemove={(value) => handleRemove("videoCategory", value)}
    />
  );
};
