import { useState } from "react";
import { Plus, X, Calendar, Stethoscope, Bath } from "lucide-react";
import { useNavigate } from "react-router";
import { pets } from "../../data/mockData";

const myPets = pets.filter(p => p.tutorId === 1);
const petHistory = [
  { tipo: "Banho + Tosa", data: "08/08/2026", icon: Bath, color: "bg-[#dcfce7] text-[#16a34a]" },
  { tipo: "Consulta Veterinária", data: "15/07/2026", icon: Stethoscope, color: "bg-blue-50 text-blue-600" },
  { tipo: "Vacinação V10", data: "10/06/2026", icon: Stethoscope, color: "bg-violet-50 text-violet-600" },
  { tipo: "Banho", data: "01/06/2026", icon: Bath, color: "bg-[#dcfce7] text-[#16a34a]" },
];

const ESPECIES = ["Cachorro", "Gato", "Ave", "Roedor", "Outro"];
const SEXOS = ["Macho", "Fêmea"];

interface PetForm {
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  nascimento: string;
  peso: string;
}

const emptyForm: PetForm = { nome: "", especie: "Cachorro", raca: "", sexo: "Macho", nascimento: "", peso: "" };

export default function MeusPets() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<typeof myPets[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<PetForm>(emptyForm);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setAddOpen(false);
      setForm(emptyForm);
    }, 1400);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meus Pets</h1>
          <p className="text-sm text-[#6b7280]">{myPets.length} pets cadastrados</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
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

      {/* Pet detail modal */}
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
              <button
                onClick={() => { setSelected(null); navigate("/portal/agendamento"); }}
                className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Calendar size={16} />
                Agendar serviço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add pet modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Adicionar pet</h2>
              <button onClick={() => { setAddOpen(false); setForm(emptyForm); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>

            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
                  <span className="text-3xl">🐾</span>
                </div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pet cadastrado com sucesso!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Emoji/foto placeholder */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#f0fdf4] border-2 border-dashed border-[#86efac] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#dcfce7] transition-colors">
                    <span className="text-3xl">🐾</span>
                    <span className="text-[10px] text-[#9ca3af]">Foto</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nome do pet *</label>
                  <input
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    placeholder="Ex: Rex, Luna, Mel..."
                    className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Espécie *</label>
                    <select
                      value={form.especie}
                      onChange={e => setForm(f => ({ ...f, especie: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white"
                    >
                      {ESPECIES.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Sexo *</label>
                    <select
                      value={form.sexo}
                      onChange={e => setForm(f => ({ ...f, sexo: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white"
                    >
                      {SEXOS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Raça</label>
                  <input
                    value={form.raca}
                    onChange={e => setForm(f => ({ ...f, raca: e.target.value }))}
                    placeholder="Ex: Golden Retriever, SRD..."
                    className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Data de nascimento</label>
                    <input
                      type="date"
                      value={form.nascimento}
                      onChange={e => setForm(f => ({ ...f, nascimento: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Peso (kg)</label>
                    <input
                      value={form.peso}
                      onChange={e => setForm(f => ({ ...f, peso: e.target.value }))}
                      placeholder="Ex: 8,5"
                      className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => { setAddOpen(false); setForm(emptyForm); }}
                    className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!form.nome.trim()}
                    className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Cadastrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
