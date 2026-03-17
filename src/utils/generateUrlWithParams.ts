type QueryArgs = Record<string, string | number | boolean | (string | number | boolean)[]>;

export const buildQueryString = <T extends QueryArgs>({
  args,
  endpoint,
}: {
  args: T | void;
  endpoint: string;
}) => {
  const params = new URLSearchParams();

  if (typeof args !== "object") return endpoint;

  Object.entries(args).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          params.append(key, String(item));
        }
      });
    } else if (value !== null && value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  return `${endpoint}?${params.toString()}`;
};
