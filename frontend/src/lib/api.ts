import axios from "axios";

import { API_URL } from "@/lib/config";

export const api = axios.create({ baseURL: API_URL });

// Attach token from the auth store on every request (client-side only).
// The import is deferred to avoid circular deps and SSR issues.
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    // Dynamic import at call time avoids circular reference at module load.
    const { useAuthStore } = require("@/store/auth-store") as typeof import("@/store/auth-store");
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}
