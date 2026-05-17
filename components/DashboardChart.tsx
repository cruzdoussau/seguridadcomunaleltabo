"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-950">Casos por categoría general</h3>
        <p className="text-sm text-slate-500">Distribución inicial entre delitos e incivilidades.</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "#eef7ff" }} />
          <Bar dataKey="value" fill="#0f63ad" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
