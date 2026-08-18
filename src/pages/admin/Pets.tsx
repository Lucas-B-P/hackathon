import { useEffect, useState } from "react"
import { Search, Plus, X } from "lucide-react"

import { getAdminPets, type AdminPet } from "../../services/api"

const petHistory = [
  { tipo: "Banho + Tosa", data: "08/08/2026", obs: "Comportamento calmo" },

  { tipo: "Consulta Veterinária", data: "15/07/2026", obs: "Check-up geral" },

  { tipo: "Vacinação V10", data: "10/06/2026", obs: "Reforço anual" },

  { tipo: "Banho", data: "01/06/2026", obs: "Sem observações" },
]

export default function Pets() {
  const [search, setSearch] = useState("")
  const [pets, setPets] = useState<AdminPet[]>([])
  const [selected, setSelected] = useState<AdminPet | null>(null)
  useEffect(() => {
    getAdminPets()
      .then((result) => setPets(result.data))
      .catch(() => setPets([]))
  }, [])
  const filtered = pets.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tutor.toLowerCase().includes(search.toLowerCase()) ||
      (p.breed ?? "").toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pets
          </h1>
          <p className="text-sm text-[#6b7280]">
            {pets.length} animais cadastrados
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Plus size={16} />
          Novo pet
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, raça ou tutor..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#16a34a] transition-colors"
        />
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-4 cursor-pointer hover:border-[#86efac] hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-2xl flex-shrink-0">
                🐾
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-[#111827] text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {p.name}
                </p>
                <p className="text-xs text-[#6b7280]">
                  {p.breed || "Sem raça"}
                </p>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  {p.species} · {p.sex || "Não informado"}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f3f4f6] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#9ca3af]">Tutor</p>
                <p className="text-xs font-medium text-[#374151]">{p.tutor}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#9ca3af]">Último atend.</p>
                <p className="text-xs font-medium text-[#374151]">
                  Sem registro
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pet detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-3xl">
                  🐾
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-[#111827]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {selected.name}
                  </h2>
                  <p className="text-sm text-[#6b7280]">
                    {selected.breed || "Sem raça"} · {selected.species}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">
                  Informações
                </h3>
                {[
                  ["Sexo", selected.sex || "Não informado"],
                  ["Nascimento", selected.birth_date || "Não informado"],
                  [
                    "Peso",
                    selected.weight ? `${selected.weight} kg` : "Não informado",
                  ],
                  ["Tutor", selected.tutor],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between py-1.5 border-b border-[#f3f4f6]"
                  >
                    <span className="text-xs text-[#9ca3af]">{k}</span>
                    <span className="text-xs font-medium text-[#374151]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">
                  Histórico
                </h3>
                {petHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 py-1.5 border-b border-[#f3f4f6]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#374151]">
                        {h.tipo}
                      </p>
                      <p className="text-[11px] text-[#9ca3af]">
                        {h.data} · {h.obs}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
