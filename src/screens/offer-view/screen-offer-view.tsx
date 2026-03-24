"use client";

import { CardOffer } from "./components/card-offer";
import Graph from "./components/graph";
import { VslCard } from "./components/vsl-card";

export const ScreenOfferView = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardOffer />
        <Graph />
      </div>
      <VslCard />
      <p className="text-sm font-semibold text-foreground">Criativos</p>
    </div>
  );
};
