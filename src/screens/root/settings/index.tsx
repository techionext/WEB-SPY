"use client";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HeaderSettings } from "./components/header-settings";
import { SettingsRoot } from "./components/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  schemaSettings,
  TSchemaSettingsInput,
  TSchemaSettingsOutput,
} from "./components/schemaSettings";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/services/settings/settings.service";
import { FastNavigation } from "./components/fast-navigation";
import { AccordionNavigationProvider } from "./components/accordion-navigation-context";
import { AccordionCategory } from "./components/categories/accordion-category";

export const ScreenRootSettings = () => {
  const { data: settings } = useGetSettingsQuery({});
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const form = useForm<TSchemaSettingsInput, any, TSchemaSettingsOutput>({
    resolver: zodResolver(schemaSettings),
    defaultValues: {
      structure: [],
      typeProduct: [],
      typePages: [],
      email: [],
      excludedProducts: [],
      excludedPages: [],
      salesAngle: [],
      supportPhone: "55",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (settings) {
      reset({
        structure: settings.structure || [],
        typeProduct: settings.typeProduct || [],
        typePages: settings.typePages || [],
        email: settings.email || [],
        excludedProducts: settings.excludedProducts || [],
        excludedPages: settings.excludedPages || [],
        salesAngle: settings.salesAngle || [],
        supportPhone: settings.supportPhone || "55",
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: TSchemaSettingsOutput) => {
    updateSettings(data).unwrap();
  };

  return (
    <AccordionNavigationProvider>
      <div className="flex flex-col grow gap-4">
        <FormProvider {...form}>
          <HeaderSettings onSubmit={onSubmit} isLoading={isLoading} />
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <AccordionCategory />
              <SettingsRoot />
            </div>
            <FastNavigation onSubmit={onSubmit} isLoading={isLoading} />
          </div>
        </FormProvider>
      </div>
    </AccordionNavigationProvider>
  );
};
