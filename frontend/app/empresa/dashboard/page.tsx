export default function CompanyDashboardPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-500">Empresa</p>
        <h1 className="text-3xl font-black text-slate-950">Dashboard de la empresa</h1>
        <p className="text-slate-600">Resumen de ofertas activas, postulaciones recibidas, vistas y acceso rápido a publicar vacantes.</p>
      </div>
    </main>
  );
}
