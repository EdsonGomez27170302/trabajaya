"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CompanyProfile, StudentProfile, User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  profile: StudentProfile | CompanyProfile | null;
  setAuth: (
    token: string,
    user: User,
    profile: StudentProfile | CompanyProfile | null,
  ) => void;
  updateProfile: (profile: StudentProfile | CompanyProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      profile: null,
      setAuth: (token, user, profile) => set({ token, user, profile }),
      updateProfile: (profile) => set({ profile }),
      logout: () => set({ token: null, user: null, profile: null }),
    }),
    { name: "trabajaya-auth" },
  ),
);
