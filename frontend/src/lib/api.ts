import axios from "axios";

import { API_URL } from "@/lib/config";

// withCredentials lets the browser send/receive the httpOnly session cookie;
// there's no token to attach manually anymore.
export const api = axios.create({ baseURL: API_URL, withCredentials: true });
