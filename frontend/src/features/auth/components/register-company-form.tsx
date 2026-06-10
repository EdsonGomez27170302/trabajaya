import { PlaceholderCard } from "@/components/shared/placeholder-card";

export function RegisterCompanyForm() {
  return (
    <PlaceholderCard
      eyebrow="Registro"
      title="Registra tu empresa en Ayacucho"
      description="El formulario de empresa estará listo para el flujo de verificación y publicación de ofertas."
    >
      <div className="rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
        RUC, sector, dirección, zona y contacto se integrarán aquí.
      </div>
    </PlaceholderCard>
  );
}
