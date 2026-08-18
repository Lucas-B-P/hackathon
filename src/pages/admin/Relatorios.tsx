import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Download, BarChart2 } from "lucide-react"

import { getAdminReports, type AdminReports } from "../../services/api"

const CATS = [
  "Vendas",
  "Financeiro",
  "Estoque",
  "Produtos",
  "Serviços",
  "Clientes",
  "Pets",
  "Funcionários",
]

const COLORS = ["#16a34a", "#86efac", "#4ade80", "#bbf7d0", "#dcfce7"]

const servicosData = [
  { name: "Banho + Tosa", value: 89 },

  { name: "Banho", value: 67 },

  { name: "Consulta Vet.", value: 43 },

  { name: "Tosa", value: 38 },

  { name: "Vacinação", value: 29 },

  { name: "Outros", value: 18 },
]

export default function Relatorios() {
  const [cat, setCat] = useState("Vendas")
  const [periodo, setPeriodo] = useState("mes")
  const [reports, setReports] = useState<AdminReports | null>(null)
  useEffect(() => {
    getAdminReports()
      .then((result) => setReports(result.data))
      .catch(() => setReports(null))
  }, [])
  const faturamentoMensal = reports?.revenue ?? []
  const servicosData = reports?.services ?? []

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Relatórios
          </h1>
          <p className="text-sm text-[#6b7280]">
            Central de análises e exportações
          </p>
        </div>
        <button className="flex items-center gap-2 border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] text-[#374151] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Download size={16} />
          Exportar relatório
        </button>
      </div>

      {/* Category picker */}
      <div className="flex gap-2 flex-wrap">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
              cat === c
                ? "bg-[#16a34a] text-white border-[#16a34a]"
                : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#d1d5db]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-3">
        <div className="flex bg-[#f3f4f6] rounded-xl p-1 gap-1">
          {[
            ["semana", "Semana"],
            ["mes", "Mês"],
            ["trimestre", "Trimestre"],
            ["ano", "Ano"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setPeriodo(k)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                periodo === k
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#6b7280]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto text-sm text-[#6b7280]">
          <input
            type="date"
            defaultValue="2026-08-01"
            className="px-3 py-1.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white"
          />
          <span>até</span>
          <input
            type="date"
            defaultValue="2026-08-14"
            className="px-3 py-1.5 border border-[#e5e7eb] rounded-xl text-sm outline-none focus:border-[#16a34a] bg-white"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
          <h2
            className="text-sm font-semibold text-[#111827] mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Faturamento — {cat}
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={faturamentoMensal}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v) => [
                  `R$ ${Number(v).toLocaleString("pt-BR")}`,
                  "",
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="receita"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
                name="Receita"
              />
              <Bar
                dataKey="despesas"
                fill="#fca5a5"
                radius={[6, 6, 0, 0]}
                name="Despesas"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
          <h2
            className="text-sm font-semibold text-[#111827] mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Serviços mais realizados
          </h2>
          <div className="flex gap-4">
            <ResponsiveContainer width="40%" height={200}>
              <PieChart>
                <Pie
                  data={servicosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {servicosData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2 flex flex-col justify-center">
              {servicosData.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-[#374151]">{s.name}</span>
                  </div>
                  <span className="font-semibold text-[#111827]">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center gap-2">
          <BarChart2 size={16} className="text-[#9ca3af]" />
          <h2
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Resumo — {cat}
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["Período", "Receita", "Despesas", "Lucro", "Variação"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {faturamentoMensal.map((m) => {
              const lucro = m.receita - m.despesas

              return (
                <tr key={m.mes} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-medium text-[#111827]">
                    {m.mes}/2026
                  </td>
                  <td className="px-4 py-3 text-[#16a34a] font-semibold">
                    R$ {m.receita.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-red-500">
                    R$ {m.despesas.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#111827]">
                    R$ {lucro.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full font-medium">
                      {m.despesas > 0
                        ? `+${((lucro / m.despesas) * 100).toFixed(0)}%`
                        : "—"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
