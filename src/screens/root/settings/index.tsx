"use client";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HeaderSettings } from "./components/header-settings";
import { SettingsRoot, VideoCategorySettings } from "./components/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  schemaSettings,
  TSchemaSettingsInput,
  TSchemaSettingsOutput,
} from "./components/schemaSettings";
import {
  useGetPlataformSettingsQuery,
  useUpdatePlataformSettingsMutation,
} from "@/services/settings/platform-settings.service";
import { AccordionCategory } from "./components/categories/accordion-category";
import { AccordionSeason } from "./components/seasons/accordion-season";
import { FastNavigation } from "./components/fast-navigation";
import { AccordionNavigationProvider } from "./components/accordion-navigation-context";
import { AccordionCommunityArea } from "./components/academy/community-areas/accordion-community-areas";
import { AccordionProducer } from "./components/academy/producers/accordion-producer";

export const ScreenRootSettings = () => {
  const { data: settings } = useGetPlataformSettingsQuery({});
  const [updatePlataformSettings, { isLoading }] = useUpdatePlataformSettingsMutation();

  const form = useForm<TSchemaSettingsInput, any, TSchemaSettingsOutput>({
    resolver: zodResolver(schemaSettings),
    defaultValues: {
      structure: [],
      funnel: [],
      typeProduct: [],
      typePages: [],
      videoCategory: [],
      email: [],
      excludedProducts: [],
      excludedPages: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (settings) {
      reset({
        structure: settings.structure || [],
        funnel: settings.funnel || [],
        typeProduct: settings.typeProduct || [],
        typePages: settings.typePages || [],
        videoCategory: settings.videoCategory || [],
        email: settings.email || [],
        excludedProducts: settings.excludedProducts || [],
        excludedPages: settings.excludedPages || [],
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: TSchemaSettingsOutput) => {
    updatePlataformSettings(data).unwrap();
  };

  const [navigationType, setNavigationType] = useState<"academy" | "settings">("settings");

  return (
    <AccordionNavigationProvider>
      <div className="flex flex-col grow gap-4">
        <FormProvider {...form}>
          <HeaderSettings onSubmit={onSubmit} isLoading={isLoading} />
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-4">
              {navigationType === "settings" ? (
                <>
                  <AccordionCategory />
                  <AccordionSeason />
                  <SettingsRoot />
                </>
              ) : (
                <>
                  <AccordionCommunityArea />
                  <AccordionProducer />
                  <VideoCategorySettings />
                </>
              )}
            </div>
            <FastNavigation
              onSubmit={onSubmit}
              isLoading={isLoading}
              navigationType={navigationType}
              onNavigate={setNavigationType}
            />
          </div>
        </FormProvider>
      </div>
    </AccordionNavigationProvider>
  );
};
