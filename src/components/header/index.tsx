import type { ReactNode } from "react";

type HeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export const Header = ({ title, description, actions }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-0">
        <p className="text-2xl font-bold text-default-500">{title}</p>
        <p className="text-sm text-default-500">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
};
