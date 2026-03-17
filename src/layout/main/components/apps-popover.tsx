import { IApp, useAppsLoginMutation, useGetAppsQuery } from "@/services/apps/apps.service";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";

export const AppsPopover = () => {
  const defaultApps: IApp[] = [
    {
      id: "beworke",
      title: "Beworke",
      description: "Painel central para gerencia sua empresa",
      category: ["manager"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: "https://app.beworke.com/favicon/favicon-32x32.png",
      organization: {
        isAppUse: false,
      },
      isAppMain: true,
    },
  ];
  const { data: appsApi } = useGetAppsQuery({ page: 1, pageSize: 10 });
  const apps = [...defaultApps, ...(appsApi?.data ?? [])];
  const [appsLogin, { isLoading, originalArgs }] = useAppsLoginMutation();

  const handleLoginApp = (appId: string) => {
    appsLogin({ id: appId })
      .unwrap()
      .then((res) => {
        window.open(res.redirectUrl, "_blank");
      });
  };
  return (
    <Dropdown placement="right">
      <DropdownTrigger>
        <Button isIconOnly size="sm" color="default" radius="full" variant="flat">
          <Icon icon="solar:widget-3-bold" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu closeOnSelect={false} className="w-[426px] p-4 justify-stretch">
        <DropdownSection title={"Apps"} className="flex flex-col gap-2 w-full">
          {apps?.map((app) => (
            <DropdownItem
              onPress={() => handleLoginApp(app.id)}
              description={app.description}
              variant="light"
              key={app.id}
              classNames={{
                description: "!line-clamp-2 text-wrap",
              }}
              endContent={
                isLoading && originalArgs?.id === app.id ? (
                  <Spinner size="sm" />
                ) : app.isAppMain ? (
                  <Chip
                    variant="flat"
                    className=" h-5 text-[10px] leading-0 bg-linear-to-r from-primary to-secondary/50 "
                    size="sm"
                  >
                    Central de trabalho
                  </Chip>
                ) : (
                  <div className="flex items-center gap-2">
                    {app.organization.isAppUse ? (
                      <Icon className="" icon="solar:alt-arrow-right-linear" />
                    ) : (
                      <Chip variant="flat" color="secondary" size="sm" className="h-5 text-[10px]">
                        Explorar
                      </Chip>
                    )}
                  </div>
                )
              }
              startContent={<Image src={app.thumbnail} alt={app.title} width={20} height={20} />}
            >
              <p className="flex-1"> {app.title}</p>
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
