"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Image,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  Link,
  Avatar,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ILabsPages as ILabsPage } from "@/types/offer/offer.type";
import dayjs from "@/utils/dayjs-config";

interface PagesCardProps {
  page: ILabsPage;
  onEdit?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  onDelete?: () => void;
}

export const PagesCard = ({ page, onEdit, onArchive, onUnarchive, onDelete }: PagesCardProps) => {
  const handleDownload = () => {
    if (page.file?.url) {
      window.open(page.file.url, "_blank");
    }
  };

  return (
    <Card
      className="card hover:border-primary/50 border-1 border-transparent transition-all duration-300 hover:scale-[1.01] cursor-pointer h-full"
      shadow="sm"
    >
      <CardHeader className="p-0 relative h-[200px] rounded-b-none overflow-hidden bg-content1">
        {page.image?.url ? (
          <Image
            src={page.image.url}
            alt={page.title}
            radius="none"
            className="w-full h-full object-cover rounded-t-xl z-0"
            removeWrapper
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-default-200">
            <Icon icon="solar:global-outline" width={64} />
          </div>
        )}

        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {page.status === "ACTIVE" && (
            <Chip
              size="sm"
              variant="flat"
              className="bg-success/20 text-success border-success/30 border-1 h-7 backdrop-blur-md"
            >
              <span className="font-bold text-[10px] tracking-wide uppercase">Ativa</span>
            </Chip>
          )}

          {page.archive && (
            <Tooltip
              content={page.archiveReason}
              className="p-3 bg-content2 max-w-[400px]"
              showArrow
            >
              <Chip
                size="sm"
                variant="flat"
                className="bg-warning/20 text-warning border-warning/30 border-1 h-7 backdrop-blur-md cursor-help"
                startContent={<Icon icon="solar:archive-bold" className="ml-1.5" width={14} />}
              >
                <span className="font-bold text-[10px] tracking-wide uppercase">Arquivada</span>
              </Chip>
            </Tooltip>
          )}

          {(page.typeAlert === "MISSING_INFORMATION" || page.typeAlert === "DEAD_PAGE") && (
            <Tooltip
              content={
                page.typeAlert === "DEAD_PAGE"
                  ? "A página está offline ou não foi encontrada."
                  : "Algumas informações da página estão incompletas."
              }
              className="p-3 bg-content2"
              showArrow
            >
              <Chip
                size="sm"
                variant="flat"
                className="bg-warning/20 text-warning border-warning/30 border-1 h-7 backdrop-blur-md cursor-help"
                startContent={<Icon icon="solar:danger-bold" className="ml-1.5" width={14} />}
              >
                <span className="font-bold text-[10px] tracking-wide uppercase">Alerta</span>
              </Chip>
            </Tooltip>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-content2 hover:bg-content2/60 min-w-8 w-8 h-8 rounded-full backdrop-blur-md"
              >
                <Icon icon="solar:menu-dots-bold" className="rotate-90" width={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ações da página">
              <DropdownItem
                key="edit"
                onPress={onEdit}
                startContent={<Icon icon="solar:pen-bold" />}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                key="archive"
                onPress={page.archive ? onUnarchive : onArchive}
                startContent={<Icon icon="solar:archive-bold" />}
              >
                {page.archive ? "Desarquivar" : "Arquivar"}
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                onPress={onDelete}
                startContent={<Icon icon="solar:trash-bin-trash-bold" />}
              >
                Excluir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {page.faviconLink && (
          <div className="absolute bottom-3 right-3 z-10">
            <Avatar
              src={page.faviconLink}
              className="w-8 h-8 border-1 p-1 bg-background/50 backdrop-blur-sm"
              radius="full"
            />
          </div>
        )}
      </CardHeader>

      <CardBody className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1 min-h-[48px]">
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-foreground truncate max-w-[250px]">
              {page.title}
            </h3>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1.5 text-default-400 bg-content2 px-2 py-1 rounded-md">
                <Icon icon="solar:calendar-linear" width={14} className="mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {dayjs(page.createdAt).format("DD [de] MMM. [de] YYYY")}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-default-400 line-clamp-2 min-h-[32px]">{page.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-default-400">
            <Icon icon="solar:globus-outline" width={14} />
            <span className="text-xs font-medium whitespace-nowrap">{page.type}</span>
          </div>
          {page.makeScraper && (
            <div className="flex items-center gap-1.5 text-default-400">
              <Icon icon="solar:mouse-circle-outline" width={14} />
              <span className="text-xs font-medium whitespace-nowrap">Scraper</span>
            </div>
          )}
          <Link
            href={page.url}
            isExternal
            showAnchorIcon
            anchorIcon={<Icon icon="solar:link-outline" className="ml-1" />}
            className="text-xs font-medium text-primary hover:underline ml-auto"
          >
            <p className="truncate max-w-[300px]">{page.url}</p>
          </Link>
        </div>

        <Button
          fullWidth
          variant="flat"
          className="bg-content2 text-default-500 font-semibold h-11 rounded-xl"
          startContent={
            <Icon
              icon={page.file ? "solar:file-download-bold" : "solar:file-corrupted-bold"}
              width={18}
            />
          }
          isDisabled={!page.file}
          onPress={handleDownload}
        >
          {page.file ? "Baixar arquivo" : "Sem arquivo"}
        </Button>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-content2 border-1 border-divider">
            <span className="text-xl font-bold text-foreground leading-none">
              {page.adQuantity}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Anúncios
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-content2 border-1 border-divider">
            <span className="text-xl font-bold text-foreground leading-none">
              {page.viewsQuantity}
            </span>
            <span className="text-[9px] font-bold text-default-400 mt-1 uppercase tracking-wider">
              Visualizações
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
