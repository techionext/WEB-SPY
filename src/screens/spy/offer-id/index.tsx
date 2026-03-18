"use client";

import { Header } from "@/components/header";
import { useParams } from "next/navigation";
import { MethodHeaderCard } from "./components/method-header-card";
import { ActiveAdsCard } from "./components/active-ads-card";
import { MetricCard } from "./components/metric-card";
import { GraphCard } from "./components/graph-card";
import { useGetSpyOfferByIdQuery } from "@/services/spy/spy-offers.service";
import { Spinner, Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { CreativesTabOffer } from "./components/creative-offer-tabs/creatives-tab-offer";
import { OffersVSL } from "./components/vsls-offers-tabs/offers-VSL";
import { OfferQuiz } from "./components/offer-quiz/offer-quiz";
import { formatCompactNumber } from "@/utils/formatNumber";

export const ScreenSpyOfferId = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching } = useGetSpyOfferByIdQuery(
    { id: id as string },
    { skip: !id },
  );
  const [selectedTab, setSelectedTab] = useState("creatives");

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const tabs = [
    {
      key: "creatives",
      label: "Criativos",
      icon: "fluent:image-24-regular",
      content: <CreativesTabOffer />,
    },
    {
      key: "vsls",
      label: "VSLs",
      icon: "fluent:video-24-regular",
      content: <OffersVSL />,
    },
    {
      key: "quiz",
      label: "Quiz",
      icon: "solar:question-circle-outline",
      content: <OfferQuiz />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 grow">
      <Header
        title="Detalhes da oferta"
        description="Veja as informações detalhadas da oferta selecionada."
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <MethodHeaderCard data={data} />
        </div>

        <ActiveAdsCard
          total={data?.adQuantity ?? 0}
          description={data?.description ?? "Descrição não disponível."}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Criativos"
          value={data?.amountCreative ?? 0}
          icon="solar:gallery-outline"
        />
        <MetricCard title="VSLs" value={data?.amountVsl ?? 0} icon="solar:chat-round-video-bold" />
        <MetricCard title="Páginas" value={data?.amountPages ?? 0} icon="solar:document-outline" />
        <MetricCard
          title="Acessos"
          value={formatCompactNumber(data?.totalClicks ?? 0)}
          icon="solar:round-arrow-right-up-linear"
        />
      </div>

      <GraphCard />

      <div className="flex flex-col gap-1 min-w-0 overflow-hidden w-full">
        <Tabs
          selectedKey={selectedTab}
          size="sm"
          variant="solid"
          color="primary"
          radius="lg"
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={{
            tabList: "bg-default-100 gap-2",
            tab: "h-8 px-2",
            tabContent:
              "group-data-[selected=true]:text-foreground group-data-[selected=false]:text-default-500",
          }}
          fullWidth
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              title={
                <div className="flex items-center gap-2">
                  <Icon
                    icon={tab.icon}
                    className="text-lg group-data-[selected=true]:text-foreground group-data-[selected=false]:text-default-500"
                  />
                  <span>{tab.label}</span>
                </div>
              }
            >
              {tab.content}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
