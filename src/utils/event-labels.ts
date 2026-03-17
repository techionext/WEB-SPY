export const EVENT_LABELS: Record<string, string> = {
  ABANDONED_CART: "Carrinho Abandonado",
  PURCHASE_UPSELL: "Compra Upsell",
  PURCHASE_CONFIRMED: "Compra Confirmada",
  PURCHASE_PENDING: "Compra Pendente",
  PURCHASE_EXPIRED: "Compra Expirada",
  PURCHASE_CANCELED: "Compra Cancelada",
  PURCHASE_SHIPPED: "Compra Enviada",
  PURCHASE_REFUND: "Compra Reembolsada",
  PURCHASE_UPDATED: "Compra Atualizada",
  PURCHASE_CHARGEBACK: "Cobrança Recusada",
  SUBSCRIPTION_INITIATED: "Assinatura Iniciada",
  SUBSCRIPTION_RENEWAL: "Renovação de Assinatura",
  SUBSCRIPTION_RENEWAL_PENDING: "Renovação de Assinatura Pendente",
  SUBSCRIPTION_UPDATED: "Assinatura Atualizada",
  SUBSCRIPTION_CANCELED: "Assinatura Cancelada",
  SUBSCRIPTION_EXPIRED: "Assinatura Expirada",
  SUBSCRIPTION_RENEWAL_CANCELLED: "Renovação de Assinatura Cancelada",
  SUBSCRIPTION_RENEWAL_RESUMED: "Renovação de Assinatura Resumida",
  REJECTED: "Rejeitado",
  UNKNOWN: "Evento Desconhecido",
};

export const getEventLabel = (event: string) => {
  return EVENT_LABELS[event] ?? event;
};
