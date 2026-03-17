"use client";

import { Icon } from "@iconify/react";
import { Button, cn, Tooltip } from "@heroui/react";
import React, { forwardRef, memo, useMemo } from "react";

export interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  textClassName?: string;
  copyText: string | undefined;
  children: React.ReactNode;
  disabled?: boolean;
  showSuccessIcon?: boolean;
}

export const CopyText = memo(
  forwardRef<HTMLDivElement, CopyTextProps>((props, forwardedRef) => {
    const {
      className,
      textClassName,
      children,
      copyText = "Copy",
      disabled = false,
      showSuccessIcon = false,
    } = props;
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const onClearTimeout = () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };

    const handleClick = () => {
      if (disabled || !copyText) return;

      onClearTimeout();
      navigator.clipboard.writeText(copyText);
      setCopied(true);

      setCopyTimeout(
        setTimeout(() => {
          setCopied(false);
        }, 3000),
      );
    };

    const content = useMemo(() => (copied ? "Copied" : copyText), [copied, copyText]);

    return (
      <div ref={forwardedRef} className={cn("text-default-500 flex items-center gap-3", className)}>
        <p className={textClassName}>{children}</p>
        <Tooltip
          showArrow
          className="text-foreground text-wrap"
          classNames={{ content: "line-clamp-3 max-w-[368px] p-2 text-wrap" }}
          content={content}
          placement="top-end"
        >
          <Button
            isIconOnly
            className={`h-7 w-7 min-w-7 ${showSuccessIcon && !disabled && copyText ? "text-success" : "text-default-400"}`}
            isDisabled={disabled || !copyText}
            size="sm"
            variant="light"
            onPress={handleClick}
          >
            {!copied && <Icon className="h-[14px] w-[14px]" icon="solar:copy-linear" />}
            {copied && <Icon className="h-[14px] w-[14px]" icon="solar:check-read-linear" />}
          </Button>
        </Tooltip>
      </div>
    );
  }),
);

CopyText.displayName = "CopyText";
