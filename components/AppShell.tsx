"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Home, Map, Menu, Settings, Shield, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Denuncias", href: "/denuncias", icon: FileText },
  { name: "Mapa operativo", href: "/mapa", icon: Map },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Usuarios", href: "/usuarios", icon: Users },
  { name: "Configuración", href: "/configuracion", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-municipal-900 text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-municipal-500">
          <Shield className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-municipal-100">Municipalidad</p>
          <h1 className="text-base font-bold leading-tight">Seguridad Comunal</h1>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-white text-municipal-900 shadow-sm" : "text-municipal-50 hover:bg-white/10"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-5 text-xs text-municipal-100">
        <p className="font-semibold text-white">MVP Operativo</p>
        <p className="mt-1 leading-relaxed">Base web para futura app ciudadana y equipos en terreno.</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/45" onClick={() => setOpen(false)} aria-label="Cerrar menú" />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-municipal-600">Sistema Municipal</p>
            <p className="text-sm font-semibold text-slate-900 sm:text-base">Gestión de denuncias, delitos e incivilidades</p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Central activa
            </span>
            <div className="h-9 w-9 rounded-full bg-municipal-700 text-center text-sm font-bold leading-9 text-white">CS</div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
