import { parsePhoneNumberFromString } from "libphonenumber-js";

const MAX_BR_DIGITS = 11;

/** Máscara dinâmica (XX) XXXXX-XXXX / (XX) XXXX-XXXX conforme o usuário digita. */
export const maskBrazilianPhoneInput = (value: string): string => {
  const d = value.replace(/\D/g, "").slice(0, MAX_BR_DIGITS);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
};

/**
 * Formata um número de telefone para exibição no padrão brasileiro (BR).
 * Aceita números com ou sem o código do país (55).
 */
export const formatPhone = (phone: string | undefined | null): string => {
  if (!phone) return "Não configurado";

  const cleaned = phone.replace(/\D/g, "");

  const finalValue = cleaned.startsWith("55") ? `+${cleaned}` : `+55${cleaned}`;

  const phoneNumber = parsePhoneNumberFromString(finalValue);

  if (phoneNumber && phoneNumber.isValid()) {
    return phoneNumber.formatInternational();
  }

  return phone;
};
