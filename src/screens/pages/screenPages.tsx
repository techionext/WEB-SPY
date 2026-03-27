import { Header } from "@/components/header";
import { ListPages } from "./components/list-pages";
import { CreatePage } from "./components/modal-create/modal-create";

export const ScreenPages = () => {
  return (
    <div className="flex gap-4 grow flex-col">
      <div className="flex items-center justify-between">
        <Header title="Páginas" description="Veja as páginas que você está participando." />
        <CreatePage />
      </div>

      <ListPages />
    </div>
  );
};
