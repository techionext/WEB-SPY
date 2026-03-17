import { currencies } from "./currencies";

export const formatCurrency = (
  valueInSmallestUnit?: number,
  simplify = false,
  currencyCode = "BRL",
): string => {
  const currencyInfo = currencies.find((c) => c.code === currencyCode);
  const symbol = currencyInfo?.symbol || currencyCode;

  const locale = currencyCode === "USD" ? "en-US" : "pt-BR";

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  });

  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  const divisor = Math.pow(10, fractionDigits);
  const valueInUnits = (valueInSmallestUnit ?? 0) / divisor;

  if (simplify) {
    if (valueInUnits >= 1_000_000) {
      return `${symbol} ${(valueInUnits / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (valueInUnits >= 1_000) {
      return `${symbol} ${(valueInUnits / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    }
  }

  return formatter.format(valueInUnits);
};
