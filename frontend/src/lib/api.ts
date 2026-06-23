import axios from "axios";

import { API_URL } from "@/lib/config";

export const api = axios.create({ baseURL: API_URL });

if (typeof window !== "undefined") {
  api.interceptors.request.use(async (config) => {
    const { useAuthStore } = await import("@/store/auth-store");
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}
