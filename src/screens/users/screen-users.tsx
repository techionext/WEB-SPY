"use client";

import { Header } from "@/components/header";
import { SearchBar } from "@/components/searchbar";
import { TableUsersList } from "./components/table-users-list";
import { ModalInviteUser } from "./components/modal-invite-user";

export const ScreenUsers = () => {
  return (
    <div className="flex gap-4 grow flex-col">
      <div className="flex items-center justify-between">
        <Header title="Usuários" description="Gerencie os usuários da plataforma" />
        <ModalInviteUser />
      </div>

      <div className="flex  gap-4 grow w-full">
        <div className="flex flex-col gap-4 grow">
          <div className="flex flex-row gap-2">
            <div className="w-full">
              <SearchBar />
            </div>
          </div>
          <TableUsersList />
        </div>
      </div>
    </div>
  );
};
