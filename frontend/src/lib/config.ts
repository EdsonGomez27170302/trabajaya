export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const ASSET_BASE_URL = API_URL.replace(/\/api\/?$/, "");
