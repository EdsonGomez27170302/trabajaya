export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3004/api";

export const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL ?? "http://backend:3004/api";

export const ASSET_BASE_URL = API_URL.replace(/\/api\/?$/, "");

export const MP_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "";
