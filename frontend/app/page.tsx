const featuredJobs = [
  {
    title: "Asistente de ventas por horas",
    company: "Tienda Ayacucho Center",
    zone: "Centro",
    salary: "S/ 15/hora",
    schedule: "Lun a Vie · 14:00 - 18:00",
    badge: "Destacado",
  },
  {
    title: "Cajero y atención al público",
    company: "Café Universitario",
    zone: "San Juan",
    salary: "S/ 12/hora",
    schedule: "Fin de semana · 08:00 - 13:00",
    badge: "Nuevo",
  },
  {
    title: "Mensajería y apoyo administrativo",
    company: "ServiExpress Ayacucho",
    zone: "Huamanga",
    salary: "S/ 18/hora",
    schedule: "Mañanas · 08:00 - 12:00",
    badge: "Próximo",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8">
          <nav className="flex items-center justify-between text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-orange-500">TrabajaYa</p>
              <h2 className="text-xl font-semibold text-slate-900">Ayacucho para estudiantes UNSCH</h2>
            </div>
            <a
              href="#registro"
              className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
            >
              Crear cuenta
            </a>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                Bolsa laboral digital para estudiantes y empresas
              </p>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
                Encuentra trabajo por horas y publica vacantes en Ayacucho, sin papeleo ni pérdidas de tiempo.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Conectamos estudiantes de la UNSCH con empresas locales que necesitan talento joven, con filtros por zona, horario y modalidad.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#estudiantes" className="rounded-full bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600">Soy estudiante</a>
                <a href="#empresas" className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100">Soy empresa</a>
              </div>
            </div>

            <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Hoy en la plataforma</p>
              <div className="mt-6 grid gap-4">
                {[
                  ["Ofertas activas", "124"],
                  ["Estudiantes verificados", "386"],
                  ["Empresas conectadas", "47"],
                ].map(([label, value]) => (
                  <article key={label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-sm text-slate-300">{label}</p>
                    <p className="mt-2 text-3xl font-black">{value}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1fr] lg:px-8">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Qué resuelve</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">Una sola fuente confiable para ofertas reales.</h3>
          <ul className="mt-6 space-y-4 text-slate-600">
            <li>• Publicación digital que llega a estudiantes universitarios en minutos.</li>
            <li>• Filtros por zona, horario, modalidad y sueldo por hora.</li>
            <li>• Perfiles verificados con correo institucional y revisión de empresas.</li>
          </ul>
        </article>

        <article id="registro" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Primeros pasos</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">Regístrate según tu perfil</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <a href="/auth/register/estudiante" className="rounded-2xl bg-orange-50 p-4 transition hover:bg-orange-100">
              <strong className="block text-slate-950">Estudiante UNSCH</strong>
              <span className="text-sm text-slate-600">Busca trabajo compatible con tu horario y carrera.</span>
            </a>
            <a href="/auth/register/empresa" className="rounded-2xl bg-slate-100 p-4 transition hover:bg-slate-200">
              <strong className="block text-slate-950">Empresa local</strong>
              <span className="text-sm text-slate-600">Publica vacantes y filtra candidatos verificados.</span>
            </a>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Últimas ofertas</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">Vacantes destacadas para empezar hoy</h3>
          </div>
          <a href="/estudiante/ofertas" className="text-sm font-semibold text-slate-700 hover:text-slate-950">Ver todas →</a>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredJobs.map((job) => (
            <article key={job.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">{job.badge}</span>
                <span className="text-sm text-slate-500">{job.zone}</span>
              </div>
              <h4 className="mt-4 text-xl font-semibold text-slate-950">{job.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{job.company}</p>
              <p className="mt-4 text-sm text-slate-700">{job.salary}</p>
              <p className="mt-2 text-sm text-slate-600">{job.schedule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2 lg:px-8">
          <article id="estudiantes" className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Para estudiantes</p>
            <h3 className="mt-3 text-2xl font-bold">Publica tu perfil y recibe vacantes compatibles</h3>
            <p className="mt-4 text-slate-300">Lleva tu experiencia, disponibilidad y zona para que las empresas te encuentren rápido.</p>
          </article>
          <article id="empresas" className="rounded-3xl bg-orange-500 p-6 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100">Para empresas</p>
            <h3 className="mt-3 text-2xl font-bold">Publica ofertas y filtra candidatos reales</h3>
            <p className="mt-4 text-orange-50">Centraliza tu búsqueda, destaca vacantes y mejora tu alcance con un canal universitario.</p>
          </article>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>TrabajaYa Ayacucho © 2026 — Plataforma digital para estudiantes UNSCH.</p>
        <p>Ayacucho, Perú</p>
      </footer>
    </main>
  );
}
