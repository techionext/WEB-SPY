import { PlatformType } from "@/types/platforms/platforms.type";

const PLATFORM_TYPE_LABELS: Record<string, string> = {
  BEMONY: "Bemony",
  B4YOU: "B4You",
  BRAIP: "Braip",
  CARTPANDA: "Cartpanda",
  NUTRALINK: "Nutralink",
  HOTMART: "Hotmart",
  KIRVANO: "Kirvano",
  KIWIFY: "Kiwify",
  LAST_LINK: "Last Link",
  PAYT: "Payt",
  DIGISTORE: "Digistore24",
  CLICK_BANK: "ClickBank",
};

export function getPlatformTypeLabel(
  type: PlatformType | string | { value?: string; id?: string; name?: string } | undefined | null,
): string {
  if (type == null) return "—";
  const key =
    typeof type === "object" && type !== null ? (type.value ?? type.id ?? type.name) : type;
  if (key == null || key === "") return "—";
  const normalized = String(key).toUpperCase();
  return PLATFORM_TYPE_LABELS[normalized] ?? String(key);
}
