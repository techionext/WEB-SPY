"use client";

import type { FieldValues, UseFormReturn } from "react-hook-form";

import { useFormContext } from "react-hook-form";

interface IConnectForm<T extends FieldValues> {
  children: (methods: UseFormReturn<T, any, T>) => React.ReactNode;
}

export const ConnectForm = <T extends FieldValues>({ children }: IConnectForm<T>) => {
  const methods = useFormContext<T, any, T>();

  return children(methods);
};
