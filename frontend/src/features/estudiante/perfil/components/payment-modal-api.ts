import { api } from "@/lib/api";
import type { CardPaymentSubmit, MPPayload } from "./payment-modal-types";

export type PaymentProcessResult = {
  status: string;
  status_detail: string;
  upgraded: boolean;
};

export function extractMercadoPagoPayload(param: CardPaymentSubmit): MPPayload {
  // El SDK envía el payload directo o anidado en { formData }
  return "formData" in param && param.formData ? param.formData : (param as MPPayload);
}

export async function processCardPayment(fd: MPPayload) {
  const { data } = await api.post<PaymentProcessResult>("/student/payment/process", {
    token: fd.token,
    payment_method_id: fd.payment_method_id,
    installments: fd.installments || 1,
    issuer_id: Number(fd.issuer_id) || 0,
    email: fd.payer?.email ?? "",
  });
  return data;
}

export function extractErrorMessage(e: unknown): string {
  return (
    (e as { response?: { data?: { error?: string } } })?.response?.data?.error ??
    "Error al procesar el pago. Intenta de nuevo."
  );
}
