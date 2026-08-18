import { useEffect, useState } from "react";
import { getAdminOrders, updateAdminOrderStatus, type AdminOrder } from "../../services/api";
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
  const [todos, setTodos] = useState<AdminOrder[]>([]);
  useEffect(() => { getAdminOrders().then((result) => setTodos(result.data)).catch(() => setTodos([])); }, []);
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
                <td className="px-4 py-3 text-xs text-[#6b7280]">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3 text-[#374151] max-w-xs truncate"><span className="block">{p.products}</span><span className="text-xs text-[#9ca3af]">{p.customer}</span></td>
                <td className="px-4 py-3 font-semibold text-[#111827]">R$ {Number(p.total).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <select value={p.status} onChange={async (event) => { const updated = await updateAdminOrderStatus(p.id, event.target.value); setTodos((items) => items.map((item) => item.id === p.id ? { ...item, status: updated.status } : item)); }} className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-500"}`}><option>Recebido</option><option>Em preparacao</option><option>Pronto</option><option>Saiu para entrega</option><option>Entregue</option><option>Cancelado</option></select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
