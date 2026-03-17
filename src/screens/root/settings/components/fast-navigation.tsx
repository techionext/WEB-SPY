"use client";

import { Icon } from "@iconify/react";
import { useFormContext } from "react-hook-form";
import { TSchemaSettingsOutput } from "./schemaSettings";
import { useGetLabsCategoryQuery } from "@/services/labs/category/labs-category.service";
import { useGetProducersQuery } from "@/services/community/settings/producer.service";
import { useGetCommunityAreaQuery } from "@/services/community/settings/community-area.service";
import { useGetSeasonQuery } from "@/services/session/season.service";
import { useSession } from "@/providers/session-provider";
import { Button, Card, cn } from "@heroui/react";
import { useState, useEffect } from "react";

interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  count: number;
}

interface FastNavigationProps {
  onSubmit: (data: TSchemaSettingsOutput) => void;
  isLoading?: boolean;
  navigationType: "academy" | "settings";
  onNavigate: (type: "academy" | "settings") => void;
}

export const FastNavigation = ({
  onSubmit,
  isLoading = false,
  navigationType,
  onNavigate,
}: FastNavigationProps) => {
  const {
    watch,
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<TSchemaSettingsOutput>();
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [activeItem, setActiveItem] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      setShowSaveButton(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { user } = useSession();
  const { data: categories } = useGetLabsCategoryQuery({});
  const { data: areas } = useGetCommunityAreaQuery({});
  const { data: producers } = useGetProducersQuery({});
  const { data: seasons } = useGetSeasonQuery({ id: user?.id || "" }, { skip: !user?.id });
  const formValues = watch();

  const navigationItems: NavigationItem[] = [
    {
      id: "categories",
      title: "Categorias",
      icon: "solar:folder-bold-duotone",
      count: categories?.meta.total || 0,
    },
    {
      id: "structure",
      title: "Estrutura",
      icon: "solar:folder-bold-duotone",
      count: formValues.structure?.length || 0,
    },
    {
      id: "typeProduct",
      title: "Tipo de Produto",
      icon: "solar:box-bold-duotone",
      count: formValues.typeProduct?.length || 0,
    },
    {
      id: "typePages",
      title: "Tipo de Página",
      icon: "solar:document-bold-duotone",
      count: formValues.typePages?.length || 0,
    },

    {
      id: "email",
      title: "Emails Padrão",
      icon: "solar:letter-bold-duotone",
      count: formValues.email?.length || 0,
    },
    {
      id: "excludedProducts",
      title: "Produtos Excluídos",
      icon: "solar:close-circle-bold-duotone",
      count: formValues.excludedProducts?.length || 0,
    },
    {
      id: "seasons",
      title: "Temporadas",
      icon: "solar:ranking-bold-duotone",
      count: seasons?.meta.total || 0,
    },
  ];

  const academyItems: NavigationItem[] = [
    {
      id: "community-areas",
      title: "Áreas da Comunidade",
      icon: "solar:diploma-bold-duotone",
      count: areas?.meta.total || 0,
    },
    {
      id: "producers",
      title: "Produtores",
      icon: "solar:user-circle-bold",
      count: producers?.meta.total || 0,
    },
    {
      id: "videoCategory",
      title: "Categorias de Vídeo",
      icon: "solar:videocamera-record-bold-duotone",
      count: formValues.videoCategory?.length || 0,
    },
  ];

  const handleNavigate = (id: string, type: "settings" | "academy") => {
    setActiveItem((prev) => {
      if (type !== navigationType) return [id];
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    onNavigate(type);

    const delay = type === navigationType ? 0 : 300;
    setTimeout(() => {
      const element = document.getElementById(`accordion-${id}`);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - 100;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        setTimeout(() => {
          const event = new CustomEvent("openAccordion", { detail: { id } });
          window.dispatchEvent(event);
        }, 300);
      }
    }, delay);
  };

  return (
    <Card className="rounded-lg  card h-fit max-h-[calc(100vh-2rem)] overflow-y-auto min-w-[368px] p-4  sticky top-4 ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-foreground">NAVEGAÇÃO RÁPIDA</h3>
        <div
          className={`transition-all duration-300 ease-in-out ${
            showSaveButton
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-95 translate-x-2 pointer-events-none"
          }`}
        >
          <Button
            color="primary"
            size="sm"
            onPress={() => handleSubmit(onSubmit)()}
            isLoading={isLoading}
            isDisabled={!isDirty}
          >
            Salvar
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h4
            className={cn(
              "text-xs font-medium text-default-500 mb-2 uppercase ml-2",
              navigationType === "settings" ? "text-primary" : "text-default-500",
            )}
          >
            Configurações Gerais
          </h4>
          <div className="flex flex-col gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigate(item.id, "settings");
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100 transition-colors text-left w-full group"
              >
                <Icon
                  icon={item.icon}
                  width={20}
                  className={cn(
                    "text-default-500 group-hover:text-foreground",
                    activeItem.includes(item.id) ? "text-primary" : "text-default-500",
                  )}
                />
                <span className="flex-1 text-sm text-foreground group-hover:text-primary">
                  {item.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-default-200 text-xs font-medium text-default-600">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4
            className={cn(
              "text-xs font-medium text-default-500 mb-2 uppercase ml-2",
              navigationType === "academy" ? "text-primary" : "text-default-500",
            )}
          >
            Academy
          </h4>
          <div className="flex flex-col gap-1">
            {academyItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigate(item.id, "academy");
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100 transition-colors text-left w-full group"
              >
                <Icon
                  icon={item.icon}
                  width={20}
                  className={cn(
                    "text-default-500 group-hover:text-foreground",
                    activeItem.includes(item.id) ? "text-primary" : "text-default-500",
                  )}
                />
                <span className="flex-1 text-sm text-foreground group-hover:text-primary">
                  {item.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-default-200 text-xs font-medium text-default-600">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
