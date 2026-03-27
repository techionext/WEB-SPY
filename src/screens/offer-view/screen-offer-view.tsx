"use client";

import { Tab, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetSettingsQuery } from "@/services/settings/settings.service";
import { ListCreatives } from "../creatives/components/list-creatives";
import { CardOffer } from "./components/card-offer";
import Graph from "./components/graph";
import { VslCard } from "./components/vsl-card";
import { ListPagesOffers } from "@/components/list-pages-offers/list-pages-offers";
import { CardInsider } from "./components/card-insider";
import { useGetSpyOfferByIdQuery } from "@/services/spy/spy-offers.service";

export const ScreenOfferView = () => {
  const params = useParams();
  const rawId = params?.id;
  const offerId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { data: offerData } = useGetSpyOfferByIdQuery(
    { id: offerId as string },
    { skip: !offerId },
  );

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
      {offerData?.analysisRequest ? (
        <>
          <p className="text-sm font-semibold text-foreground">Análise Insider</p>
          <CardInsider analysisRequestId={offerData.analysisRequest.id} />
        </>
      ) : null}
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
          <ListPagesOffers
            offerId={offerId}
            noEmpty
            type={activePageType ? [activePageType] : undefined}
          />
        </>
      ) : (
        <ListPagesOffers offerId={offerId} noEmpty />
      )}
    </div>
  );
};
