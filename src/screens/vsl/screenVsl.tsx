import { Header } from "@/components/header";
import { ListVsl } from "./components/list-vsl";
import { SearchBar } from "@/components/searchbar";
import { CreateVSL } from "./components/create-modal/create-modal";

export const ScreenVsl = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <Header title="VSL" description="Veja as VSLs que você está participando." />
        <div className="flex gap-2">
          <SearchBar className="w-[300px]" />
          <CreateVSL />
        </div>
      </div>
      <ListVsl />
    </div>
  );
};
