import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface KeyVal {
  key: string;
  value?: string;
}

export const useBuildQueryString = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (keyVals: KeyVal[], multi = false, href?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      keyVals.forEach(({ key, value }) => {
        params.delete(key);

        if (
          value &&
          value !== "" &&
          value !== " " &&
          value !== null &&
          value !== undefined &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          if (multi) {
            // Adicionar múltiplos valores, separados por vírgula
            value
              .trim()
              .split(",")
              .forEach((val) => {
                params.append(key, val);
              });
          } else {
            params.set(key, value);
          }
        }
      });

      return `${href ?? pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );

  return { createQueryString };
};
