import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { funcionarios } from "../../data/mockData";

const CARGOS = ["Administrador", "Gerente", "Atendente", "Tosadora", "Tosador", "Veterinária", "Caixa"];
const emptyForm = { nome: "", cargo: "Atendente", telefone: "", email: "", nascimento: "", salario: "" };

const CARGO_COLORS: Record<string, string> = {
  Administrador: "bg-violet-100 text-violet-700",
  Gerente: "bg-blue-100 text-blue-700",
  Atendente: "bg-sky-100 text-sky-700",
  Tosadora: "bg-[#dcfce7] text-[#15803d]",
  Tosador: "bg-[#dcfce7] text-[#15803d]",
  Veterinária: "bg-amber-100 text-amber-700",
  Caixa: "bg-orange-100 text-orange-700",
};

const PERMISSIONS = [
  { label: "Dashboard", admin: true, gerente: true, atendente: true, caixa: false, tosador: false, vet: false },
  { label: "Vendas / PDV", admin: true, gerente: true, atendente: true, caixa: true, tosador: false, vet: false },
  { label: "Clientes", admin: true, gerente: true, atendente: true, caixa: false, tosador: false, vet: true },
  { label: "Financeiro", admin: true, gerente: true, atendente: false, caixa: true, tosador: false, vet: false },
  { label: "Configurações", admin: true, gerente: false, atendente: false, caixa: false, tosador: false, vet: false },
];

export default function Funcionarios() {
  const [tab, setTab] = useState<"lista" | "permissoes">("lista");
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
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Funcionários</h1>
          <p className="text-sm text-[#6b7280]">{funcionarios.length} colaboradores cadastrados</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />Novo funcionário
        </button>
      </div>

      <div className="flex bg-[#f3f4f6] rounded-xl p-1 gap-1 w-fit">
        <button onClick={() => setTab("lista")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === "lista" ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}>Equipe</button>
        <button onClick={() => setTab("permissoes")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === "permissoes" ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}>Permissões</button>
      </div>

      {tab === "lista" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {funcionarios.map(f => (
            <div key={f.id} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 hover:border-[#86efac] hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-[#dcfce7] flex items-center justify-center text-sm font-bold text-[#15803d]">
                  {f.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-[#111827] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.nome}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${CARGO_COLORS[f.cargo] || "bg-gray-100 text-gray-500"}`}>{f.cargo}</span>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-[#f3f4f6] pt-3">
                <p className="text-xs text-[#9ca3af]">{f.telefone}</p>
                <p className="text-xs text-[#9ca3af]">{f.email}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.status === "Ativo" ? "bg-[#dcfce7] text-[#15803d]" : "bg-gray-100 text-gray-500"}`}>{f.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]">Módulo</th>
                {["Administrador", "Gerente", "Atendente", "Caixa", "Tosador", "Veterinário"].map(c => (
                  <th key={c} className="text-center px-4 py-3 text-xs font-semibold text-[#9ca3af]">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {PERMISSIONS.map(p => (
                <tr key={p.label} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-medium text-[#374151]">{p.label}</td>
                  {[p.admin, p.gerente, p.atendente, p.caixa, p.tosador, p.vet].map((has, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      <span className={`inline-block w-5 h-5 rounded-full text-xs leading-5 font-bold ${has ? "bg-[#dcfce7] text-[#15803d]" : "bg-gray-100 text-gray-300"}`}>
                        {has ? "✓" : "–"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Novo Funcionário */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo funcionário</h2>
              <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center"><Check size={28} className="text-[#16a34a]" /></div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Funcionário cadastrado!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nome completo *</label>
                  <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Ana Paula Souza" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Cargo *</label>
                    <select value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                      {CARGOS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Salário (R$)</label>
                    <input value={form.salario} onChange={e => setForm(f => ({ ...f, salario: e.target.value }))} placeholder="0,00" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Telefone *</label>
                  <input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(11) 99999-0000" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="funcionario@patinhaspetshop.com.br" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Data de nascimento</label>
                  <input type="date" value={form.nascimento} onChange={e => setForm(f => ({ ...f, nascimento: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]">Cancelar</button>
                  <button onClick={handleSave} disabled={!form.nome || !form.telefone} className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 text-white font-semibold rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cadastrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
