"use client";

import { useSession } from "@/providers/session-provider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToggleChangeViewRoot } from "@/components/toggle-change-view-root/ToggleChangeViewRoot";
import { useProfileSettingsModal } from "@/providers/profile-settings-modal-provider";

export const PopoverUser = () => {
  const { onSignOut, user } = useSession();
  const { openProfileSettings } = useProfileSettingsModal();
  return (
    <Dropdown
      className=""
      classNames={{
        content: "border border-white/20",
      }}
      placement="bottom"
    >
      <DropdownTrigger>
        <div className="flex w-full items-center justify-between gap-2 rounded-md ">
          <User
            avatarProps={{
              size: "sm",
              src: user?.avatar?.url ?? "",
              color: "default",
              fallback: <Icon icon="solar:user-circle-bold-duotone" width={30} />,
            }}
            name={`${user?.name.split(" ")?.[0]} ${user?.name?.split(" ")?.[1] ? user?.name?.split(" ")?.[1] : ""}`}
            description={user?.platformRole ?? "USER"}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        style={{
          width: "268px",
        }}
      >
        <DropdownSection>
          <DropdownItem key="toggle-view-root" className="!bg-transparent p-0">
            <ToggleChangeViewRoot />
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label="profile-section-3" className="mb-0">
          <DropdownItem
            startContent={<Icon width={20} icon={"solar:logout-2-bold-duotone"} />}
            onPress={() => onSignOut()}
            key="logout"
            className="pt-[4px] text-default-500"
          >
            Sair
          </DropdownItem>
          <DropdownItem
            startContent={<Icon width={20} icon={"solar:settings-bold-duotone"} />}
            onPress={() => openProfileSettings()}
            key="settings"
            className="pt-[4px] text-default-500"
          >
            Configurações
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
