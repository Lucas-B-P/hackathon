import { pedidosCliente } from "../../data/mockData";

const STATUS_COLORS: Record<string, string> = {
  Entregue: "bg-[#dcfce7] text-[#15803d]",
  "Em preparação": "bg-amber-50 text-amber-600",
  Cancelado: "bg-red-50 text-red-600",
  Recebido: "bg-blue-50 text-blue-600",
};

const todos = [
  ...pedidosCliente,
  { id: "#1035", data: "28/07/2026", produtos: "Coleira Antipulgas", valor: 89.90, status: "Entregue" },
  { id: "#1028", data: "15/07/2026", produtos: "Ração Gatos Whiskas 3kg", valor: 49.90, status: "Entregue" },
  { id: "#1055", data: "13/08/2026", produtos: "Brinquedo Kong Classic", valor: 39.90, status: "Recebido" },
];

export default function Pedidos() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pedidos</h1>
        <p className="text-sm text-[#6b7280]">{todos.length} pedidos registrados</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["Pedido", "Data", "Produtos", "Valor", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#9ca3af]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {todos.map(p => (
              <tr key={p.id} className="hover:bg-[#fafafa] transition-colors cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#374151]">{p.id}</td>
                <td className="px-4 py-3 text-xs text-[#6b7280]">{p.data}</td>
                <td className="px-4 py-3 text-[#374151] max-w-xs truncate">{p.produtos}</td>
                <td className="px-4 py-3 font-semibold text-[#111827]">R$ {p.valor.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-500"}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
