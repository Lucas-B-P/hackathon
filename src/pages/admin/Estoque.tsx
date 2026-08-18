import { useState } from "react";
import { Package, TrendingDown, AlertTriangle, DollarSign, Plus, X, Check } from "lucide-react";
import { produtos, movimentacoesEstoque } from "../../data/mockData";

const TIPO_COLORS: Record<string, string> = {
  Entrada: "bg-[#dcfce7] text-[#15803d]",
  Saída: "bg-red-50 text-red-600",
  Ajuste: "bg-amber-50 text-amber-600",
  Perda: "bg-gray-100 text-gray-500",
};

const emptyForm = { produto: "", tipo: "Entrada", quantidade: "", motivo: "", obs: "" };

export default function Estoque() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  const total = produtos.reduce((a, p) => a + p.estoque, 0);
  const baixo = produtos.filter(p => p.estoque > 0 && p.estoque <= p.estoqueMin).length;
  const zero = produtos.filter(p => p.estoque === 0).length;
  const valor = produtos.reduce((a, p) => a + p.estoque * p.custo, 0);

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); setModalOpen(false); setForm(emptyForm); }, 1400);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Estoque</h1>
          <p className="text-sm text-[#6b7280]">Controle de movimentações e inventário</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />Registrar movimentação
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total de itens", value: total, icon: Package, color: "bg-[#dcfce7] text-[#16a34a]" },
          { label: "Estoque baixo", value: baixo, icon: AlertTriangle, color: "bg-orange-50 text-orange-500" },
          { label: "Sem estoque", value: zero, icon: TrendingDown, color: "bg-red-50 text-red-500" },
          { label: "Valor total", value: `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "bg-blue-50 text-blue-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}><Icon size={20} /></div>
            <div>
              <p className="text-xs text-[#9ca3af]">{label}</p>
              <p className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#f3f4f6]">
          <h2 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Movimentações recentes</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["Produto", "Tipo", "Qtd.", "Motivo", "Usuário", "Data"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {movimentacoesEstoque.map(m => (
              <tr key={m.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-4 py-3 font-medium text-[#111827]">{m.produto}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_COLORS[m.tipo]}`}>{m.tipo}</span></td>
                <td className="px-4 py-3 font-mono text-sm"><span className={m.quantidade < 0 ? "text-red-500" : "text-[#111827]"}>{m.quantidade > 0 ? "+" : ""}{m.quantidade}</span></td>
                <td className="px-4 py-3 text-[#6b7280]">{m.motivo}</td>
                <td className="px-4 py-3 text-[#6b7280]">{m.usuario}</td>
                <td className="px-4 py-3 text-xs text-[#9ca3af]">{m.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#f3f4f6]">
          <h2 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Produtos com alerta de estoque</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["Produto", "SKU", "Estoque atual", "Mínimo", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {produtos.filter(p => p.estoque <= p.estoqueMin).map(p => (
              <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-4 py-3 font-medium text-[#111827]">{p.nome}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#9ca3af]">{p.sku}</td>
                <td className="px-4 py-3 font-bold text-orange-500">{p.estoque}</td>
                <td className="px-4 py-3 text-[#9ca3af]">{p.estoqueMin}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.estoque === 0 ? "bg-red-100 text-red-600" : "bg-orange-50 text-orange-500"}`}>
                    {p.estoque === 0 ? "Esgotado" : "Baixo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Registrar Movimentação */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Registrar movimentação</h2>
              <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center"><Check size={28} className="text-[#16a34a]" /></div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Movimentação registrada!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Produto *</label>
                  <select value={form.produto} onChange={e => setForm(f => ({ ...f, produto: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                    <option value="">Selecione...</option>
                    {produtos.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Tipo *</label>
                    <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                      {["Entrada", "Saída", "Ajuste", "Perda"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Quantidade *</label>
                    <input value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} placeholder="0" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Motivo *</label>
                  <input value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Ex: Compra de fornecedor, venda PDV..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Observações</label>
                  <textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} rows={2} placeholder="Informações adicionais..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]">Cancelar</button>
                  <button onClick={handleSave} disabled={!form.produto || !form.quantidade || !form.motivo} className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 text-white font-semibold rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Registrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
