"use client";

import { useConfirmPayment } from "./use-confirm-payment";
import { PaymentLoadingState } from "./payment-loading-state";
import { PaymentSuccessState } from "./payment-success-state";
import { PaymentPendingState } from "./payment-pending-state";
import { PaymentErrorState } from "./payment-error-state";

export default function PagoExitoPage() {
  const { state, jobId } = useConfirmPayment();

  if (state === "loading") return <PaymentLoadingState />;
  if (state === "success") return <PaymentSuccessState jobId={jobId} />;
  if (state === "pending") return <PaymentPendingState />;
  return <PaymentErrorState />;
}
