"use client";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/searchbar";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ListCreatives } from "./components/list-creatives";

export const ScreenCreatives = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Header title="Criativos" description="Veja os criativos que você está participando." />
        <div className="flex gap-2">
          <SearchBar className="w-[300px]" />
          <Button startContent={<Icon width={20} icon="solar:add-circle-bold" />} color="primary">
            Adicionar
          </Button>
        </div>
      </div>

      <ListCreatives />
    </div>
  );
};
