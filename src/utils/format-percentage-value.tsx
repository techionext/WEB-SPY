export const percentageMask = (value: string) => {
  if (value === undefined) return undefined;

  // Limpar e formatar o valor
  let formattedValue = value
    .replace(".", ",") // Normaliza ponto para vírgula
    .replace(/[^\d,]/g, "") // Remove tudo que não for dígito ou vírgula
    .replace(/(,.?),/g, "$1") // Remove vírgulas extras, mantendo apenas a primeira
    .replace(/^0+(?=\d)/, ""); // Remove zeros à esquerda

  // Substituir vírgula por ponto para poder converter para número
  const numericValue = parseFloat(formattedValue.replace(",", "."));

  // Garantir que o valor não ultrapasse 100
  if (numericValue > 100) {
    formattedValue = "100";
  }

  return formattedValue;
};

export const formatPercentageValue = (value: number): string => {
  const strValue = value.toFixed(2);
  const trimmedValue = strValue.replace(/.?0+$/, "");
  return trimmedValue.replace(".", ",");
};

export const percentageParseInt = (val: unknown): number => {
  if (typeof val !== "string") return 0;
  const cleaned = val.replace(/[^\d,.]/g, "");
  const numericValue = parseFloat(cleaned.replace(",", ".")) || 0;
  return Math.round(numericValue * 100);
};
