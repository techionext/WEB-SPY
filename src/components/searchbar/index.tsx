"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, Input } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

import { useBuildQueryString } from "@/hooks/useQueryString";

export const SearchBar = ({
  hash = "filter",
  className,
}: {
  hash?: string;
  className?: string;
}) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get(hash);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? "");
  const { createQueryString } = useBuildQueryString();

  // const t = useTranslations();

  function handleSearchInputChange(value: string) {
    setSearchTerm(value);
  }
  function handleSubmitForm(event: React.FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    const queryParams = [
      { key: hash ?? "filter", value: searchTerm },
      { key: "page", value: "1" },
      { key: "pageSize", value: "" },
    ];

    const newUrl = createQueryString(queryParams);

    replace(newUrl, { scroll: false });
  }

  return (
    <form className={cn(["w-full", className])} onSubmit={handleSubmitForm}>
      <Input
        label={false}
        labelPlacement="outside"
        defaultValue={searchTerm}
        placeholder="Pesquisar"
        startContent={<Icon icon="solar:minimalistic-magnifer-bold-duotone" />}
        onChange={(event) => handleSearchInputChange(event.target.value)}
      />
    </form>
  );
};
