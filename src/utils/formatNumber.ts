/**
 * Formata números grandes para exibição compacta (ex: anúncios, views).
 * Facilita a leitura: 23336 → "23,3 mil", 1500000 → "1,5 mi"
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted =
      millions % 1 === 0 ? millions.toString() : millions.toFixed(1).replace(".", ",");
    return `${formatted} mi`;
  }

  if (value >= 1_000) {
    const thousands = value / 1_000;
    const formatted =
      thousands % 1 === 0 ? thousands.toString() : thousands.toFixed(1).replace(".", ",");
    return `${formatted} mil`;
  }

  return new Intl.NumberFormat("pt-BR").format(value);
};
