"use client";

import { Tab, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetSettingsQuery } from "@/services/settings/settings.service";
import { ListCreatives } from "../creatives/components/list-creatives";
import { ListPages } from "../pages/components/list-pages";
import { CardOffer } from "./components/card-offer";
import Graph from "./components/graph";
import { VslCard } from "./components/vsl-card";

export const ScreenOfferView = () => {
  const params = useParams();
  const rawId = params?.id;
  const offerId = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data: settings } = useGetSettingsQuery({});
  const typePages = settings?.typePages ?? [];

  const [pageTypeKey, setPageTypeKey] = useState<string | undefined>();

  useEffect(() => {
    if (pageTypeKey && !typePages.includes(pageTypeKey)) {
      setPageTypeKey(undefined);
    }
  }, [typePages, pageTypeKey]);

  const activePageType = typePages.length === 0 ? undefined : (pageTypeKey ?? typePages[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CardOffer />
        <Graph />
      </div>
      <VslCard />
      <p className="text-sm font-semibold text-foreground">Criativos</p>
      <ListCreatives offerId={offerId} />
      <p className="text-sm font-semibold text-foreground">Páginas</p>
      {typePages.length > 0 ? (
        <>
          <Tabs
            fullWidth
            selectedKey={activePageType}
            onSelectionChange={(key) => setPageTypeKey(String(key))}
          >
            {typePages.map((label) => (
              <Tab key={label} title={label} />
            ))}
          </Tabs>
          <ListPages
            offerId={offerId}
            noEmpty
            type={activePageType ? [activePageType] : undefined}
          />
        </>
      ) : (
        <ListPages offerId={offerId} noEmpty />
      )}
    </div>
  );
};
