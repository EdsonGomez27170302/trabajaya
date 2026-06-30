"use client";

import { useConfirmStudentPayment } from "./use-confirm-student-payment";
import { StudentPaymentLoadingState } from "./student-payment-loading-state";
import { StudentPaymentSuccessState } from "./student-payment-success-state";
import { StudentPaymentPendingState } from "./student-payment-pending-state";
import { StudentPaymentErrorState } from "./student-payment-error-state";

export default function PagoExitoEstudiantePage() {
  const { state } = useConfirmStudentPayment();

  if (state === "loading") return <StudentPaymentLoadingState />;
  if (state === "success") return <StudentPaymentSuccessState />;
  if (state === "pending") return <StudentPaymentPendingState />;
  return <StudentPaymentErrorState />;
}
