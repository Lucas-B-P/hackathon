import { useState } from "react";
import { Stethoscope, Plus, X, Check } from "lucide-react";
import { pets } from "../../data/mockData";

const consultas = [
  { pet: "Rex", tutor: "Rafael Souza", horario: "10:00", tipo: "Check-up geral", vet: "Dra. Beatriz Vet", status: "Agendado" },
  { pet: "Luna", tutor: "Mariana Costa", horario: "11:30", tipo: "Vacinação V10", vet: "Dra. Beatriz Vet", status: "Concluído" },
  { pet: "Thor", tutor: "Lucas Oliveira", horario: "14:30", tipo: "Vacinação", vet: "Dra. Beatriz Vet", status: "Agendado" },
];

const TIPOS = ["Check-up geral", "Vacinação V10", "Vacinação antirrábica", "Consulta clínica", "Dermatologia", "Ortopedia", "Exames laboratoriais", "Cirurgia", "Outros"];
const emptyForm = { pet: "", tutor: "", data: "", horario: "", tipo: "Check-up geral", vet: "Dra. Beatriz Vet", obs: "" };

export default function Veterinario() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); setModalOpen(false); setForm(emptyForm); }, 1400);
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Veterinário</h1>
          <p className="text-sm text-[#6b7280]">Consultas e procedimentos de hoje</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />Nova consulta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {consultas.map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Stethoscope size={18} className="text-blue-600" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === "Concluído" ? "bg-gray-100 text-gray-500" : "bg-[#dcfce7] text-[#15803d]"}`}>
                {c.status}
              </span>
            </div>
            <p className="font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.pet}</p>
            <p className="text-xs text-[#6b7280] mb-3">{c.tutor}</p>
            <div className="space-y-1 border-t border-[#f3f4f6] pt-3">
              <div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Tipo</span><span className="text-[#374151] font-medium">{c.tipo}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Horário</span><span className="text-[#374151] font-medium">{c.horario}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Veterinária</span><span className="text-[#374151] font-medium">{c.vet}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Consulta */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nova consulta</h2>
              <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center"><Check size={28} className="text-[#16a34a]" /></div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Consulta agendada!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Pet *</label>
                  <select value={form.pet} onChange={e => setForm(f => ({ ...f, pet: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                    <option value="">Selecione o pet...</option>
                    {pets.map(p => <option key={p.id} value={p.nome}>{p.nome} — {p.tutor}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Tipo de consulta *</label>
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                    {TIPOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Data *</label>
                    <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Horário *</label>
                    <input type="time" value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Observações</label>
                  <textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} rows={2} placeholder="Sintomas, histórico relevante..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]">Cancelar</button>
                  <button onClick={handleSave} disabled={!form.pet || !form.data || !form.horario} className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 text-white font-semibold rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agendar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
