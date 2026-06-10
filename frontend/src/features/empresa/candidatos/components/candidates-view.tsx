import { PlaceholderCard } from "@/components/shared/placeholder-card";

interface CandidatesViewProps {
  jobId: string;
}

export function CandidatesView({ jobId }: CandidatesViewProps) {
  return (
    <PlaceholderCard
      eyebrow="Candidatos"
      title="Candidatos por oferta"
      description="Vista para aceptar o rechazar postulaciones con notificaciones automáticas."
    >
      <p className="text-sm text-muted-foreground">
        Oferta seleccionada:{" "}
        <span className="font-semibold text-foreground">#{jobId}</span>
      </p>
    </PlaceholderCard>
  );
}
