export default function LoginPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-500">Acceso</p>
        <h1 className="text-3xl font-black text-slate-950">Inicia sesión como estudiante, empresa o administrador</h1>
        <p className="text-slate-600">La autenticación JWT y el redireccionamiento por rol se conectarán en esta vista.</p>
      </div>
    </main>
  );
}
