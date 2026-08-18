import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Plus, X, Check } from "lucide-react";
import { faturamentoMensal, contasReceber, contasPagar } from "../../data/mockData";

const emptyLanc = { descricao: "", tipo: "Receita", categoria: "", valor: "", vencimento: "", forma: "PIX", obs: "" };

const STATUS_CR: Record<string, string> = {
  Pendente: "bg-amber-50 text-amber-600",
  Recebido: "bg-[#dcfce7] text-[#15803d]",
};
const STATUS_CP: Record<string, string> = {
  Pendente: "bg-amber-50 text-amber-600",
  Pago: "bg-[#dcfce7] text-[#15803d]",
};

export default function Financeiro() {
  const [tab, setTab] = useState<"receber" | "pagar">("receber");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyLanc);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => { setSaved(false); setModalOpen(false); setForm(emptyLanc); }, 1400);
  }

  const receita = faturamentoMensal.at(-1)!.receita;
  const despesas = faturamentoMensal.at(-1)!.despesas;
  const lucro = receita - despesas;
  const aReceber = contasReceber.filter(c => c.status === "Pendente").reduce((a, c) => a + c.valor, 0);
  const aPagar = contasPagar.filter(c => c.status === "Pendente").reduce((a, c) => a + c.valor, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Financeiro</h1>
          <p className="text-sm text-[#6b7280]">Resumo financeiro — Agosto 2026</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />Lançamento
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Receita", value: receita, icon: TrendingUp, color: "text-[#16a34a] bg-[#dcfce7]", fmt: true },
          { label: "Despesas", value: despesas, icon: TrendingDown, color: "text-red-500 bg-red-50", fmt: true },
          { label: "Lucro", value: lucro, icon: DollarSign, color: "text-blue-600 bg-blue-50", fmt: true },
          { label: "A receber", value: aReceber, icon: AlertCircle, color: "text-amber-600 bg-amber-50", fmt: true },
          { label: "A pagar", value: aPagar, icon: AlertCircle, color: "text-orange-500 bg-orange-50", fmt: true },
        ].map(({ label, value, icon: Icon, color, fmt }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[#e5e7eb] shadow-sm">
            <div className={`inline-flex p-2 rounded-lg mb-2 ${color}`}><Icon size={16} /></div>
            <p className="text-xs text-[#9ca3af]">{label}</p>
            <p className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {fmt ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Fluxo financeiro mensal</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={faturamentoMensal} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR")}`, ""]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Area type="monotone" dataKey="receita" stroke="#16a34a" strokeWidth={2} fill="url(#gR)" name="Receita" />
            <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} fill="url(#gD)" name="Despesas" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex bg-[#f3f4f6] rounded-xl p-1 gap-1 w-fit mb-4">
          <button onClick={() => setTab("receber")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === "receber" ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}>Contas a receber</button>
          <button onClick={() => setTab("pagar")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === "pagar" ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}>Contas a pagar</button>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                {["Descrição", "Categoria", "Valor", "Vencimento", "Forma", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(tab === "receber" ? contasReceber : contasPagar).map(c => {
                const sc = tab === "receber" ? STATUS_CR[c.status] : STATUS_CP[c.status];
                return (
                  <tr key={c.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#111827]">{c.descricao}</td>
                    <td className="px-4 py-3 text-xs text-[#6b7280]">{c.categoria}</td>
                    <td className="px-4 py-3 font-semibold text-[#111827]">R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-xs text-[#6b7280]">{c.vencimento}</td>
                    <td className="px-4 py-3 text-xs text-[#6b7280]">{c.forma}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc}`}>{c.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamento */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#f3f4f6]">
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Novo lançamento</h2>
              <button onClick={() => { setModalOpen(false); setForm(emptyLanc); }} className="p-2 hover:bg-[#f3f4f6] rounded-xl text-[#9ca3af]"><X size={20} /></button>
            </div>
            {saved ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center"><Check size={28} className="text-[#16a34a]" /></div>
                <p className="font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lançamento registrado!</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="flex bg-[#f3f4f6] rounded-xl p-1 gap-1">
                  {["Receita", "Despesa"].map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, tipo: t }))} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${form.tipo === t ? `${t === "Receita" ? "bg-[#16a34a] text-white" : "bg-red-500 text-white"}` : "text-[#6b7280]"}`}>{t}</button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Descrição *</label>
                  <input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Ex: Recebimento de serviço, Pagamento fornecedor..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Valor (R$) *</label>
                    <input value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="0,00" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Vencimento *</label>
                    <input type="date" value={form.vencimento} onChange={e => setForm(f => ({ ...f, vencimento: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Categoria</label>
                    <input value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} placeholder="Ex: Serviços, Fornecedor..." className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">Forma</label>
                    <select value={form.forma} onChange={e => setForm(f => ({ ...f, forma: e.target.value }))} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white">
                      {["PIX", "Dinheiro", "Débito", "Crédito", "Boleto", "Transferência"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Observações</label>
                  <textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setModalOpen(false); setForm(emptyLanc); }} className="flex-1 py-2.5 border border-[#e5e7eb] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]">Cancelar</button>
                  <button onClick={handleSave} disabled={!form.descricao || !form.valor || !form.vencimento} className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 text-white font-semibold rounded-xl transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Registrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
