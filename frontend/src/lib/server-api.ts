import axios from "axios";
import { INTERNAL_API_URL } from "@/lib/config";

export const serverApi = axios.create({
  baseURL: INTERNAL_API_URL,
  withCredentials: true,
});
