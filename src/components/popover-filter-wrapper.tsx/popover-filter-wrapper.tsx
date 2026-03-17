"use client";

import type { ButtonProps, PopoverProps } from "@heroui/react";
import type { ZodSchema } from "zod";

import {
  Button,
  cn,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export type PopoverFilterWrapperProps<T = any> = Omit<PopoverProps, "children"> & {
  title?: string;
  children: React.ReactNode;
  onChange: (data: T) => void;
  schema?: ZodSchema<any>;
  isLoading?: boolean;
  hasValue?: boolean;
  buttonProps?: ButtonProps;
  value?: string;
  classNameContent?: string;
  defaultValues?: T;
  initialValue?: T;
};

const PopoverFilterWrapper = React.forwardRef<HTMLDivElement, PopoverFilterWrapperProps>(
  (
    {
      title,
      children,
      onChange,
      classNameContent,
      schema,
      value,
      isLoading = false,
      hasValue = false,
      buttonProps,
      defaultValues,
      initialValue,
      ...props
    },
    ref,
  ) => {
    const { isOpen, onClose, onOpenChange } = useDisclosure();

    const methods = useForm({
      resolver: schema ? zodResolver(schema as any) : undefined,
      defaultValues: defaultValues || {},
    });

    const { handleSubmit, reset, formState } = methods;

    const isBusy = formState.isSubmitting || isLoading;

    useEffect(() => {
      if (defaultValues) {
        reset(defaultValues);
      }
    }, [defaultValues, reset]);

    const handleChange = (data: any) => {
      onChange(data);
      onClose();
    };

    const handleClear = () => {
      reset({ ...initialValue });
      onChange({ ...initialValue });
      onClose();
    };

    return (
      <Popover
        ref={ref}
        isOpen={isOpen}
        placement="bottom-end"
        shouldCloseOnScroll={false}
        onOpenChange={onOpenChange}
        {...props}
      >
        <PopoverTrigger>
          <Button
            className="border-default-200 text-default-500 relative"
            endContent={<Icon icon="solar:alt-arrow-down-linear" />}
            isDisabled={isBusy}
            size={buttonProps?.size || "sm"}
            variant="flat"
            {...buttonProps}
          >
            {hasValue && (
              <span className="bg-primary absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-full" />
            )}
            {value ?? title}
          </Button>
        </PopoverTrigger>

        <FormProvider {...methods}>
          <PopoverContent
            as="form"
            className={cn("flex flex-col items-start gap-2 px-4 pt-4", classNameContent)}
            onSubmit={handleSubmit(handleChange)}
          >
            <div className="w-full px-2">{children}</div>

            <Divider className="bg-default-100 mt-3" />

            <div className="flex w-full justify-end gap-2 py-2">
              <Button fullWidth isDisabled={isBusy} size="sm" variant="flat" onPress={handleClear}>
                Limpar
              </Button>

              <Button
                fullWidth
                className="text-background"
                color="primary"
                isLoading={isBusy}
                size="sm"
                type="submit"
              >
                Aplicar
              </Button>
            </div>
          </PopoverContent>
        </FormProvider>
      </Popover>
    );
  },
);

PopoverFilterWrapper.displayName = "PopoverFilterWrapper";

export default PopoverFilterWrapper;
