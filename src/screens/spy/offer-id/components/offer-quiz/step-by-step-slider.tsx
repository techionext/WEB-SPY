"use client";

import React from "react";
import { Card, CardBody, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";

type StepLike = Record<string, any>;

type Props = {
  steps: StepLike[];
  title?: string;
  initialIndex?: number;
  className?: string;
  onChangeIndex?: (index: number) => void;
};

function normalizeStep(step: StepLike, index: number) {
  const src =
    step?.image?.url ||
    step?.imageUrl ||
    step?.url ||
    step?.media?.url ||
    step?.asset?.url ||
    step?.file?.url ||
    step?.content?.url ||
    "";

  const thumb =
    step?.thumbnail?.url || step?.thumb?.url || step?.thumbUrl || step?.thumbnailUrl || src;

  const alt = step?.title || step?.name || step?.label || step?.description || `Step ${index + 1}`;

  return { src, thumb, alt };
}

export function StepByStepSlider({
  steps,
  title = "Passo a passo",
  initialIndex = 0,
  className,
  onChangeIndex,
}: Props) {
  const total = steps?.length ?? 0;
  const safeInitial = Math.min(Math.max(initialIndex, 0), Math.max(total - 1, 0));

  const [active, setActive] = React.useState<number>(safeInitial);

  React.useEffect(() => {
    setActive(safeInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const normalized = React.useMemo(() => (steps ?? []).map((s, i) => normalizeStep(s, i)), [steps]);

  const activeItem = normalized[active];

  const goTo = React.useCallback(
    (idx: number) => {
      if (!total) return;
      const next = (idx + total) % total;
      setActive(next);
      onChangeIndex?.(next);
    },
    [total, onChangeIndex],
  );

  const prev = React.useCallback(() => goTo(active - 1), [active, goTo]);
  const next = React.useCallback(() => goTo(active + 1), [active, goTo]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (!total) {
    return (
      <Card className={cn("bg-default-100 border border-default-200/40", className)}>
        <CardBody className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground-600">{title}</p>
            <span className="text-xs text-foreground-400">0 / 0</span>
          </div>

          <div className="mt-4 h-[260px] md:h-[420px] rounded-2xl bg-default-200/40" />
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 w-20 rounded-xl bg-default-200/40 shrink-0" />
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={cn("card", className)}>
      <CardBody className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground-600">{title}</p>
          <span className="text-xs text-foreground-400">
            {active + 1} / {total}
          </span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-2xl bg-black/20">
          {activeItem?.src ? (
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              className="h-[260px] w-full object-cover md:h-[460px]"
              draggable={false}
              width={1080}
              height={1920}
            />
          ) : (
            <div className="h-[260px] md:h-[460px] w-full flex items-center justify-center text-foreground-400">
              Sem imagem neste passo
            </div>
          )}

          <button
            type="button"
            onClick={prev}
            className={cn(
              "absolute cursor-pointer left-3 top-1/2 -translate-y-1/2",
              "h-10 w-10 rounded-full",
              "bg-black/35 hover:bg-black/55",
              "backdrop-blur-md border border-white/10",
              "flex items-center justify-center",
              "transition",
            )}
            aria-label="Anterior"
          >
            <Icon
              icon="solar:alt-arrow-left-linear"
              width={20}
              height={20}
              className="text-white"
            />
          </button>

          <button
            type="button"
            onClick={next}
            className={cn(
              "absolute cursor-pointer right-3 top-1/2 -translate-y-1/2",
              "h-10 w-10 rounded-full",
              "bg-black/35 hover:bg-black/55",
              "backdrop-blur-md border border-white/10",
              "flex items-center justify-center",
              "transition",
            )}
            aria-label="Próximo"
          >
            <Icon
              icon="solar:alt-arrow-right-linear"
              width={20}
              height={20}
              className="text-white"
            />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {normalized.map((s, idx) => {
            const isActive = idx === active;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-xl",
                  "h-14 w-20 md:h-16 md:w-24",
                  "border transition",
                  isActive
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-default-200/40 hover:border-default-200",
                )}
                aria-label={`Ir para o passo ${idx + 1}`}
              >
                {s.thumb ? (
                  <Image
                    src={s.thumb}
                    alt={s.alt}
                    className={cn(
                      "h-full w-full object-cover",
                      !isActive && "opacity-80 hover:opacity-100",
                    )}
                    width={80}
                    height={80}
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full bg-default-200/40" />
                )}

                {!isActive && <div className="absolute inset-0 bg-default-200/40" />}
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

export default StepByStepSlider;
