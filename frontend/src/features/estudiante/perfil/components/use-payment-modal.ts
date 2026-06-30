"use client";

import { useEffect, useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";

import { MP_PUBLIC_KEY } from "@/lib/config";
import type { CardPaymentSubmit } from "./payment-modal-types";
import { extractErrorMessage, extractMercadoPagoPayload, processCardPayment } from "./payment-modal-api";

let mpReady = false;

export function usePaymentModal(onSuccess: () => void) {
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(mpReady);

  useEffect(() => {
    if (!mpReady && MP_PUBLIC_KEY) {
      initMercadoPago(MP_PUBLIC_KEY, { locale: "es-PE" });
      mpReady = true;
    }
    setReady(true);
  }, []);

  async function handleSubmit(param: CardPaymentSubmit) {
    setProcessing(true);
    setError("");

    const fd = extractMercadoPagoPayload(param);

    if (!fd?.token) {
      setError("No se pudo tokenizar la tarjeta. Intenta de nuevo.");
      setProcessing(false);
      return;
    }

    try {
      const data = await processCardPayment(fd);
      if (data.upgraded) {
        onSuccess();
      } else {
        setError(`Pago ${data.status}: ${data.status_detail}`);
      }
    } catch (e: unknown) {
      setError(extractErrorMessage(e));
    } finally {
      setProcessing(false);
    }
  }

  function handleError(e: unknown) {
    const err = e as { message?: string };
    setError(err?.message ?? "Error en el formulario de pago");
    setProcessing(false);
  }

  return { error, processing, ready, handleSubmit, handleError };
}
