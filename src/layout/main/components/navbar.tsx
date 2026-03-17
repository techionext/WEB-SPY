"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-10  bg-background">
      <div className="bg-black z-10 dark:bg-content1 h-20 w-full  flex items-center justify-between px-20">
        <p className="text-2xl text-white font-bold leading-none">
          Astron | <small className="text-xs font-normal">Network</small>
        </p>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button isIconOnly radius="full" size="sm">
            <Icon icon="solar:bell-bold" />
          </Button>
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        </div>
      </div>
    </div>
  );
};
