"use client";

import { Button, ButtonProps, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { forwardRef, memo, useMemo } from "react";

export interface CopyTextProps extends ButtonProps {
  copyText: string;
  showTooltip?: boolean;
}

export const ButtonCopy = memo(
  forwardRef<HTMLButtonElement, CopyTextProps>((props, forwardedRef) => {
    const { className, children, copyText = "Copy", showTooltip = true, ...rest } = props;
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
      <Tooltip
        className="text-foreground max-w-[300px] p-4"
        content={content}
        hidden={!showTooltip}
      >
        <Button
          ref={forwardedRef}
          className={className}
          startContent={
            !copied ? (
              <Icon
                width={14}
                height={14}
                className="h-[14px] min-h-[14px] w-[14px] min-w-[14px]"
                icon="solar:copy-linear"
              />
            ) : (
              <Icon
                width={14}
                height={14}
                className="h-[14px] min-h-[14px] w-[14px] min-w-[14px]"
                icon="solar:check-read-linear"
              />
            )
          }
          {...rest}
          onPress={handleClick}
        >
          {children}
        </Button>
      </Tooltip>
    );
  }),
);

ButtonCopy.displayName = "CopyText";
