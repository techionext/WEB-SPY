export const getExtension = (mimeType: string) => {
  if (!mimeType) return "txt";

  const map: Record<string, string> = {
    "text/plain": "txt",
    "application/pdf": "pdf",
    "application/json": "json",
  };

  return map[mimeType] || "txt";
};
