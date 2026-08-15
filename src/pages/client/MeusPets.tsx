import { useState } from "react";
import { Plus, X, Calendar, Stethoscope, Bath } from "lucide-react";
import { pets } from "../../data/mockData";

const myPets = pets.filter(p => p.tutorId === 1);
const petHistory = [
  { tipo: "Banho + Tosa", data: "08/08/2026", icon: Bath, color: "bg-[#dcfce7] text-[#16a34a]" },
  { tipo: "Consulta Veterinária", data: "15/07/2026", icon: Stethoscope, color: "bg-blue-50 text-blue-600" },
  { tipo: "Vacinação V10", data: "10/06/2026", icon: Stethoscope, color: "bg-violet-50 text-violet-600" },
  { tipo: "Banho", data: "01/06/2026", icon: Bath, color: "bg-[#dcfce7] text-[#16a34a]" },
];

export default function MeusPets() {
  const [selected, setSelected] = useState<typeof myPets[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meus Pets</h1>
          <p className="text-sm text-[#6b7280]">{myPets.length} pets cadastrados</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />
          Adicionar pet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myPets.map(pet => (
          <div
            key={pet.id}
            onClick={() => setSelected(pet)}
            className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 cursor-pointer hover:border-[#86efac] hover:shadow-md transition-all"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center text-4xl mx-auto mb-3">{pet.foto}</div>
              <h3 className="font-bold text-[#111827] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pet.nome}</h3>
              <p className="text-sm text-[#6b7280]">{pet.raca}</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">{pet.idade}</p>
            </div>
            <div className="space-y-1.5 border-t border-[#f3f4f6] pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#9ca3af]">Espécie</span>
                <span className="text-[#374151] font-medium">{pet.especie}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9ca3af]">Peso</span>
                <span className="text-[#374151] font-medium">{pet.peso}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9ca3af]">Último atend.</span>
                <span className="text-[#374151] font-medium">{pet.ultimoAtendimento}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-3xl">{selected.foto}</div>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selected.nome}</h2>
                  <p className="text-sm text-[#6b7280]">{selected.raca}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide mb-3">Informações</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {[["Sexo", selected.sexo], ["Nascimento", selected.nascimento], ["Idade", selected.idade], ["Peso", selected.peso]].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[11px] text-[#9ca3af]">{k}</p>
                      <p className="text-sm font-medium text-[#374151]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide mb-3">Histórico</h3>
                <div className="space-y-2">
                  {petHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
                      <div className={`p-2 rounded-lg ${h.color}`}><h.icon size={14} /></div>
                      <div>
                        <p className="text-sm font-medium text-[#374151]">{h.tipo}</p>
                        <p className="text-xs text-[#9ca3af]">{h.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Calendar size={16} />
                Agendar serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
