export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-500">Admin</p>
        <h1 className="text-3xl font-black text-slate-950">Panel de administración</h1>
        <p className="text-slate-600">Estadísticas, verificación de empresas, usuarios y moderación de ofertas en una sola vista.</p>
      </div>
    </main>
  );
}
