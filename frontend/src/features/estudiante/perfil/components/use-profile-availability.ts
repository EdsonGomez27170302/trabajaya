"use client";

import { useState } from "react";

export function useProfileAvailability() {
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  function toggleTurno(day: string, turno: string) {
    setAvailability((prev) => {
      const current = prev[day] ?? [];
      const updated = current.includes(turno) ? current.filter((t) => t !== turno) : [...current, turno];
      if (updated.length === 0) {
        const rest = { ...prev };
        delete rest[day];
        return rest;
      }
      return { ...prev, [day]: updated };
    });
  }

  return { availability, setAvailability, toggleTurno };
}
