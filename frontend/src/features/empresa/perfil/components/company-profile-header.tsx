import type { CompanyProfile } from "@/types";

export function CompanyProfileHeader({ profile }: { profile: CompanyProfile | null }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Perfil</p>
      <h1 className="mt-2 text-3xl font-black text-foreground">Perfil de empresa</h1>
      {profile && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{profile.sector}</span>
          <span>·</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${profile.is_verified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {profile.is_verified ? "Verificada" : "Pendiente de verificación"}
          </span>
        </div>
      )}
    </div>
  );
}
