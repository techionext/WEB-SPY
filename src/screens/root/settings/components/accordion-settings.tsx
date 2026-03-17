"use client";

import { useState } from "react";
import { Accordion, AccordionItem, Button, Chip, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAccordionNavigation } from "./accordion-navigation-context";

interface AccordionSettingsProps {
  title: string;
  subtitle?: string;
  icon?: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
  addButtonLabel?: string;
  uniqueKey: string;
}

export const AccordionSettings = ({
  title,
  subtitle,
  icon,
  values,
  onAdd,
  onRemove,
  placeholder = "Digite um novo valor...",
  addButtonLabel = "Adicionar",
  uniqueKey,
}: AccordionSettingsProps) => {
  const [inputValue, setInputValue] = useState("");
  const { expandedKeys, setExpandedKeys } = useAccordionNavigation();

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div id={`accordion-${uniqueKey}`} className="-mx-2">
      <Accordion
        selectionMode="multiple"
        selectedKeys={expandedKeys}
        onSelectionChange={(keys) => setExpandedKeys(keys as Set<string>)}
        itemClasses={{
          base: " rounded-lg bg-default-50",
          title: "text-sm font-medium text-foreground",
          trigger: "px-4 py-3",
          content: "px-4 pb-4",
        }}
      >
        <AccordionItem
          key={uniqueKey}
          aria-label={title}
          title={
            <div className="flex items-center gap-3 w-full">
              {icon && (
                <div className="w-12 h-12 bg-default-200 items-center justify-center rounded-2xl flex">
                  <Icon icon={icon} width={24} />
                </div>
              )}

              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">{title}</span>
                {subtitle && <span className="text-sm text-default-500">{subtitle}</span>}
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <Chip
                    key={value}
                    onClose={() => onRemove(value)}
                    variant="flat"
                    size="sm"
                    classNames={{
                      base: "bg-default-200 text-default-700",
                      closeButton: "text-default-500 hover:text-default-700",
                    }}
                  >
                    {value}
                  </Chip>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
              />
              <Button color="primary" onPress={handleAdd} isDisabled={!inputValue.trim()}>
                {addButtonLabel}
              </Button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
