"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AccordionNavigationContextType {
  expandedKeys: Set<string>;
  setExpandedKeys: (keys: Set<string>) => void;
}

const AccordionNavigationContext = createContext<AccordionNavigationContextType | undefined>(
  undefined,
);

export const AccordionNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleOpenAccordion = (event: CustomEvent<{ id: string }>) => {
      setExpandedKeys((prevKeys) => {
        const newKeys = new Set(prevKeys);
        if (newKeys.has(event.detail.id)) {
          newKeys.delete(event.detail.id);
        } else {
          newKeys.add(event.detail.id);
        }
        return newKeys;
      });
    };

    window.addEventListener("openAccordion", handleOpenAccordion as EventListener);

    return () => {
      window.removeEventListener("openAccordion", handleOpenAccordion as EventListener);
    };
  }, []);

  return (
    <AccordionNavigationContext.Provider value={{ expandedKeys, setExpandedKeys }}>
      {children}
    </AccordionNavigationContext.Provider>
  );
};

export const useAccordionNavigation = () => {
  const context = useContext(AccordionNavigationContext);
  if (!context) {
    throw new Error("useAccordionNavigation must be used within AccordionNavigationProvider");
  }
  return context;
};
