import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Users, Package, DollarSign, AlertTriangle } from "lucide-react";
import { getAdminDashboard, getMe, type AdminDashboard } from "../../services/api";

const COLORS = ["#16a34a", "#86efac", "#4ade80", "#bbf7d0", "#dcfce7"];
const STATUS_COLORS: Record<string, string> = {
  Confirmado: "bg-blue-100 text-blue-700",
  "Em atendimento": "bg-amber-100 text-amber-700",
  Agendado: "bg-[#dcfce7] text-[#15803d]",
  Concluído: "bg-gray-100 text-gray-600",
  Cancelado: "bg-red-100 text-red-700",
};

let dashboardKpis: AdminDashboard["kpis"] | undefined;

const KPI = ({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) => {
  const money = (amount: number) => `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  const realValue = label === "Vendas hoje" ? money(dashboardKpis?.salesToday ?? 0) : label.includes("Faturamento") ? money(dashboardKpis?.monthlyRevenue ?? 0) : label === "Agendamentos hoje" ? String(dashboardKpis?.appointmentsToday ?? 0) : label === "Clientes ativos" ? String(dashboardKpis?.activeClients ?? 0) : label === "Contas a receber" ? money(dashboardKpis?.receivable ?? 0) : value;
  return (
  <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-[#6b7280] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{realValue}</p>
        <p className="text-xs text-[#9ca3af] mt-1">{sub}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={18} />
      </div>
    </div>
  </div>
  );
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [userName, setUserName] = useState("Usuário");
  useEffect(() => { getMe().then((user) => setUserName(user.nome)).catch(() => undefined); }, []);
  useEffect(() => { getAdminDashboard().then((result) => setDashboard(result.data)).catch(() => setDashboard(null)); }, []);
  const estoquesBaixos = dashboard?.lowStock ?? [];
  const agendamentos = dashboard?.agenda ?? [];
  const faturamentoMensal = dashboard?.revenue.map((item) => ({ mes: item.month, receita: Number(item.revenue), despesas: 0 })) ?? [];
  const totalCategories = dashboard?.categories.reduce((sum, item) => sum + Number(item.total), 0) || 1;
  const vendasCategoria = dashboard?.categories.map((item) => ({ name: item.name, value: Math.round(Number(item.total) / totalCategories * 100) })) ?? [];
  const kpis = dashboard?.kpis;
  dashboardKpis = kpis;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Bom dia, {userName} 👋
        </h1>
        <p className="text-[#6b7280] text-sm mt-0.5">Aqui está o resumo da operação de hoje, 14 de agosto de 2026 — Patinhas Pet Shop.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KPI label="Vendas hoje" value="R$ 1.847" sub="↑ 12% vs ontem" icon={TrendingUp} color="bg-[#dcfce7] text-[#16a34a]" />
        <KPI label="Faturamento do mês" value="R$ 22.100" sub="Meta: R$ 28.000" icon={DollarSign} color="bg-blue-50 text-blue-600" />
        <KPI label="Agendamentos hoje" value="7" sub="2 em atendimento" icon={Calendar} color="bg-violet-50 text-violet-600" />
        <KPI label="Clientes ativos" value="847" sub="+14 este mês" icon={Users} color="bg-amber-50 text-amber-600" />
        <KPI label="Estoque baixo" value={String(estoquesBaixos.length)} sub="Produtos abaixo do mínimo" icon={Package} color="bg-orange-50 text-orange-500" />
        <KPI label="Contas a receber" value="R$ 539" sub="Vencimento em 5 dias" icon={AlertTriangle} color="bg-red-50 text-red-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Faturamento */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-sm">
          <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Faturamento por período</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={faturamentoMensal} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRecv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDesp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR")}`, ""]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Area type="monotone" dataKey="receita" stroke="#16a34a" strokeWidth={2} fill="url(#gradRecv)" name="Receita" />
              <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} fill="url(#gradDesp)" name="Despesas" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-[#6b7280]"><span className="w-3 h-0.5 bg-[#16a34a] inline-block rounded-full" />Receita</span>
            <span className="flex items-center gap-1.5 text-xs text-[#6b7280]"><span className="w-3 h-0.5 bg-[#ef4444] inline-block rounded-full" />Despesas</span>
          </div>
        </div>

        {/* Vendas por categoria */}
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-sm">
          <h2 className="text-sm font-semibold text-[#111827] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Vendas por categoria</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={vendasCategoria} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {vendasCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {vendasCategoria.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-[#374151]">{item.name}</span>
                </span>
                <span className="font-medium text-[#111827]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Agenda de hoje */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
            <h2 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Agenda de hoje</h2>
            <span className="text-xs bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full font-medium">{agendamentos.length} agendamentos</span>
          </div>
          <div className="divide-y divide-[#f3f4f6]">
            {agendamentos.slice(0, 5).map(ag => (
              <div key={ag.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs font-mono text-[#6b7280] w-10 flex-shrink-0">{ag.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] truncate">{ag.pet}</p>
                  <p className="text-[11px] text-[#9ca3af] truncate">{ag.service}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[ag.status] || "bg-gray-100 text-gray-600"}`}>
                  {ag.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estoque baixo */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
            <h2 className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Estoque baixo</h2>
            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">{estoquesBaixos.length} produtos</span>
          </div>
          <div className="divide-y divide-[#f3f4f6]">
            {estoquesBaixos.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#9ca3af]">{p.category} · SKU: {p.sku}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-orange-600">{p.stock}</p>
                  <p className="text-[10px] text-[#9ca3af]">mín: {p.minimum_stock}</p>
                </div>
                {p.stock === 0 && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Esgotado</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
