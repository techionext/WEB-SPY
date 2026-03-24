"use client";

import { Header } from "@/components/header";
import { SearchBar } from "@/components/searchbar";
import { ListCreatives } from "./components/list-creatives";
import { CreateModal } from "./components/create-modal/create-modal";

export const ScreenCreatives = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <Header title="Criativos" description="Veja os criativos que você está participando." />
        <div className="flex gap-2">
          <SearchBar className="w-[300px]" />
          <CreateModal />
        </div>
      </div>

      <ListCreatives />
    </div>
  );
};
