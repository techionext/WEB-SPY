import { Icon } from "@iconify/react";

interface NewEmptyProps {
  title: string;
  description: string;
  icon: string;
}

export const NewEmpty = ({ title, description, icon }: NewEmptyProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-default-100">
        <Icon
          icon={icon ?? "solar:filter-outline"}
          width={32}
          height={32}
          className="text-default-400"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-default-600">{title ?? "Nenhum dado encontrado"}</p>
        <p className="text-xs text-default-400 text-center max-w-[200px]">
          {description ?? "Não há dados de conversão disponíveis para o período."}
        </p>
      </div>
    </div>
  );
};
