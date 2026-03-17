const LANGUAGE_MAP: Record<string, string> = {
  EN: "English",
  EN_EN: "English",
  PT_BR: "Português (Brasil)",
  ES: "Español",
  ES_ES: "Español",
  FR: "Français",
  FR_FR: "Français",
  DE: "Deutsch",
  DE_DE: "Deutsch",
  IT: "Italiano",
  IT_IT: "Italiano",
  RU: "Русский",
  RU_RU: "Русский",
  HR: "Croata",
  HR_HR: "Croata",
  PT_PT: "Português (Portugal)",
  NL: "Nederlands",
  NL_NL: "Nederlands",
  RO: "Romeno",
  RO_RO: "Romeno",
  CS: "Tcheco",
  CS_CS: "Tcheco",
};

const FLAG_MAP: Record<string, string> = {
  EN: "us",
  EN_EN: "us",
  PT_BR: "br",
  ES: "es",
  ES_ES: "es",
  FR: "fr",
  FR_FR: "fr",
  DE: "de",
  DE_DE: "de",
  IT: "it",
  IT_IT: "it",
  RU: "ru",
  RU_RU: "ru",
  HR: "hr",
  HR_HR: "hr",
  PT_PT: "pt",
  NL: "nl",
  NL_NL: "nl",
  RO: "ro",
  RO_RO: "ro",
  CS: "cz",
  CS_CS: "cz",
};

export const getLanguageName = (code: string): string => {
  return LANGUAGE_MAP[code.toUpperCase()] || code;
};

export const getFlagCode = (code: string): string => {
  return FLAG_MAP[code.toUpperCase()] || code.toLowerCase();
};
