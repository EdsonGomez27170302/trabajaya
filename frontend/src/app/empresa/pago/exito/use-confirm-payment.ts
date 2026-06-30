"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api";

export type PaymentState = "loading" | "success" | "pending" | "error";

export function useConfirmPayment() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PaymentState>("loading");
  const [jobId, setJobId] = useState<number | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    async function confirm() {
      const paymentId = searchParams.get("payment_id");
      const status = searchParams.get("status");

      if (!paymentId || status === "failure") { setState("error"); return; }
      if (status === "pending") { setState("pending"); return; }

      try {
        const { data } = await api.get<{ status: string; upgraded: boolean; job_id?: number }>(
          `/company/payment/confirm?payment_id=${paymentId}`,
        );
        if (data.upgraded) {
          if (data.job_id) setJobId(data.job_id);
          setState("success");
        } else {
          setState(data.status === "pending" ? "pending" : "error");
        }
      } catch {
        setState("error");
      }
    }

    confirm();
  }, [searchParams]);

  return { state, jobId };
}
