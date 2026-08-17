import { useEffect, useState } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { getGroomingQueue, updateGroomingStatus, type GroomingAppointment } from "../../services/api";

const FLOW = ["Agendado", "Recepcionado", "Em atendimento", "Finalizado", "Entregue"];
const FLOW_COLORS: Record<string, string> = {
  Agendado: "bg-[#dcfce7] text-[#15803d] border-[#86efac]",
  Recepcionado: "bg-blue-50 text-blue-700 border-blue-200",
  "Em atendimento": "bg-amber-50 text-amber-700 border-amber-200",
  Finalizado: "bg-violet-50 text-violet-700 border-violet-200",
  Entregue: "bg-gray-100 text-gray-500 border-gray-200",
  Concluído: "bg-gray-100 text-gray-500 border-gray-200",
};

const GROOMING = ["Banho", "Tosa", "Banho + Tosa", "Tosa Higiênica", "Corte de Unhas"];

type PetStatus = { id: number; status: string; obs: string };

export default function BanhoTosa() {
  const [pets, setPets] = useState<GroomingAppointment[]>([]);
  useEffect(() => { getGroomingQueue().then((result) => setPets(result.data)).catch(() => setPets([])); }, []);
  const statuses = Object.fromEntries(pets.map((p) => [p.id, { id: p.id, status: p.status, obs: p.notes ?? "" }]));
  const [obsOpen, setObsOpen] = useState<number | null>(null);

  const advance = async (id: number) => {
    const cur = statuses[id].status; const idx = FLOW.indexOf(cur); const next = idx < FLOW.length - 1 ? FLOW[idx + 1] : cur;
    if (next !== cur) { const updated = await updateGroomingStatus(id, next); setPets((items) => items.map((item) => item.id === id ? { ...item, status: updated.status } : item)); }
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Banho e Tosa</h1>
        <p className="text-sm text-[#6b7280]">Fila de atendimento do dia — {pets.length} pets</p>
      </div>

      {/* Flow legend */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FLOW.map((f, i) => (
          <div key={f} className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${FLOW_COLORS[f]}`}>{f}</span>
            {i < FLOW.length - 1 && <ChevronRight size={14} className="text-[#d1d5db]" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {pets.map(pet => {
          const cur = statuses[pet.id]?.status || pet.status;
          const flowIdx = FLOW.indexOf(cur);
          const isDone = cur === "Entregue" || cur === "Concluído";
          return (
            <div key={pet.id} className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${isDone ? "opacity-60 border-[#e5e7eb]" : "border-[#e5e7eb] hover:border-[#86efac] hover:shadow-md"}`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-2xl flex-shrink-0">
                  🐾
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-[#111827] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pet.pet}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex-shrink-0 ${FLOW_COLORS[cur] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {cur}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] mt-0.5">{pet.tutor}</p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Serviço</span>
                  <span className="font-medium text-[#374151]">{pet.service}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Horário</span>
                  <span className="font-medium text-[#374151]">{new Date(pet.starts_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Responsável</span>
                  <span className="font-medium text-[#374151]">{pet.employee}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1 bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16a34a] rounded-full transition-all"
                    style={{ width: `${((flowIdx + 1) / FLOW.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {!isDone && (
                  <button
                    onClick={() => advance(pet.id)}
                    className="flex-1 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-xl transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Avançar etapa
                  </button>
                )}
                <button
                  onClick={() => setObsOpen(pet.id)}
                  className="p-2 border border-[#e5e7eb] rounded-xl hover:bg-[#f3f4f6] text-[#6b7280] transition-colors"
                >
                  <MessageSquare size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {obsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Observações do atendimento</h2>
            <textarea
              rows={4}
              placeholder="Ex: Pet estava agitado, pelo muito emaranhado..."
              className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setObsOpen(null)} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm text-[#374151] hover:bg-[#f3f4f6]">Cancelar</button>
              <button onClick={() => setObsOpen(null)} className="flex-1 py-2.5 bg-[#16a34a] text-white rounded-xl text-sm font-semibold hover:bg-[#15803d]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
