const DAY_LABELS: Record<string, string> = {
  lunes: "Lun",
  martes: "Mar",
  miercoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sabado: "Sáb",
  domingo: "Dom",
};

const DAY_ORDER = Object.keys(DAY_LABELS);

export function formatSalary(job: {
  salary: number;
  salary_type: "por_hora" | "mensual";
}): string {
  const unit = job.salary_type === "por_hora" ? "hora" : "mes";
  const amount = Number.isInteger(job.salary)
    ? job.salary.toString()
    : job.salary.toFixed(2);
  return `S/ ${amount}/${unit}`;
}

export function formatScheduleSummary(
  schedule: Record<string, string[]>,
): string {
  const days = DAY_ORDER.filter((day) => schedule[day]?.length);
  if (days.length === 0) return "Horario a coordinar";

  const labels = days.map((day) => DAY_LABELS[day]).join(", ");
  const sampleHours = schedule[days[0]][0];
  return `${labels} · ${sampleHours}`;
}
