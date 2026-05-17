import { Badge } from "@/components/Badge";
import { SectionHeader } from "@/components/SectionHeader";
import { users } from "@/data/users";

export default function UsuariosPage() {
  return (
    <div>
      <SectionHeader
        title="Usuarios"
        description="Roles administrativos y operativos para la gestión de seguridad comunal."
      />
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-950">{user.nombre}</td>
                  <td className="px-4 py-4 text-slate-600">{user.correo}</td>
                  <td className="px-4 py-4 text-slate-700">{user.rol}</td>
                  <td className="px-4 py-4">
                    <Badge kind="neutral" value={user.activo ? "Activo" : "Inactivo"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
