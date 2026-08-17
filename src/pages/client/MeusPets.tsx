import { useEffect, useState } from "react";
import { Bath, Calendar, Plus, Stethoscope, X } from "lucide-react";
import { createPet, getPets, type Pet } from "../../services/api";

const historyItems = [
  { label: "Banho + Tosa", date: "08/08/2026", icon: Bath, color: "bg-[#dcfce7] text-[#16a34a]" },
  { label: "Consulta Veterinaria", date: "15/07/2026", icon: Stethoscope, color: "bg-blue-50 text-blue-600" },
  { label: "Vacinacao V10", date: "10/06/2026", icon: Stethoscope, color: "bg-violet-50 text-violet-600" },
  { label: "Banho", date: "01/06/2026", icon: Bath, color: "bg-[#dcfce7] text-[#16a34a]" },
];

const emptyForm = { nome: "", especie: "Cao", raca: "", sexo: "", nascimento: "", peso: "" };

function formatDate(value?: string) {
  if (!value) return "Nao informado";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

export default function MeusPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selected, setSelected] = useState<Pet | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    getPets().then((result) => setPets(result.data)).catch(() => setPets([]));
  }, []);

  async function savePet(event: React.FormEvent) {
    event.preventDefault();
    const pet = await createPet(form);
    setPets((current) => [...current, pet]);
    setForm(emptyForm);
    setShowAdd(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div><h1 className="text-2xl font-bold text-[#111827]">Meus Pets</h1><p className="text-sm text-[#6b7280]">{pets.length} pets cadastrados</p></div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"><Plus size={16} />Adicionar pet</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => <div key={pet.id} onClick={() => setSelected(pet)} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6 cursor-pointer hover:border-[#86efac] hover:shadow-md transition-all">
          <div className="text-center mb-4"><div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] flex items-center justify-center text-4xl mx-auto mb-3">{pet.species === "Gato" ? "🐱" : "🐶"}</div><h3 className="font-bold text-[#111827] text-lg">{pet.name}</h3><p className="text-sm text-[#6b7280]">{pet.breed || pet.species}</p><p className="text-xs text-[#9ca3af] mt-0.5">{formatDate(pet.birth_date)}</p></div>
          <div className="space-y-1.5 border-t border-[#f3f4f6] pt-4"><div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Especie</span><span className="text-[#374151] font-medium">{pet.species}</span></div><div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Peso</span><span className="text-[#374151] font-medium">{pet.weight ? `${pet.weight} kg` : "Nao informado"}</span></div><div className="flex justify-between text-xs"><span className="text-[#9ca3af]">Ultimo atend.</span><span className="text-[#374151] font-medium">-</span></div></div>
        </div>)}
      </div>

      {showAdd && <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><form onSubmit={savePet} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-[#111827]">Adicionar pet</h2><p className="text-sm text-[#6b7280] mt-1">Cadastre as informacoes do seu companheiro.</p></div><button type="button" onClick={() => setShowAdd(false)} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button></div><div className="grid grid-cols-2 gap-3"><input required placeholder="Nome do pet" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} className="col-span-2 px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /><select value={form.especie} onChange={(event) => setForm({ ...form, especie: event.target.value })} className="px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm"><option>Cao</option><option>Gato</option><option>Outro</option></select><input placeholder="Raca" value={form.raca} onChange={(event) => setForm({ ...form, raca: event.target.value })} className="px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /><select value={form.sexo} onChange={(event) => setForm({ ...form, sexo: event.target.value })} className="px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm"><option value="">Sexo</option><option>Macho</option><option>Femea</option></select><input type="date" value={form.nascimento} onChange={(event) => setForm({ ...form, nascimento: event.target.value })} className="px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /><input type="number" min="0" step="0.1" placeholder="Peso em kg" value={form.peso} onChange={(event) => setForm({ ...form, peso: event.target.value })} className="px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm" /></div><button className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl">Salvar pet</button></form></div>}

      {selected && <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"><div className="flex items-center justify-between p-6 border-b border-[#f3f4f6]"><div className="flex items-center gap-3"><div className="w-14 h-14 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-3xl">{selected.species === "Gato" ? "🐱" : "🐶"}</div><div><h2 className="text-xl font-bold text-[#111827]">{selected.name}</h2><p className="text-sm text-[#6b7280]">{selected.breed || selected.species}</p></div></div><button onClick={() => setSelected(null)} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button></div><div className="p-6 space-y-5"><div><h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide mb-3">Informacoes</h3><div className="grid grid-cols-2 gap-y-2">{[["Sexo", selected.sex || "Nao informado"], ["Nascimento", formatDate(selected.birth_date)], ["Peso", selected.weight ? `${selected.weight} kg` : "Nao informado"]].map(([key, value]) => <div key={key}><p className="text-[11px] text-[#9ca3af]">{key}</p><p className="text-sm font-medium text-[#374151]">{value}</p></div>)}</div></div><div><h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide mb-3">Historico</h3><div className="space-y-2">{historyItems.map((item) => <div key={item.label} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl"><div className={`p-2 rounded-lg ${item.color}`}><item.icon size={14} /></div><div><p className="text-sm font-medium text-[#374151]">{item.label}</p><p className="text-xs text-[#9ca3af]">{item.date}</p></div></div>)}</div></div><button className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl flex items-center justify-center gap-2"><Calendar size={16} />Agendar servico</button></div></div></div>}
    </div>
  );
}
