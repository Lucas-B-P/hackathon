import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Plus } from "lucide-react";
import { getAdminFinance, type AdminFinance } from "../../services/api";

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
  const [finance, setFinance] = useState<AdminFinance | null>(null);
  useEffect(() => { getAdminFinance().then((result) => setFinance(result.data)).catch(() => setFinance(null)); }, []);
  const faturamentoMensal = finance?.revenue.map((item) => ({ mes: item.month, receita: Number(item.revenue), despesas: 0 })) ?? [];
  const mapEntry = (item: AdminFinance["entries"][number]) => ({ ...item, descricao: item.description, categoria: item.category, valor: Number(item.amount), vencimento: new Date(item.due_date).toLocaleDateString("pt-BR"), forma: item.payment_method ?? "—" });
  const contasReceber = finance?.entries.filter((item) => item.type === "RECEBER").map(mapEntry) ?? [];
  const contasPagar = finance?.entries.filter((item) => item.type === "PAGAR").map(mapEntry) ?? [];

  const receita = finance?.summary.revenue ?? 0;
  const despesas = finance?.summary.expenses ?? 0;
  const lucro = finance?.summary.profit ?? 0;
  const aReceber = finance?.summary.receivable ?? 0;
  const aPagar = finance?.summary.payable ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Financeiro</h1>
          <p className="text-sm text-[#6b7280]">Resumo financeiro — Agosto 2026</p>
        </div>
        <button className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={16} />
          Lançamento
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
    </div>
  );
}
