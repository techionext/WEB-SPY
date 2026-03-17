import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";

import { Pagination } from "@/components/pagination";
import { CopyText } from "@/components/copy-text/copy-text";
import { useGetUsersQuery, usePutUserMutation } from "@/services/user.service";
import { IGetUser } from "@/types/user.type";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ModalRemove } from "@/components/modal-remove/modal-remove";
import { NewEmpty } from "@/components/empty/new-empty";

const formatStatus = (status: string): string => {
  const map: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    BANNED: "Banido",
  };
  return map[status] ?? status;
};

export const TableUsersList = () => {
  const searchParams = useSearchParams();
  const [idToRemoveAccess, setIdToRemoveAccess] = useState<string>("");
  const { data: users, isLoading } = useGetUsersQuery({
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 8,
  });
  const [putUser, { isLoading: isPuttingUser }] = usePutUserMutation();

  const usersList: IGetUser[] = users?.data ?? [];

  const formatPhone = (phone?: { country?: string; ddd?: string; number?: string }) => {
    if (!phone?.number) return "—";

    const number = phone.number.replace(/\D/g, "");

    if (number.length === 9) {
      return `(${phone.ddd}) ${number.slice(0, 5)}-${number.slice(5)}`;
    }

    if (number.length === 8) {
      return `(${phone.ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
    }

    return `(${phone.ddd}) ${number}`;
  };

  return (
    <>
      <Table
        classNames={{
          base: "table-fixed",
          wrapper: "card",
        }}
        selectionMode="single"
        selectionBehavior="replace"
        bottomContent={<Pagination total={users?.meta?.totalPages ?? 0} defaultPageSize={"8"} />}
        bottomContentPlacement="inside"
      >
        <TableHeader>
          <TableColumn className="w-[320px]">Usuário</TableColumn>
          <TableColumn className="w-[140px]">Telefone</TableColumn>
          <TableColumn className="w-[90px]">Status</TableColumn>
          <TableColumn className="w-[130px]" align="end">
            Criado em
          </TableColumn>
          <TableColumn className="w-[130px]" align="end">
            Atualizado em
          </TableColumn>
          <TableColumn className="w-[100px]" align="end">
            Ações
          </TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          emptyContent={
            <NewEmpty
              title="Nenhum dado encontrado"
              description="Não há dados de usuários disponíveis"
              icon="solar:filter-outline"
            />
          }
          loadingContent={<Spinner />}
        >
          {usersList.map((user: IGetUser) => (
            <TableRow key={user.id}>
              <TableCell className="py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={user.avatar?.url ?? undefined}
                    name={user.name ?? "?"}
                    size="md"
                    className="flex-shrink-0 w-10 h-10 text-tiny"
                    showFallback
                  />

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate" title={user.name ?? undefined}>
                      {user.name ?? "—"}
                    </span>

                    <div className="flex items-center gap-2 min-w-0">
                      <CopyText
                        copyText={user.email}
                        textClassName="text-xs text-default-500 truncate"
                      >
                        {user.email}
                      </CopyText>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3 text-sm text-default-500">
                {formatPhone(user.phone)}
              </TableCell>
              <TableCell className="py-3">
                <Chip
                  size="sm"
                  color={user.status === "ACTIVE" ? "success" : "danger"}
                  variant="dot"
                >
                  {formatStatus(user.status)}
                </Chip>
              </TableCell>
              <TableCell className="py-3 text-sm text-default-500 whitespace-nowrap">
                {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
              </TableCell>
              <TableCell className="py-3 text-sm text-default-500 whitespace-nowrap">
                {dayjs(user.updatedAt).format("DD/MM/YYYY HH:mm")}
              </TableCell>
              <TableCell>
                <Dropdown showArrow placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm">
                      <Icon icon="solar:menu-dots-outline" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Webhook actions">
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Icon icon="material-symbols:delete-outline" />}
                      onPress={() => setIdToRemoveAccess(user.id)}
                    >
                      Remover Acesso
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ModalRemove
        isLoading={isPuttingUser}
        isOpen={!!idToRemoveAccess}
        title="Remover acesso?"
        onOpenChange={() => setIdToRemoveAccess("")}
        onRemove={async () => {
          if (!idToRemoveAccess) return;
          const res = await putUser({ id: idToRemoveAccess, status: "INACTIVE" });

          if ("data" in res) {
            setIdToRemoveAccess("");
          }
        }}
      />
    </>
  );
};
