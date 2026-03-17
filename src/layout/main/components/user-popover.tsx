"use client";

import { Popover, PopoverTrigger, PopoverContent, User, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "@/providers/session-provider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IApp, useGetAppsQuery } from "@/services/apps/apps.service";
import Image from "next/image";

export const UserPopover = () => {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { onSignOut } = useSession();

  const defaultApps: IApp[] = [
    {
      id: "gomarke",
      title: "Gomarke",
      description: "Gomarke tenha total controle sobre suas ofertas, criativos e páginas.",
      category: ["Tracker"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: "https://app.gomarke.com/dark/favicon-32x32.png",
      organization: {
        isAppUse: true,
      },
      isAppMain: false,
    },
  ];

  const { data: appsApi } = useGetAppsQuery({ page: 1, pageSize: 10 });
  const apps = [...defaultApps, ...(appsApi?.data ?? [])];

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex justify-between items-center p-2 px-3 bg-content1 rounded-2xl">
          <User
            avatarProps={{
              isBordered: false,
              size: "sm",
              src: user?.avatar?.url ?? "",
              color: "default",
              classNames: {},
            }}
            name={`${user?.name.split(" ")?.[0]} ${user?.name?.split(" ")?.[1] ? user?.name?.split(" ")?.[1] : ""}`}
            description={user?.platformRole ?? "USER"}
          />
          <Button isIconOnly size="sm" color="default" variant="light">
            <Icon icon="solar:alt-arrow-up-line-duotone" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[256px] py-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <User
              avatarProps={{
                isBordered: false,
                size: "sm",
                src: user?.avatar?.url ?? "",
                color: "default",
              }}
              className="w-full  justify-start px-2"
              name={`${user?.name.split(" ")?.[0]} ${user?.name?.split(" ")?.[1] ? user?.name?.split(" ")?.[1] : ""}`}
              description={user?.platformRole ?? "USER"}
            />
            <Button
              isIconOnly
              size="sm"
              color="default"
              variant="light"
              onPress={() => setTheme(mounted && theme === "dark" ? "light" : "dark")}
            >
              <Icon icon={mounted && theme === "dark" ? "solar:moon-bold" : "solar:sun-bold"} />
            </Button>
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <p className="px-3 text-sm text-default-500">Apps</p>
            {apps?.map((app) => (
              <Button
                key={app.id}
                size="sm"
                color="default"
                variant="light"
                fullWidth
                className="justify-start"
                startContent={<Image src={app.thumbnail} alt={app.title} width={20} height={20} />}
              >
                {app.title}
              </Button>
            ))}
          </div>
          <Divider />
          <Button
            startContent={<Icon width={16} icon="solar:settings-bold" />}
            size="sm"
            color="default"
            variant="light"
            fullWidth
            className="justify-start"
          >
            Configurações
          </Button>
          <Button
            startContent={<Icon width={16} icon="solar:logout-2-bold" />}
            size="sm"
            color="default"
            variant="light"
            fullWidth
            className="justify-start"
            onPress={onSignOut}
          >
            Sair
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
