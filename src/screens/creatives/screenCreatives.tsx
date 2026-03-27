"use client";

import { Header } from "@/components/header";
import { ListCreatives } from "./components/list-creatives";
import { CreateModal } from "./components/create-modal/create-modal";

export const ScreenCreatives = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <Header title="Criativos" description="Veja os criativos que você está participando." />
        <CreateModal />
      </div>

      <ListCreatives />
    </div>
  );
};
