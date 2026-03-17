export const formatViews = (views: number): string => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1).replace(".", ",")} mi`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1).replace(".", ",")} mil`;
  return views.toString();
};
