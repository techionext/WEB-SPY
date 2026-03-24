"use client";

import { useSession } from "@/providers/session-provider";
import { Badge, Button, Card, cn, ScrollShadow } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import { UserPopover } from "./user-popover";
import { AppsPopover } from "./apps-popover";

interface MenuItem {
  key: string;
  icon: string;
  label: string;
  href?: string;
  isActive: boolean;
  endContent?: React.ReactNode;
  items?: MenuItem[];
}

export const Aside = () => {
  const { user } = useSession();
  const pathname = usePathname();
  const onlyPathname = pathname.split("?")[0];
  const menuItems: MenuItem[] = [
    {
      key: "offers",
      icon: "solar:hamburger-menu-bold",
      label: "Ofertas",
      href: "/offers",
      isActive: onlyPathname === "/offers",
      endContent: undefined,
    },
    {
      key: "creatives",
      icon: "solar:gallery-minimalistic-bold",
      label: "Criativos",
      href: "/creatives",
      isActive: onlyPathname === "/creatives",
      endContent: undefined,
    },
    {
      key: "pages",
      icon: "solar:file-bold",
      label: "Páginas",
      href: "/pages",
      isActive: onlyPathname === "/pages",
      endContent: undefined,
    },
  ];

  const allowedRolesForUsers = ["ROOT", "ADMIN"] as const;
  const canSeeUsersItem =
    user?.platformRole != null &&
    allowedRolesForUsers.includes(user.platformRole as (typeof allowedRolesForUsers)[number]);

  const affiliationItems = [
    {
      key: "users",
      icon: "solar:users-group-two-rounded-bold",
      label: "Usuários",
      href: "/root/users",
      isActive: onlyPathname === "/root/users",
      validation: canSeeUsersItem,
    },
    {
      key: "settings",
      icon: "solar:settings-bold",
      label: "Configurações",
      href: "/root/settings",
      isActive: onlyPathname === "/root/settings",
    },
  ];

  return (
    <Card
      radius="none"
      shadow="none"
      className="  max-h-[calc(100vh-0px)] bg-transparent   p-4  pt-10  gap-6  sticky top-0  border-transparent    flex-1 max-w-[286px] w-full flex flex-col grow "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-content1 text-default-500  font-bold flex items-center justify-center rounded-full text-[10px]">
            H&W
          </div>
          <p className="text-sm font-bold text-default-500">HUBWISE</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge content={1} color="danger" showOutline={false} size="sm">
            <Button isIconOnly size="sm" color="default" radius="full" variant="flat">
              <Icon icon="solar:bell-bold" />
            </Button>
          </Badge>
          <AppsPopover />
        </div>
      </div>

      <ScrollShadow className="flex-1 flex flex-col gap-4 w-full ">
        {(user?.platformRole === "ROOT" || user?.platformRole === "ADMIN") && (
          <div className=" flex flex-col gap-1" key="affiliation">
            <p className="text-sm  text-foreground-500">Sistema</p>
            {affiliationItems
              .filter((item) => item.validation !== false)
              .map((item) => (
                <Fragment key={`${item.key}-affiliation`}>
                  <Button
                    key={item.key}
                    as={item.href ? Link : "button"}
                    href={item.href}
                    className={cn(item.isActive ? "bg-content1/60" : "text-default-600")}
                    variant={item.isActive ? "light" : "light"}
                    radius="lg"
                    fullWidth
                  >
                    <div className={cn("flex items-center  gap-2 flex-1 ")}>
                      <Icon width={20} icon={item.icon} />
                      {item.label}
                    </div>
                  </Button>
                </Fragment>
              ))}
          </div>
        )}
        <div className=" flex flex-col gap-1" key="menu">
          <p className="text-sm  text-foreground-500">Menu</p>
          {menuItems.map((item) => (
            <Fragment key={`${item.key}-menu`}>
              <Button
                key={item.key}
                as={item.href ? Link : "button"}
                disableAnimation
                href={item.href}
                radius="lg"
                className={cn(
                  item.isActive ? "bg-content1/60" : "text-default-600 !bg-transparent",
                )}
                variant={item.isActive ? "light" : "light"}
                fullWidth
              >
                <div className={cn("flex items-center  gap-2 flex-1 ")}>
                  <Icon width={20} icon={item.icon} />
                  {item.label}
                </div>
                {item.endContent}
              </Button>
              {item.items && (
                <div
                  className="flex flex-col gap-1 ml-5 pl-1 border-l border-default-200"
                  key={`${item.key}-items`}
                >
                  {item.items.map((sub) => {
                    return (
                      <Button
                        key={sub.key}
                        as={sub.href ? Link : "button"}
                        href={sub.href}
                        className={cn(sub.isActive ? "bg-content1/60" : "text-default-600")}
                        variant={sub.isActive ? "light" : "light"}
                        radius="lg"
                        endContent={sub.endContent}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Icon width={20} icon={sub.icon} />
                          {sub.label}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </ScrollShadow>
      <UserPopover />
    </Card>
  );
};
