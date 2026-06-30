"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CompanyProfile, StudentProfile, User } from "@/types";

// The session secret lives in an httpOnly cookie the browser manages; this
// store only caches non-sensitive display data so the UI can render
// instantly, and is always reconciled against /auth/me by RouteGuard.
interface AuthState {
  user: User | null;
  profile: StudentProfile | CompanyProfile | null;
  setAuth: (user: User, profile: StudentProfile | CompanyProfile | null) => void;
  updateProfile: (profile: StudentProfile | CompanyProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      setAuth: (user, profile) => set({ user, profile }),
      updateProfile: (profile) => set({ profile }),
      logout: () => set({ user: null, profile: null }),
    }),
    { name: "trabajaya-auth" },
  ),
);
