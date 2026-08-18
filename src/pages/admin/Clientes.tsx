import { useState } from "react";
import { Search, Plus, ChevronRight, X, Check } from "lucide-react";
import { clientes } from "../../data/mockData";

const emptyForm = { nome: "", cpf: "", telefone: "", email: "", nascimento: "", endereco: "" };

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); setModalOpen(false); setForm(emptyForm); }, 1400);
  }
  const filtered = clientes.filter(c =>
    (c.nome.toLowerCase().includes(search.toLowerCase()) || c.telefone.includes(search)) &&
    (statusFilter === "Todos" || c.status === statusFilter)
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Clientes</h1>
          <p className="text-sm text-[#6b7280]">{clientes.length} tutores cadastrados</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />Novo cliente
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#e5e7eb] rounded-xl outline-none focus:border-[#16a34a] transition-colors"
          />
        </div>
        <div className="flex bg-[#f3f4f6] rounded-xl p-1 gap-1">
          {["Todos", "Ativo", "Inativo"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${statusFilter === s ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["Nome", "Telefone", "E-mail", "Pets", "Última compra", "Último atendimento", "Status", ""].map((h, idx) => (
                <th key={h} className={`text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]${idx === 2 || idx === 4 || idx === 5 ? " hidden md:table-cell" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-[#fafafa] transition-colors cursor-pointer group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center text-xs font-bold text-[#15803d] flex-shrink-0">
                      {c.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="font-medium text-[#111827]">{c.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6b7280]">{c.telefone}</td>
                <td className="hidden md:table-cell px-4 py-3 text-[#6b7280]">{c.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-[#f3f4f6] text-[#374151] text-xs px-2 py-0.5 rounded-full font-medium">{c.pets}</span>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-[#6b7280] text-xs">{c.ultimaCompra}</td>
                <td className="hidden md:table-cell px-4 py-3 text-[#6b7280] text-xs">{c.ultimoAtendimento}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === "Ativo" ? "bg-[#dcfce7] text-[#15803d]" : "bg-gray-100 text-gray-500"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ChevronRight size={15} className="text-[#d1d5db] group-hover:text-[#9ca3af] transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af] text-sm">Nenhum cliente encontrado.</div>
        )}
      </div>

      {/* Modal Novo Cliente */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo cliente</h2>
              <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center"><Check size={28} className="text-[#16a34a]" /></div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cliente cadastrado!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Nome completo *</label>
                  <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Maria Silva" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">CPF</label>
                    <input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Telefone *</label>
                    <input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(11) 99999-0000" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">E-mail</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="cliente@email.com" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Data de nascimento</label>
                  <input type="date" value={form.nascimento} onChange={e => setForm(f => ({ ...f, nascimento: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Endereço</label>
                  <input value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} placeholder="Rua, número, bairro..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
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
