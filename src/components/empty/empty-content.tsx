import { Button, ButtonProps } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ReactNode } from "react";

interface EmptyContentProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: ReactNode | (() => void);
  buttonProps?: ButtonProps;
  children?: ReactNode;
  containerClassName?: string;
}

export const EmptyContent = ({
  icon = "solar:document-bold-duotone",
  title,
  description,
  actionLabel,
  onAction,
  buttonProps,
  children,
  containerClassName = "",
}: EmptyContentProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center gap-4 grow ${containerClassName}`}
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-[32px] bg-content2 border border-divider shadow-sm mb-2">
        <Icon icon={icon} width={40} height={40} className="text-default-400" />
      </div>

      <div className="flex flex-col gap-1 max-w-[400px]">
        <h3 className="text-xl font-bold text-foreground leading-tight">{title}</h3>
        <p className="text-sm text-default-500 leading-relaxed">{description}</p>
      </div>

      {(actionLabel || children || onAction) && (
        <>
          {children || (typeof onAction !== "function" && onAction) || (
            <Button
              color="primary"
              onPress={onAction as () => void}
              radius="full"
              className="px-8 font-semibold"
              startContent={<Icon width={20} icon="solar:add-circle-bold" />}
              {...buttonProps}
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
