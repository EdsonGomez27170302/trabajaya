export default function StudentRegisterPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-500">Registro</p>
        <h1 className="text-3xl font-black text-slate-950">Crea tu cuenta de estudiante UNSCH</h1>
        <p className="text-slate-600">Formulario listo para conectar con el backend cuando se implemente la autenticación real.</p>
        <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
          Usuario, correo institucional, facultad, carrera y semestre se integrarán aquí.
        </div>
      </div>
    </main>
  );
}
