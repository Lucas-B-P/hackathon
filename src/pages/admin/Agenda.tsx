import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { getAdminAppointments, type AdminAppointment } from "../../services/api";

const STATUS_COLORS: Record<string, string> = {
  Agendado: "bg-[#dcfce7] text-[#15803d] border-[#86efac]",
  Confirmado: "bg-blue-50 text-blue-700 border-blue-200",
  "Em atendimento": "bg-amber-50 text-amber-700 border-amber-200",
  Concluído: "bg-gray-100 text-gray-500 border-gray-200",
  Cancelado: "bg-red-50 text-red-600 border-red-200",
};

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const [MONTH, YEAR] = ["Agosto", "2026"];
const today = 14;

const calDays = Array.from({ length: 35 }, (_, i) => {
  const d = i - 3;
  return d >= 1 && d <= 31 ? d : null;
});

type View = "dia" | "semana" | "mes";

export default function Agenda() {
  const [view, setView] = useState<View>("semana");
  const [modalOpen, setModalOpen] = useState(false);
  const [agendamentos, setAgendamentos] = useState<AdminAppointment[]>([]);
  useEffect(() => { getAdminAppointments().then((result) => setAgendamentos(result.data)).catch(() => setAgendamentos([])); }, []);

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agenda</h1>
          <p className="text-sm text-[#6b7280]">Gerencie todos os agendamentos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <Plus size={16} />
          Novo agendamento
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 bg-white border border-[#e5e7eb] rounded-xl p-3 shadow-sm">
        <button className="p-1.5 hover:bg-[#f3f4f6] rounded-lg text-[#6b7280] transition-colors"><ChevronLeft size={18} /></button>
        <span className="font-semibold text-sm text-[#111827] mx-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {view === "mes" ? `${MONTH} ${YEAR}` : `11 – 17 de ${MONTH} de ${YEAR}`}
        </span>
        <button className="p-1.5 hover:bg-[#f3f4f6] rounded-lg text-[#6b7280] transition-colors"><ChevronRight size={18} /></button>
        <button className="ml-2 text-xs text-[#16a34a] hover:underline font-medium">Hoje</button>
        <div className="ml-auto flex bg-[#f3f4f6] rounded-lg p-1 gap-1">
          {(["dia", "semana", "mes"] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                view === v ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"
              }`}
            >
              {v === "mes" ? "Mês" : v === "semana" ? "Semana" : "Dia"}
            </button>
          ))}
        </div>
      </div>

      {view === "mes" ? (
        /* Month view */
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[#e5e7eb]">
            {WEEK_DAYS.map(d => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-[#9ca3af]">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-y divide-[#f3f4f6]">
            {calDays.map((day, i) => (
              <div key={i} className={`min-h-[90px] p-2 text-xs ${day === today ? "bg-[#f0fdf4]" : ""} ${!day ? "bg-[#fafafa]" : ""}`}>
                {day && (
                  <>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 ${day === today ? "bg-[#16a34a] text-white" : "text-[#374151]"}`}>{day}</span>
                    {day === today && agendamentos.slice(0, 3).map(ag => (
                      <div key={ag.id} className="text-[10px] bg-[#dcfce7] text-[#15803d] rounded px-1 py-0.5 mb-0.5 truncate">
                        {ag.horario} {ag.pet}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : view === "semana" ? (
        /* Week view */
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="grid border-b border-[#e5e7eb]" style={{ gridTemplateColumns: "60px repeat(7,1fr)" }}>
            <div />
            {["11 Dom", "12 Seg", "13 Ter", "14 Qua", "15 Qui", "16 Sex", "17 Sáb"].map((d, i) => (
              <div key={d} className={`py-3 text-center text-xs ${i === 3 ? "font-bold text-[#16a34a]" : "text-[#6b7280] font-medium"}`}>{d}</div>
            ))}
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {HOURS.map(h => (
              <div key={h} className="grid border-b border-[#f3f4f6]" style={{ gridTemplateColumns: "60px repeat(7,1fr)" }}>
                <div className="py-3 px-2 text-[10px] text-[#9ca3af] text-right font-mono">{h}</div>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className={`border-l border-[#f3f4f6] min-h-[52px] p-1 ${i === 3 ? "bg-[#f0fdf4]/50" : ""}`}>
                    {i === 3 && agendamentos.find(a => a.horario === h) && (() => {
                      const ag = agendamentos.find(a => a.horario === h)!;
                      const cls = STATUS_COLORS[ag.status] || "";
                      return (
                        <div className={`text-[10px] rounded-lg px-2 py-1.5 border ${cls} leading-tight`}>
                          <p className="font-semibold truncate">{ag.pet}</p>
                          <p className="opacity-70 truncate">{ag.servico}</p>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Day view */
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f3f4f6]">
            <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quarta-feira, 14 de agosto</p>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {HOURS.map(h => {
              const ag = agendamentos.find(a => a.horario === h);
              return (
                <div key={h} className="flex border-b border-[#f3f4f6] min-h-[64px]">
                  <div className="w-16 py-3 px-3 text-[11px] text-[#9ca3af] font-mono flex-shrink-0 border-r border-[#f3f4f6]">{h}</div>
                  <div className="flex-1 p-2">
                    {ag && (
                      <div className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${STATUS_COLORS[ag.status]}`}>
                        <Clock size={14} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">{ag.pet} — {ag.servico}</p>
                          <p className="text-xs opacity-70">Tutor: {ag.tutor} · Responsável: {ag.funcionario}</p>
                        </div>
                        <span className="ml-auto text-[11px] font-medium">{ag.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal novo agendamento */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo Agendamento</h2>
            <div className="space-y-4">
              {[["Cliente", "Selecionar cliente"], ["Pet", "Selecionar pet"], ["Serviço", "Selecionar serviço"], ["Funcionário", "Selecionar funcionário"]].map(([label, ph]) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>
                  <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm text-[#6b7280] outline-none focus:border-[#16a34a]">
                    <option>{ph}</option>
                  </select>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Data</label>
                  <input type="date" defaultValue="2026-08-14" className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Horário</label>
                  <input type="time" defaultValue="09:00" className="w-full px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors">Cancelar</button>
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 bg-[#16a34a] text-white rounded-xl text-sm font-semibold hover:bg-[#15803d] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
