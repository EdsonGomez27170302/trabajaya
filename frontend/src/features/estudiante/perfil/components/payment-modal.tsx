"use client";

import { CardPayment } from "@mercadopago/sdk-react";

import { PaymentModalHeader } from "./payment-modal-header";
import { usePaymentModal } from "./use-payment-modal";

interface Props {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function PaymentModal({ amount, onSuccess, onClose }: Props) {
  const { error, processing, ready, handleSubmit, handleError } = usePaymentModal(onSuccess);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-background p-6 shadow-xl">
        <PaymentModalHeader amount={amount} processing={processing} onClose={onClose} />

        {processing && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-primary font-medium">Procesando pago…</p>
          </div>
        )}

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        {ready ? (
          <CardPayment
            initialization={{ amount }}
            customization={{ paymentMethods: { minInstallments: 1, maxInstallments: 1 } }}
            onSubmit={handleSubmit}
            onError={handleError}
          />
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
