"use client";

import { Header } from "@/components/header";
import { HeaderCards } from "./components/header-cards";
import { Filter } from "@/screens/offers/components/filter";
import { ItemCard } from "./components/item-card";
import { DrawerEdit } from "./components/drawer-edit";
import { useState } from "react";

export const ScreenSolicitations = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <Header
        title="Solicitações"
        description="Veja as solicitações que você está participando."
      />
      <div className="flex min-w-0 w-full items-start gap-4">
        <div className="min-w-0 flex-1 flex flex-col gap-4">
          <HeaderCards />
          <ItemCard handleOpen={handleOpen} />
        </div>
        <Filter />
        <DrawerEdit isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
    </div>
  );
};
