"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export function JobSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    if (q) {
      router.push(`/?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/");
    }
  }

  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              defaultValue={searchParams.get("search") ?? ""}
              placeholder="Busca por puesto, empresa o descripción…"
              className="w-full rounded-2xl border border-border bg-background pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 shrink-0"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
