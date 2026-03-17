/**
 * Cache de arquivos fora do Redux para evitar problemas de serialização
 * Os objetos File não podem ser armazenados no Redux, então mantemos aqui
 */
const fileCache = new Map<string, File>();

export const fileCacheUtils = {
  set: (uploadId: string, file: File) => {
    fileCache.set(uploadId, file);
  },
  get: (uploadId: string): File | undefined => {
    return fileCache.get(uploadId);
  },
  remove: (uploadId: string) => {
    fileCache.delete(uploadId);
  },
  clear: () => {
    fileCache.clear();
  },
};
