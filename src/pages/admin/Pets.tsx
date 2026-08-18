import { useState } from "react";
import { Search, Plus, X, Check } from "lucide-react";
import { pets } from "../../data/mockData";
import { clientes } from "../../data/mockData";

const petHistory = [
  { tipo: "Banho + Tosa", data: "08/08/2026", obs: "Comportamento calmo" },
  { tipo: "Consulta Veterinária", data: "15/07/2026", obs: "Check-up geral" },
  { tipo: "Vacinação V10", data: "10/06/2026", obs: "Reforço anual" },
  { tipo: "Banho", data: "01/06/2026", obs: "Sem observações" },
];

const emptyForm = { nome: "", especie: "Cachorro", raca: "", sexo: "Macho", nascimento: "", peso: "", tutorId: "" };

export default function Pets() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof pets[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); setModalOpen(false); setForm(emptyForm); }, 1400);
  }
  const filtered = pets.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.tutor.toLowerCase().includes(search.toLowerCase()) ||
    p.raca.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pets</h1>
          <p className="text-sm text-[#6b7280]">{pets.length} animais cadastrados</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />Novo pet
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, raça ou tutor..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#16a34a] transition-colors"
        />
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-4 cursor-pointer hover:border-[#86efac] hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-2xl flex-shrink-0">
                {p.foto}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#111827] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.nome}</p>
                <p className="text-xs text-[#6b7280]">{p.raca}</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">{p.especie} · {p.sexo} · {p.idade}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f3f4f6] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#9ca3af]">Tutor</p>
                <p className="text-xs font-medium text-[#374151]">{p.tutor}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#9ca3af]">Último atend.</p>
                <p className="text-xs font-medium text-[#374151]">{p.ultimoAtendimento}</p>
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
                <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-3xl">{selected.foto}</div>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selected.nome}</h2>
                  <p className="text-sm text-[#6b7280]">{selected.raca} · {selected.especie}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Informações</h3>
                {[
                  ["Sexo", selected.sexo],
                  ["Nascimento", selected.nascimento],
                  ["Idade", selected.idade],
                  ["Peso", selected.peso],
                  ["Tutor", selected.tutor],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#f3f4f6]">
                    <span className="text-xs text-[#9ca3af]">{k}</span>
                    <span className="text-xs font-medium text-[#374151]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Histórico</h3>
                {petHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-[#f3f4f6]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#374151]">{h.tipo}</p>
                      <p className="text-[11px] text-[#9ca3af]">{h.data} · {h.obs}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Pet */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo pet</h2>
              <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center"><Check size={28} className="text-[#16a34a]" /></div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pet cadastrado!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nome do pet *</label>
                  <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Rex, Luna..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Tutor *</label>
                  <select value={form.tutorId} onChange={e => setForm(f => ({ ...f, tutorId: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                    <option value="">Selecione o tutor...</option>
                    {clientes.map(c => <option key={c.id} value={String(c.id)}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Espécie *</label>
                    <select value={form.especie} onChange={e => setForm(f => ({ ...f, especie: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                      {["Cachorro", "Gato", "Ave", "Roedor", "Outro"].map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Sexo *</label>
                    <select value={form.sexo} onChange={e => setForm(f => ({ ...f, sexo: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                      {["Macho", "Fêmea"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Raça</label>
                  <input value={form.raca} onChange={e => setForm(f => ({ ...f, raca: e.target.value }))} placeholder="Ex: Golden Retriever, SRD..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nascimento</label>
                    <input type="date" value={form.nascimento} onChange={e => setForm(f => ({ ...f, nascimento: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Peso (kg)</label>
                    <input value={form.peso} onChange={e => setForm(f => ({ ...f, peso: e.target.value }))} placeholder="8,5" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]">Cancelar</button>
                  <button onClick={handleSave} disabled={!form.nome || !form.tutorId} className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 text-white font-semibold rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cadastrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
