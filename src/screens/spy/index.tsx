"use client";

import { Tab, Tabs } from "@heroui/react";
import { SpyCommunity } from "./components/spy-community";
import { Header } from "@/components/header";
import { OffersTab } from "./offers/offers-tab";
import { CreativesTab } from "./creatives/creatives-tab";
import { useFilterByUnique } from "@/hooks/useFilterByUnique";

export const ScreenSpy = () => {
  const { onChangeValue, value } = useFilterByUnique({
    queryKey: "tab",
    resetPaginationOnChange: true,
  });
  const content = {
    offers: <OffersTab />,
    creatives: <CreativesTab />,
  };

  const tab = value || "offers";
  return (
    <div className="flex flex-col gap-4">
      <Header
        title="Spy Center"
        description="Veja as ofertas, criativos e páginas que você está participando."
      />
      <div className="flex gap-4">
        <div className="grow flex flex-col gap-4">
          <Tabs
            selectedKey={tab}
            onSelectionChange={(key) => onChangeValue(key as string)}
            radius="lg"
            fullWidth
            // classNames={{
            //   tabList: "bg-default-200",
            //   tabContent: "group-data-[selected=true]:text-white",
            //   cursor: "bg-linear-to-r from-primary to-primary/50",
            // }}
          >
            <Tab key="offers" title="Ofertas" />
            <Tab key="creatives" title="Criativos" />
          </Tabs>
          {content[tab as keyof typeof content]}
        </div>
        <SpyCommunity />
      </div>
    </div>
  );
};
