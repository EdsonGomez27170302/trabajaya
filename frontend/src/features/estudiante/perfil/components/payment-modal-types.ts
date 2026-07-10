export type MPPayload = {
  token: string;
  payment_method_id: string;
  installments: number;
  issuer_id: string | number;
  payer: { email?: string; identification?: { type: string; number: string } };
};

export type CardPaymentSubmit = { selectedPaymentMethod?: string; formData?: MPPayload } | MPPayload;
