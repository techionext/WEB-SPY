"use client";

import { Header } from "@/components/header";
import { ItemCard } from "./components/item-card";
import { DrawerEdit } from "./components/drawer-edit";
import { useState } from "react";
import {
  useGetAnalysisMetricsQuery,
  useGetAnalysisRequestByIdQuery,
} from "@/services/analysis-request/analysis-request.service";
import { HeaderCards } from "./components/header-cards";
import { FilterSolicitations } from "./filter";

export const ScreenSolicitations = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { data: analysisRequest, isLoading: isLoadingAnalysisRequest } =
    useGetAnalysisRequestByIdQuery(
      { id: selectedRequestId as string },
      { skip: !selectedRequestId },
    );

  const handleOpenDrawer = (id: string) => {
    setSelectedRequestId(id);
    setIsDrawerOpen(true);
  };

  const { data: analysisMetrics } = useGetAnalysisMetricsQuery({});

  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) setSelectedRequestId(null);
  };

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <Header
        title="Solicitações Recebidas"
        description="Veja as solicitações recebidas por você."
      />
      <div className="flex min-w-0 w-full items-start gap-4">
        <div className="min-w-0 flex-1 flex flex-col gap-4">
          <HeaderCards />
          <ItemCard handleOpen={handleOpenDrawer} />
        </div>
        <FilterSolicitations />
        <DrawerEdit
          isOpen={isDrawerOpen}
          onOpenChange={handleDrawerChange}
          analysisRequest={analysisRequest}
          isLoading={isLoadingAnalysisRequest}
        />
      </div>
    </div>
  );
};

export const ScreenMySolicitations = ScreenSolicitations;
