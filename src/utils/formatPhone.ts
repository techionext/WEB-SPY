import { parsePhoneNumberFromString } from "libphonenumber-js";

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
