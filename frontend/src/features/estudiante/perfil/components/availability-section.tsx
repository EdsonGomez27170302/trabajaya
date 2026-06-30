"use client";

import { DAYS, TURNOS } from "./profile-form-schema";

export function AvailabilitySection({
  availability,
  onToggle,
}: {
  availability: Record<string, string[]>;
  onToggle: (day: string, turno: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Disponibilidad horaria</p>
      <p className="mt-1 text-sm text-muted-foreground mb-4">Marca los días y turnos en los que puedes trabajar.</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-90 text-sm">
          <thead>
            <tr>
              <th className="pb-3 text-left font-semibold text-foreground w-28">Día</th>
              {TURNOS.map((t) => (
                <th key={t} className="pb-3 text-center font-semibold text-foreground">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="py-2.5 text-sm text-foreground font-medium">{day}</td>
                {TURNOS.map((turno) => {
                  const checked = (availability[day] ?? []).includes(turno);
                  return (
                    <td key={turno} className="py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => onToggle(day, turno)}
                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-semibold transition ${
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {checked ? "✓" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(availability).length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          Disponible:{" "}
          {Object.entries(availability)
            .map(([day, turnos]) => `${day} (${turnos.join(", ")})`)
            .join(" · ")}
        </p>
      )}
    </section>
  );
}
