import { Header } from "@/components/header";
import { SearchBar } from "@/components/searchbar";
import { CreateModal } from "../creatives/components/create-modal/create-modal";
import { ListPages } from "./components/list-pages";

export const ScreenPages = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <Header title="Páginas" description="Veja as páginas que você está participando." />
        <div className="flex gap-2">
          <SearchBar className="w-[300px]" />
          <CreateModal />
        </div>
      </div>

      <ListPages />
    </div>
  );
};
