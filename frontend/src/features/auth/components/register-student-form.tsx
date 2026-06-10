import { PlaceholderCard } from "@/components/shared/placeholder-card";

export function RegisterStudentForm() {
  return (
    <PlaceholderCard
      eyebrow="Registro"
      title="Crea tu cuenta de estudiante UNSCH"
      description="Formulario listo para conectar con el backend cuando se implemente la autenticación real."
    >
      <div className="rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
        Usuario, correo institucional, facultad, carrera y semestre se
        integrarán aquí.
      </div>
    </PlaceholderCard>
  );
}
