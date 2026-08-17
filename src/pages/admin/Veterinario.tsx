import { useEffect, useState } from "react";
import { Stethoscope, Plus } from "lucide-react";
import { getVeterinaryAppointments, type VeterinaryAppointment } from "../../services/api";

const consultas = [
  { pet: "Rex", tutor: "Rafael Souza", horario: "10:00", tipo: "Check-up geral", vet: "Dra. Beatriz Vet", status: "Agendado" },
  { pet: "Luna", tutor: "Mariana Costa", horario: "11:30", tipo: "Vacinação V10", vet: "Dra. Beatriz Vet", status: "Concluído" },
  { pet: "Thor", tutor: "Lucas Oliveira", horario: "14:30", tipo: "Vacinação", vet: "Dra. Beatriz Vet", status: "Agendado" },
];

export default function Veterinario() {
  const [consultas, setConsultas] = useState<VeterinaryAppointment[]>([]);
  useEffect(() => { getVeterinaryAppointments().then((result) => setConsultas(result.data)).catch(() => setConsultas([])); }, []);
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Veterinário</h1>
          <p className="text-sm text-[#6b7280]">Consultas e procedimentos de hoje</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />
          Nova consulta
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {consultas.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Stethoscope size={18} className="text-blue-600" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === "Concluido" ? "bg-gray-100 text-gray-500" : "bg-[#dcfce7] text-[#15803d]"}`}>
                {c.status}
              </span>
            </div>
            <p className="font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.pet}</p>
            <p className="text-xs text-[#6b7280] mb-3">{c.tutor}</p>
            <div className="space-y-1 border-t border-[#f3f4f6] pt-3">
              <div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Tipo</span><span className="text-[#374151] font-medium">{c.type}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Horário</span><span className="text-[#374151] font-medium">{new Date(c.starts_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Veterinário</span><span className="text-[#374151] font-medium">{c.veterinarian}</span></div>
            </div>
          </div>
        ))}
        {consultas.length === 0 && <div className="col-span-full bg-white rounded-xl border border-dashed border-[#d1d5db] p-10 text-center text-sm text-[#6b7280]">Nenhuma consulta veterinária agendada para hoje.</div>}
      </div>
    </div>
  );
}
